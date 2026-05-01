"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import type { Country } from "@/types/Countries";
import countriesData from "@/data/countries.json";
import Select, { type SelectOption } from "@/components/shared/Select";
import { isValidNumber, parsePhoneNumberFromString } from "libphonenumber-js";

type PhoneNumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value?: string;
  onChange: (value: string) => void;
  countryValue?: string;
  onCountryChange?: (countryName: string) => void;
  countries?: Country[];
  floatingLabel?: string;
  containerClassName?: string;
  mode?: "edit" | "view";
  displayValue?: React.ReactNode;
  viewLabel?: string;
  viewContainerClassName?: string;
  viewLabelClassName?: string;
  viewValueClassName?: string;
  error?: string;
  rightIcon?: React.ReactNode;
};

const allCountries = countriesData as Country[];

function normalizeDialCode(dialCode: string) {
  return dialCode.replace(/\s+/g, "");
}

function truncateText(value: string, max = 18) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

function normalizePhoneValue(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function normalizeLocalPhoneDigits(value: string) {
  return value.replace(/\D+/g, "");
}

function applyDialCodeToPhone(value: string, dialCode: string) {
  const normalized = normalizeLocalPhoneDigits(value);
  if (!dialCode) return normalized;
  if (!normalized) return dialCode;
  return `${dialCode}${normalized}`;
}

function getDialCodeFromNumber(value: string, countries: Country[]) {
  const normalized = normalizePhoneValue(value).replace(/[^\d+]/g, "");
  if (!normalized) return "";
  const normalizedDigits = normalized.replace(/^\+/, "");

  let best = "";
  for (const c of countries) {
    const code = normalizeDialCode(c.dial_code);
    const codeDigits = code.replace(/^\+/, "");
    if (!codeDigits) continue;

    const matches =
      normalized.startsWith(code) || normalizedDigits.startsWith(codeDigits);

    if (matches && code.length > best.length) {
      best = code;
    }
  }

  return best;
}

function stripDialCodeFromPhone(value: string, dialCode: string) {
  const normalized = normalizePhoneValue(value).replace(/[^\d+]/g, "");
  const normalizedDial = normalizeDialCode(dialCode);

  if (!normalized) return "";

  const normalizedDigits = normalized.replace(/^\+/, "");
  if (!normalizedDial) return normalizeLocalPhoneDigits(normalizedDigits);

  const dialDigits = normalizedDial.replace(/^\+/, "");
  if (!dialDigits) return normalizeLocalPhoneDigits(normalizedDigits);

  if (normalized.startsWith(normalizedDial)) {
    return normalizeLocalPhoneDigits(normalized.slice(normalizedDial.length));
  }

  if (normalizedDigits.startsWith(dialDigits)) {
    return normalizeLocalPhoneDigits(normalizedDigits.slice(dialDigits.length));
  }

  return normalizeLocalPhoneDigits(normalizedDigits);
}

function findCountryNameByDialCode(dialCode: string, countries: Country[]) {
  const target = normalizeDialCode(dialCode);
  if (!target) return "";

  const match = countries.find((c) => normalizeDialCode(c.dial_code) === target);
  return match?.name ?? "";
}

export default function PhoneNumberInput({
  value,
  onChange,
  countryValue,
  onCountryChange,
  countries = allCountries,
  floatingLabel,
  containerClassName,
  mode = "edit",
  displayValue,
  viewLabel,
  viewContainerClassName,
  viewLabelClassName,
  viewValueClassName,
  error,
  rightIcon,
  disabled,
  placeholder,
  ...rest
}: PhoneNumberInputProps) {
  const { dir, t } = useI18n();
  const isRTL = dir === "rtl";
  const resolvedPlaceholder = placeholder ?? t("phoneNumberInput.placeholder");

  const isControlled = countryValue !== undefined;
  const [innerCountry, setInnerCountry] = React.useState<string>("");

  const selectedCountry = isControlled ? countryValue ?? "" : innerCountry;

  React.useEffect(() => {
    if (selectedCountry) return;

    const dial = getDialCodeFromNumber(value ?? "", countries);
    if (!dial) return;

    const inferred = findCountryNameByDialCode(dial, countries);
    if (!inferred) return;

    if (isControlled) onCountryChange?.(inferred);
    else setInnerCountry(inferred);
  }, [value, countries, selectedCountry, isControlled, onCountryChange]);

  const effectiveLabel = viewLabel ?? floatingLabel ?? resolvedPlaceholder;

  const resolvedTextValue = (() => {
    if (displayValue !== undefined) return displayValue;
    if (value == null) return "-";

    const s = String(value).trim();
    return s ? s : "-";
  })();

  const isFloating = !!floatingLabel;

  const countryOptions: SelectOption[] = React.useMemo(
    () =>
      countries.map((c) => ({
        value: c.name,
        label: `${normalizeDialCode(c.dial_code)} ${truncateText(c.name)}`,
      })),
    [countries],
  );

  const selectedDialCode = React.useMemo(
    () =>
      normalizeDialCode(
        countries.find((c) => c.name === selectedCountry)?.dial_code ?? "",
      ),
    [countries, selectedCountry],
  );

  const detectedDialCode = React.useMemo(
    () => getDialCodeFromNumber(value ?? "", countries),
    [value, countries],
  );

  const effectiveDialCode = selectedDialCode || detectedDialCode;

  const localPhoneValue = React.useMemo(
    () => stripDialCodeFromPhone(value ?? "", effectiveDialCode),
    [value, effectiveDialCode],
  );

  const fullPhoneNumber = React.useMemo(() => {
    if (!localPhoneValue) return "";
    return `${effectiveDialCode}${normalizeLocalPhoneDigits(localPhoneValue)}`;
  }, [localPhoneValue, effectiveDialCode]);

  const parsedPhone = React.useMemo(
    () =>
      fullPhoneNumber
        ? parsePhoneNumberFromString(fullPhoneNumber)
        : undefined,
    [fullPhoneNumber],
  );

  const isPhoneValid = React.useMemo(
    () => (parsedPhone ? isValidNumber(parsedPhone.number) : false),
    [parsedPhone],
  );

  const internalError =
    localPhoneValue && !isPhoneValid
      ? "Invalid phone number for selected country."
      : "";

  const effectiveError = error || internalError;

  if (mode === "view") {
    return (
      <div className={cn("w-full", containerClassName)}>
        <div className={cn("space-y-2", viewContainerClassName)}>
          <p
            className={cn(
              "text-md font-semibold text-primary-darker",
              viewLabelClassName,
            )}
          >
            {effectiveLabel}
          </p>

          <p
            className={cn("text-lg text-secondary-normal", viewValueClassName)}
          >
            {resolvedTextValue}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", containerClassName)}>
      <div
        className={cn(
          "relative",
          isFloating
            ? cn(
                "rounded-sm border bg-white",
                "border-secondary-light-hover",
                "focus-within:border-primary-normal",
                "focus-within:ring-1 focus-within:ring-primary-normal/60",
              )
            : "",
        )}
      >
        {isFloating ? (
          <span
            className={cn(
              "absolute -top-3 z-10 px-2 text-sm font-medium",
              isRTL ? "right-4" : "left-4",
              "bg-white text-secondary-normal",
              disabled ? "opacity-60" : "",
            )}
          >
            {floatingLabel}
          </span>
        ) : null}

        <div
          className={cn(
            "flex gap-2 px-3 py-3 sm:items-center sm:py-2",
            "flex-col sm:flex-row",
            isRTL ? "sm:flex-row-reverse" : "sm:flex-row",
          )}
        >
          <div className="w-full shrink-0 sm:w-52">
            <Select
              mode="edit"
              value={selectedCountry}
              onValueChange={(nextCountry) => {
                if (!isControlled) setInnerCountry(nextCountry);
                onCountryChange?.(nextCountry);

                const dialCode = normalizeDialCode(
                  countries.find((c) => c.name === nextCountry)?.dial_code ?? "",
                );

                const nextLocal = normalizeLocalPhoneDigits(localPhoneValue);
                const nextFull = applyDialCodeToPhone(nextLocal, dialCode);
                const nextParsed = parsePhoneNumberFromString(nextFull);

                onChange(
                  nextParsed && isValidNumber(nextParsed.number)
                    ? nextParsed.number
                    : nextFull,
                );
              }}
              disabled={disabled}
              placeholder={resolvedPlaceholder}
              options={countryOptions}
              searchable
              searchPlaceholder="Search country..."
              containerClassName="w-full sm:w-52"
              className="h-10 text-sm"
            />
          </div>

          <div className="hidden h-6 w-px bg-secondary-light-hover sm:block" />

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <input
              {...rest}
              value={localPhoneValue}
              disabled={disabled}
              placeholder={resolvedPlaceholder}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              dir="ltr"
              aria-invalid={Boolean(effectiveError)}
              onChange={(e) => {
                const nextLocal = normalizeLocalPhoneDigits(e.target.value);
                const nextFull = applyDialCodeToPhone(
                  nextLocal,
                  effectiveDialCode,
                );
                const nextParsed = parsePhoneNumberFromString(nextFull);

                onChange(
                  nextParsed && isValidNumber(nextParsed.number)
                    ? nextParsed.number
                    : nextFull,
                );
              }}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-md font-medium text-secondary-normal/70",
                "placeholder:text-secondary-normal/70",
                "focus:outline-none focus:ring-0",
                effectiveError ? "text-danger-normal" : "",
              )}
            />

            {rightIcon ? (
              <span className="pointer-events-none shrink-0 text-black">
                {rightIcon}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {effectiveError ? (
        <p className="mt-2 text-xs text-danger-normal">{effectiveError}</p>
      ) : null}
    </div>
  );
}
