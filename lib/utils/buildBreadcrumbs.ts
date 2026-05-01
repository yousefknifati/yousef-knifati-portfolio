import { Crumb } from "@/components/layout/PageHero";

type BuildBreadcrumbsArgs = {
  pathname: string;
  homeLabel?: string;
  baseLabel: string;
  baseHref: string;
  detailsLabel: string;
  listPath?: string;
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function buildBreadcrumbs({
  pathname,
  homeLabel = "Home",
  baseLabel,
  baseHref,
  detailsLabel,
  listPath,
}: BuildBreadcrumbsArgs): Crumb[] {
  const current = normalizePath(pathname);
  const list = normalizePath(listPath ?? baseHref);

  const isDetails = current.startsWith(`${list}/`) && current !== list;

  const base: Crumb[] = [
    { label: homeLabel, href: "/" },
    { label: baseLabel, href: baseHref },
  ];

  return isDetails ? [...base, { label: detailsLabel }] : base;
}
