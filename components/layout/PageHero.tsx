"use client";

import Link from "next/link";
import SectionContainer from "@/components/shared/SectionContainer";
import { cn } from "@/lib/utils/cn";

export type Crumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  title: string;
  breadcrumbs?: Crumb[];
  className?: string;
  heightClassName?: string;
};

export default function PageHero({
  title,
  breadcrumbs = [],
  className,
  heightClassName = "min-h-[180px] md:min-h-[240px]",
}: PageHeroProps) {
  const lastIndex = breadcrumbs.length - 1;

  return (
    <section className={cn(" w-full", className)}>
      <SectionContainer maxWidth="full" padded={false} className={cn("py-10 flex items-center justify-center", heightClassName)}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mt-3">
              <ol className="flex items-center justify-center gap-2 text-sm text-white/80">
                {insideCrumbs(breadcrumbs, lastIndex)}
              </ol>
            </nav>
          )}
        </div>
      </SectionContainer>
    </section>
  );
}

function insideCrumbs(breadcrumbs: Crumb[], lastIndex: number) {
  return breadcrumbs.map((item, idx) => {
    const isLast = idx === lastIndex;

    const content = item.href && !isLast ? (
      <Link href={item.href} className="hover:text-white transition-colors">
        {item.label}
      </Link>
    ) : (
      <span className={cn(isLast ? "text-primary-normal" : "text-white/80")}>
        {item.label}
      </span>
    );

    return (
      <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
        {content}
        {!isLast && <span className="text-white/50">›</span>}
      </li>
    );
  });
}
