"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  DayPicker,
  getDefaultClassNames,
  type DropdownProps,
  type Matcher,
} from "react-day-picker";
import "react-day-picker/style.css";

import { Input, type InputProps } from "@/components/shared/Input";
import Select, { type SelectOption } from "@/components/shared/Select";
import { cn } from "@/lib/utils/cn";
import { PiCalendarDots } from "react-icons/pi";

type DatePickerInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  value?: Date;
  onChange?: (date?: Date) => void;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  disableBeforeToday?: boolean;
  disableAfterToday?: boolean;
  closeOnSelect?: boolean;
};

function formatDisplayDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function startOfDay(d: Date) {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  return next;
}

function normalizeToLocalNoon(d?: Date) {
  if (!d) return undefined;
  const next = new Date(d);
  next.setHours(12, 0, 0, 0);
  return next;
}

function DayPickerSelectDropdown({
  className,
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
  name,
}: DropdownProps) {
  const hiddenSelectRef = React.useRef<HTMLSelectElement | null>(null);
  const isYearDropdown =
    typeof name === "string" && name.toLowerCase().includes("year");

  const selectOptions = React.useMemo<SelectOption[]>(
    () =>
      (options ?? []).map((option) => ({
        label: option.label,
        value: String(option.value),
      })),
    [options],
  );

  const handleValueChange = React.useCallback((nextValue: string) => {
    const nativeSelect = hiddenSelectRef.current;
    if (!nativeSelect) return;

    nativeSelect.value = nextValue;
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }, []);

  return (
    <div className={cn("min-w-[110px]", className)}>
      <select
        ref={hiddenSelectRef}
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={value?.toString() ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <Select
        value={value?.toString() ?? ""}
        onValueChange={handleValueChange}
        options={selectOptions}
        disabled={disabled}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
        searchable={isYearDropdown}
        searchPlaceholder="Search year..."
        className="h-9! border border-secondary-light-hover bg-white px-3 pr-9 text-xs font-medium text-secondary-normal"
        containerClassName="min-w-[110px]"
        listSize="mid"
      />
    </div>
  );
}

function DatePickerInput({
  value,
  onChange,
  locale = "en-GB",
  minDate,
  maxDate,
  disableBeforeToday = false,
  disableAfterToday = false,
  closeOnSelect = true,
  className,
  ...inputProps
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const [popoverStyle, setPopoverStyle] = React.useState<
    React.CSSProperties | undefined
  >(undefined);
  const displayValue = value ? formatDisplayDate(value, locale) : "";

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const defaultClassNames = getDefaultClassNames();

  const disabled: Matcher[] = [];

  if (disableBeforeToday) disabled.push({ before: today });
  if (disableAfterToday) disabled.push({ after: today });

  if (minDate) disabled.push({ before: startOfDay(minDate) });
  if (maxDate) disabled.push({ after: startOfDay(maxDate) });

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const inputWrapper = wrapRef.current;
      const popover = popoverRef.current;
      const isInsideSharedSelectListbox =
        target instanceof Element &&
        Boolean(target.closest('[role="listbox"]'));
      if (
        inputWrapper?.contains(target) ||
        popover?.contains(target) ||
        isInsideSharedSelectListbox
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const trigger = wrapRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const popoverWidth = 320;
      const verticalGap = 8;
      const viewportPadding = 8;
      const estimatedPopoverHeight = 360;

      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < estimatedPopoverHeight + verticalGap;

      const top = shouldOpenUp
        ? Math.max(viewportPadding, rect.top - estimatedPopoverHeight - verticalGap)
        : rect.bottom + verticalGap;

      const maxLeft = window.innerWidth - popoverWidth - viewportPadding;
      const left = Math.min(Math.max(viewportPadding, rect.left), maxLeft);

      setPopoverStyle({
        position: "fixed",
        top,
        left,
        width: popoverWidth,
        zIndex: 3000,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <Input
        {...inputProps}
        className={cn(className)}
        value={displayValue}
        readOnly
        placeholder={inputProps.placeholder ?? "DD/MM/YYYY"}
        rightIcon={
          <PiCalendarDots className="text-secondary-normal" size={20} />
        }
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
          inputProps.onKeyDown?.(e);
        }}
      />

      {open
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Date picker"
              style={popoverStyle}
              className={cn(
                "rounded-md border border-secondary-light-hover bg-white p-3",
                "shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
              )}
            >
              <DayPicker
                mode="single"
                selected={value}
                captionLayout="dropdown"
                components={{
                  MonthsDropdown: DayPickerSelectDropdown,
                  YearsDropdown: DayPickerSelectDropdown,
                }}
                onSelect={(d) => {
                  if (!d) {
                    onChange?.(undefined);
                    return;
                  }

                  const normalized = normalizeToLocalNoon(d);

                  onChange?.(normalized);
                  if (normalized && closeOnSelect) {
                    setOpen(false);
                  }
                }}
                disabled={disabled.length ? disabled : undefined}
                className={cn(
                  "text-secondary-normal/99",
                  "[--rdp-accent-color:#ffffff]",
                  "[--rdp-accent-background-color:#6aa086]",
                  "[--rdp-day_button-border-radius:9999px]",
                  "[--rdp-selected-border:0px]"
                )}
                classNames={{
                  chevron: cn(
                    defaultClassNames.chevron,
                    "!fill-primary-normal !stroke-primary-normal"
                  ),
                  nav_button: cn(defaultClassNames.day_button, "text-primary-normal"),
                  day_button: cn(
                    defaultClassNames.day_button,
                    "border hover:bg-secondary-normal/30 focus:bg-secondary-normal/30"
                  ),
                  selected: cn(
                    defaultClassNames.day_button,
                    "border !border-primary-normal hover:bg-secondary-normal/30 focus:bg-secondary-normal/30"
                  ),
                  today: cn(defaultClassNames.today, "!text-primary-normal"),
                }}
              />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default DatePickerInput;
