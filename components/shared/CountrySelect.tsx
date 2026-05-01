"use client";

import * as React from "react";

import Select, { type SelectOption } from "@/components/shared/Select";
import countriesData from "@/data/countries.json";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useI18n } from "@/providers/I18nProvider";
import type { Country } from "@/types/Countries";

type CountrySelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "options" | "onSelect"
> & {
  initialCountry?: string | null;
  useStore?: boolean;
  onSelect?: (countryName: string) => void;
  containerClassName?: string;
  displayLang?: "en" | "ar" | "de";
};

export default function CountrySelect({
  initialCountry,
  useStore = false,
  onSelect,
  value,
  onValueChange,
  placeholder,
  disabled,
  containerClassName,
  displayLang,
  ...rest
}: CountrySelectProps) {
  const { lang, t } = useI18n();
  const countries = React.useMemo(() => countriesData as Country[], []);
  const resolvedLang = displayLang ?? lang;

  const selectedFromStore = useCountryStore((s) => s.countryOfResidence);
  const setCountryStore = useCountryStore((s) => s.setCountryOfResidence);

  const isControlled = value !== undefined;

  const [inner, setInner] = React.useState<string>("");
  const seededRef = React.useRef(false);

  React.useEffect(() => {
    if (isControlled) return;
    if (seededRef.current) return;

    const seed =
      (initialCountry?.trim() ?? "") ||
      (useStore ? (selectedFromStore?.trim() ?? "") : "");

    if (seed) setInner(seed);

    seededRef.current = true;
  }, [initialCountry, selectedFromStore, useStore, isControlled]);

  const selected = isControlled ? (value ?? "") : inner;

  const getCountryLabel = React.useCallback(
    (country: (typeof countries)[number]) => {
      if (resolvedLang === "ar") return country.nameAr ?? country.name;
      if (resolvedLang === "de") return country.nameDe ?? country.name;
      return country.name;
    },
    [resolvedLang],
  );

  const options: SelectOption[] = React.useMemo(() => {
    const base = countries.map((country) => ({
      label: getCountryLabel(country),
      value: country.name,
    }));

    if (selected && !base.some((option) => option.value === selected)) {
      const matchedCountry = countries.find((country) => country.name === selected);
      return [
        {
          label: matchedCountry ? getCountryLabel(matchedCountry) : selected,
          value: selected,
        },
        ...base,
      ];
    }

    return base;
  }, [countries, getCountryLabel, selected]);

  const effectiveDisabled = disabled;
  const effectivePlaceholder = placeholder ?? t("countrySelect.placeholder");

  const handle = (v: string) => {
    if (!isControlled) setInner(v);
    if (useStore) setCountryStore(v);
    onValueChange?.(v);
    onSelect?.(v);
  };

  return (
    <Select
      {...rest}
      options={options}
      value={selected}
      onValueChange={handle}
      disabled={effectiveDisabled}
      placeholder={effectivePlaceholder}
      searchable
      searchPlaceholder={t("countrySelect.placeholder")}
      containerClassName={containerClassName}
    />
  );
}
