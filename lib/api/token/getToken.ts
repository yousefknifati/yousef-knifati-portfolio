function getTokenFromDocumentCookie() {
  if (typeof document === "undefined") return null;

  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;

    const key = part.slice(0, eqIndex);
    if (key !== "token") continue;

    const value = part.slice(eqIndex + 1);
    return decodeURIComponent(value) || null;
  }

  return null;
}

export async function getToken() {
  if (typeof window !== "undefined") {
    return getTokenFromDocumentCookie();
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}
