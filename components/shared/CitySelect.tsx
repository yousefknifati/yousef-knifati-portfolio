"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import Select, { type SelectOption } from "@/components/shared/Select";
import { useSkeletonColor } from "@/lib/hooks/useSkeletonColor";
import { cn } from "@/lib/utils/cn";
import { getCities } from "@/lib/utils/getCities";
import { useI18n } from "@/providers/I18nProvider";
import countries from "@/data/countries.json";

type CountryItem = {
  name: string;
  code: string;
  nameAr: string;
  nameDe: string;
};

export type CityItem = {
  en: string | null;
  de: string | null;
  ar: string | null;
};

type CitySelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "options" | "onSelect"
> & {
  lang?: "en" | "ar" | "de";
  countryName?: string | null;
  countryCode?: string | null;
  onSelect?: (cityName: string) => void;
  onCitySelect?: (city: CityItem) => void;
  containerClassName?: string;
};

export default function CitySelect({
  lang: langOverride,
  countryName,
  countryCode,
  onSelect,
  onCitySelect,
  value,
  onValueChange,
  placeholder,
  disabled,
  containerClassName,
  ...rest
}: CitySelectProps) {
  const { lang, t } = useI18n();
  const effectiveLang = langOverride ?? (lang === "du" ? "de" : lang);
  const country = (countryName ?? "").trim();
  const code = React.useMemo(() => {
    const directCode = (countryCode ?? "").trim().toUpperCase();
    if (directCode) return directCode;

    const matched = (countries as CountryItem[]).find(
      (item) =>
        item.code === country ||
        item.name === country ||
        item.nameAr === country ||
        item.nameDe === country,
    );

    return matched?.code ?? "";
  }, [country, countryCode]);
  const skeletonPalette = useSkeletonColor();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cities", code],
    queryFn: async () => getCities(code),
    enabled: !!code,
    staleTime: 60_000,
  });

  const cities = React.useMemo(() => data ?? [], [data]);
  const options: SelectOption[] = React.useMemo(
    () => {
      const seen = new Set<string>();

      return cities
        .map((city) => ({
          label:
            (effectiveLang === "ar"
              ? city.ar
              : effectiveLang === "de"
                ? city.de
                : city.en) ||
            city.en ||
            city.ar ||
            city.de ||
            "",
          value: city.en || city.ar || city.de || "",
        }))
        .filter((option) => {
          if (!option.value || seen.has(option.value)) return false;
          seen.add(option.value);
          return true;
        });
    },
    [cities, effectiveLang],
  );

  const effectiveDisabled = disabled || !code || isLoading || isError;

  const effectivePlaceholder =
    placeholder ??
    (!code
      ? t("citySelect.selectCountryFirst")
      : isLoading
        ? t("citySelect.loading")
        : isError
          ? t("citySelect.loadError")
          : t("citySelect.placeholder"));

  const handle = (v: string) => {
    onValueChange?.(v);
    onSelect?.(v);
    const selectedCity = cities.find(
      (city) => (city.en || city.ar || city.de || "") === v,
    );
    if (selectedCity) {
      onCitySelect?.(selectedCity);
    }
  };

  if (code && isLoading) {
    const floatingLabel =
      typeof rest.floatingLabel === "string" ? rest.floatingLabel : undefined;

    return (
      <div
        className={cn(
          "relative rounded-sm border border-secondary-light-hover bg-white h-14 px-5",
          "flex items-center",
          containerClassName,
        )}
      >
        {floatingLabel ? (
          <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-secondary-normal">
            {floatingLabel}
          </span>
        ) : null}

        <div
          className="h-4 w-2/3 animate-pulse rounded"
          style={{
            background: `linear-gradient(90deg, ${skeletonPalette.baseColor} 0%, ${skeletonPalette.highlightColor} 50%, ${skeletonPalette.baseColor} 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <Select
      {...rest}
      options={options}
      value={value ?? ""}
      onValueChange={handle}
      disabled={effectiveDisabled}
      placeholder={effectivePlaceholder}
      searchable
      searchPlaceholder={t("citySelect.placeholder")}
      containerClassName={containerClassName}
    />
  );
}
