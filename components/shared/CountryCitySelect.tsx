"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import Select, { type SelectOption } from "@/components/shared/Select";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { getCountries } from "@/lib/utils/getCountries";

type CountrySelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "options" | "value" | "onValueChange" | "onSelect"
> & {
  label?: string;
  initialCountry?: string | null;
  onSelect?: (countryName: string) => void;
  useStore?: boolean;
};

export default function CountrySelect({
  label = "Country",
  initialCountry,
  onSelect,
  dir = "ltr",
  floatingLabel,
  placeholder,
  mode = "edit",
  disabled,
  useStore = true,
  ...rest
}: CountrySelectProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries", "all-for-select"],
    queryFn: () => getCountries(),
    staleTime: 60_000,
  });

  const countries = React.useMemo(() => data?.data ?? [], [data?.data]);

  const selectedFromStore = useCountryStore((s) => s.countryOfResidence);
  const setCountryStore = useCountryStore((s) => s.setCountryOfResidence);

  const [selected, setSelected] = React.useState<string>("");
  const seededRef = React.useRef(false);

  React.useEffect(() => {
    if (seededRef.current) return;

    const seed =
      (initialCountry?.trim() ?? "") ||
      (useStore ? (selectedFromStore?.trim() ?? "") : "");

    if (seed) setSelected(seed);

    seededRef.current = true;
  }, [initialCountry, selectedFromStore, useStore]);

  const options: SelectOption[] = React.useMemo(() => {
    const base = countries.map((c) => ({ label: c.name, value: c.name }));
    if (selected && !base.some((o) => o.value === selected)) {
      return [{ label: selected, value: selected }, ...base];
    }
    return base;
  }, [countries, selected]);

  const effectiveDisabled = disabled || isLoading || isError;

  const effectivePlaceholder =
    placeholder ??
    (isLoading
      ? "Loading countries..."
      : isError
      ? "Failed to load countries"
      : "Select Country");

  const handleChange = (value: string) => {
    setSelected(value);
    if (useStore) setCountryStore(value);
    onSelect?.(value);
  };

  return (
    <Select
      options={options}
      value={selected}
      onValueChange={handleChange}
      dir={dir}
      mode={mode}
      floatingLabel={floatingLabel ?? label}
      placeholder={effectivePlaceholder}
      disabled={effectiveDisabled}
      {...rest}
    />
  );
}
