import { baseUrl } from "@/lib/utils/baseUrl";

export function resolveFileUrl(url?: string | null): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";

  if (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = trimmed.replace(/^\//, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export function toAbsoluteFileUrl(src: string) {
  return resolveFileUrl(src);
}
