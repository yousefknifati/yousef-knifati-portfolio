"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

import { Input, type InputProps } from "@/components/shared/Input";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import type { CustomComponents } from "react-day-picker";
import { PiCalendarDots } from "react-icons/pi";

type DateOfBirthInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  value?: Date;
  onChange?: (date?: Date) => void;
  locale?: string;
  minYear?: number;
  maxYear?: number;
  closeOnSelect?: boolean;
  components?: Partial<CustomComponents>;
};

function formatDisplayDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function normalizeToLocalNoon(d?: Date) {
  if (!d) return undefined;
  const next = new Date(d);
  next.setHours(12, 0, 0, 0);
  return next;
}

function DateOfBirthInput({
  value,
  onChange,
  locale,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  closeOnSelect = true,
  components,
  className,
  ...inputProps
}: DateOfBirthInputProps) {
  const { dir, lang } = useI18n();
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const [popoverStyle, setPopoverStyle] = React.useState<
    React.CSSProperties | undefined
  >(undefined);

  const resolvedLocale = locale ?? (lang === "ar" ? "ar-EG" : "en-GB");
  const displayValue = value ? formatDisplayDate(value, resolvedLocale) : "";

  const startMonth = React.useMemo(() => new Date(minYear, 0, 1), [minYear]);
  const endMonth = React.useMemo(() => new Date(maxYear, 11, 31), [maxYear]);
  const today = React.useMemo(() => new Date(), []);
  const defaultClassNames = getDefaultClassNames();

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const inputWrapper = wrapRef.current;
      const popover = popoverRef.current;
      if (inputWrapper?.contains(target) || popover?.contains(target)) return;
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
      const viewportPadding = 8;
      const verticalGap = 8;
      const popoverWidth = Math.min(320, window.innerWidth - viewportPadding * 2);
      const estimatedPopoverHeight = 360;

      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < estimatedPopoverHeight + verticalGap;

      const top = shouldOpenUp
        ? Math.max(viewportPadding, rect.top - estimatedPopoverHeight - verticalGap)
        : rect.bottom + verticalGap;

      // Open on the natural side first, then flip when near viewport edge.
      let left = dir === "rtl" ? rect.right - popoverWidth : rect.left;
      if (left + popoverWidth > window.innerWidth - viewportPadding) {
        left = rect.right - popoverWidth;
      }
      if (left < viewportPadding) {
        left = viewportPadding;
      }

      setPopoverStyle({
        position: "fixed",
        top,
        left,
        width: popoverWidth,
        zIndex: 5000,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [dir, open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <Input
        {...inputProps}
        className={cn(className)}
        value={displayValue}
        readOnly
        placeholder={
          inputProps.placeholder ?? (lang === "ar" ? "يوم/شهر/سنة" : "DD/MM/YYYY")
        }
        rightIcon={<PiCalendarDots className="text-secondary-normal" size={20} />}
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
              aria-label={lang === "ar" ? "منتقي تاريخ الميلاد" : "Date of Birth picker"}
              style={popoverStyle}
              className={cn(
                "rounded-md border border-secondary-light-hover bg-white p-3",
                "shadow-[0_10px_28px_rgba(0,0,0,0.12)]",
              )}
            >
              <DayPicker
                dir={dir}
                mode="single"
                selected={value}
                onSelect={(d) => {
                  const normalized = normalizeToLocalNoon(d);
                  onChange?.(normalized);
                  if (normalized && closeOnSelect) setOpen(false);
                }}
                components={components}
                captionLayout="dropdown"
                startMonth={startMonth}
                endMonth={endMonth}
                reverseYears
                disabled={{ after: today }}
                className={cn(
                  "text-secondary-normal/99",
                  "[--rdp-accent-color:#ffffff]",
                  "[--rdp-accent-background-color:#6aa086]",
                  "[--rdp-day_button-border-radius:9999px]",
                  "[--rdp-selected-border:0px]",
                )}
                classNames={{
                  chevron: cn(
                    defaultClassNames.chevron,
                    "!fill-primary-normal !stroke-primary-normal",
                  ),
                  nav_button: cn(defaultClassNames.day_button, "text-primary-normal"),
                  day_button: cn(
                    defaultClassNames.day_button,
                    "border hover:bg-secondary-normal/30 focus:bg-secondary-normal/30",
                  ),
                  selected: cn(
                    defaultClassNames.day_button,
                    "border !border-primary-normal hover:bg-secondary-normal/30 focus:bg-secondary-normal/30",
                  ),
                  today: cn(defaultClassNames.today, "!text-primary-normal"),
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export default DateOfBirthInput;
