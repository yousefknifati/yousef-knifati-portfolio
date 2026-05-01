"use client";

import * as React from "react";
import Image from "next/image";
import countries from "@/data/countries.json";
import { cn } from "@/lib/utils/cn";

type CountryItem = {
  name: string;
  code: string;
  nameAr: string;
  nameDe: string;
};

type CountryFlagProps = {
  countryName?: string | null;
  className?: string;
  imageClassName?: string;
  showLoadingState?: boolean;
};

const countryList = countries as CountryItem[];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

export default function CountryFlag({
  countryName,
  className,
  imageClassName,
  showLoadingState = true,
}: CountryFlagProps) {
  const matchedCountry = React.useMemo(() => {
    const input = (countryName ?? "").trim();
    if (!input) return undefined;
    const normalizedInput = normalize(input);

    return countryList.find((country) =>
      [country.name, country.nameAr, country.nameDe, country.code].some(
        (alias) => normalize(alias) === normalizedInput,
      ),
    );
  }, [countryName]);

  const code = matchedCountry?.code?.toLowerCase();
  const src = code ? `https://flagcdn.com/w40/${code}.png` : "";

  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  if (!src) return null;

  return (
    <span
      className={cn(
        "relative inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-secondary-light-hover bg-white",
        className,
      )}
    >
      {showLoadingState && !isLoaded ? (
        <span className="absolute inset-0 animate-pulse bg-secondary-light-hover" />
      ) : null}
      <Image
        src={src}
        alt={`${matchedCountry?.name ?? countryName ?? "Country"} flag`}
        width={24}
        height={16}
        className={cn("h-full w-full object-cover", imageClassName)}
        loading="lazy"
        unoptimized
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
    </span>
  );
}
