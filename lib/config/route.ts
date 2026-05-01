export const AUTH_PAGES = ["/sign-in", "/sign-up", "/forgot-password", "/verify-code-forget-password", "/reset-password"] as const;

export const PUBLIC_LIST_PAGES = ["/", "/jobs", "/work-contracts", "/study-abroad"] as const;

export const DETAILS_PREFIXES = ["/jobs/", "/work-contracts/", "/study-abroad/","/profile"] as const;

export const IGNORED_PATH_PREFIXES = ["/_next", "/api", "/favicon.ico", "/robots.txt"] as const;

export function startsWithAny(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((p) => pathname.startsWith(p));
}

export function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function isPublicListPage(pathname: string) {
  return PUBLIC_LIST_PAGES.some((p) => pathname === p);
}

export function isProtectedDetailsPage(pathname: string) {
  return DETAILS_PREFIXES.some((p) => pathname.startsWith(p));
}

