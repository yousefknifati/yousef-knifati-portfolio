import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken } from "../api/token/getToken";
import { clearAuthSession } from "../utils/auth/clearAuthSession";
import { baseUrl } from "../utils/baseUrl";

type Lang = "en" | "ar" | "de";

const LANG_COOKIE = "lang";

const api = axios.create({
  baseURL: baseUrl,
  headers: { Accept: "application/json" },
});

/* ----------------------------------------------------------------------------
  Helpers
---------------------------------------------------------------------------- */
type ApiErrorPayload = {
  errorMessage?: string;
  message?: string;
};

function getErrorMessage(error: AxiosError<ApiErrorPayload>): string {
  const data = error.response?.data;
  return (
    data?.errorMessage ?? data?.message ?? error.message ?? "Unknown error"
  );
}

function isClientNotFoundError(data?: ApiErrorPayload): boolean {
  return String(data?.errorMessage ?? "").trim() === "ClientNotFound";
}

function readCookieFromDocument(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;

    const k = part.slice(0, eqIndex);
    if (k !== name) continue;

    const v = part.slice(eqIndex + 1);
    return decodeURIComponent(v);
  }

  return undefined;
}
const isLang = (v: unknown): v is Lang => v === "ar" || v === "en" || v === "de";

function normalizeCookieLang(v: unknown): Lang | undefined {
  if (v === "du") return "de";
  return isLang(v) ? v : undefined;
}

function normalizeLang(value?: unknown): Lang | undefined {
  return normalizeCookieLang(value);
}

function getClientLang(): Lang {
  try {
    const fromCookie = normalizeLang(readCookieFromDocument(LANG_COOKIE));
    if (fromCookie) return fromCookie;

    const htmlLang = normalizeLang(document.documentElement.lang);
    if (htmlLang) return htmlLang;

    return "en";
  } catch {
    return "en";
  }
}
async function getServerLang(): Promise<Lang> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const v = cookieStore.get(LANG_COOKIE)?.value;
    return normalizeLang(v) ?? "en";
  } catch {
    return "en";
  }
}

async function resolveLang(): Promise<Lang> {
  if (typeof window === "undefined") return await getServerLang();
  return getClientLang();
}

const SESSION_EXPIRED_PATH = "/sign-in?error=sessionExpired";

function clientRedirectToLogin() {
  if (typeof window !== "undefined") {
    const loginUrl = new URL(SESSION_EXPIRED_PATH, window.location.origin);
    window.location.replace(loginUrl.toString());
  }
}

async function serverRedirectToLogin() {
  try {
    const { redirect } = await import("next/navigation");
    redirect(SESSION_EXPIRED_PATH);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    // Ignore in server contexts where next/navigation redirect is not available.
  }
}

/* ----------------------------------------------------------------------------
  REQUEST interceptor: add Authorization + language
---------------------------------------------------------------------------- */
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const headers = new AxiosHeaders(config.headers);
    config.headers = headers;

    const skipAuth = headers.get("x-skip-auth") === "1";
    if (skipAuth) headers.delete("x-skip-auth");

    if (!skipAuth) {
      const token = await getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.get("Accept-Language")) {
      headers.set("Accept-Language", await resolveLang());
    }

    if (
      config.data &&
      typeof window !== "undefined" &&
      !(config.data instanceof FormData)
    ) {
      if (!headers.get("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    return config;
  }
);

/* ----------------------------------------------------------------------------
  RESPONSE interceptor: redirect on 401 (no refresh token)
---------------------------------------------------------------------------- */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const headers = new AxiosHeaders(error?.config?.headers);
    const hasAuthorizationHeader = Boolean(headers.get("Authorization"));

    const shouldForceLogout =
      hasAuthorizationHeader &&
      (status === 401 || isClientNotFoundError(data));

    if (shouldForceLogout) {
      await clearAuthSession();

      if (typeof window === "undefined") {
        await serverRedirectToLogin();
      }
      clientRedirectToLogin();
    }

    error.message = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
