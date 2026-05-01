const AUTH_COOKIE_KEYS = [
  "token",
  "refreshToken",
  "roleType",
  "isEmailConfirmed",
] as const;

const AUTH_STORAGE_KEYS = ["token", "refreshToken"] as const;

function clearBrowserCookie(name: string): void {
  if (typeof document === "undefined") return;

  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export async function clearAuthSession(): Promise<void> {
  if (typeof window !== "undefined") {
    for (const key of AUTH_COOKIE_KEYS) {
      clearBrowserCookie(key);
    }

    for (const key of AUTH_STORAGE_KEYS) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore browser storage access errors (private mode, disabled storage).
      }

      try {
        window.sessionStorage.removeItem(key);
      } catch {
        // Ignore browser storage access errors (private mode, disabled storage).
      }
    }

    return;
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    for (const key of AUTH_COOKIE_KEYS) {
      cookieStore.delete(key);
    }
  } catch {
    // Ignore when running in contexts without mutable cookies.
  }
}

