"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { PiClockCountdown } from "react-icons/pi";

import Button from "@/components/shared/Button";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";

import { Input, type InputProps } from "./Input";

type TimePickerInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  value?: string;
  onChange?: (value?: string) => void;
  locale?: string;
};

type Period = "AM" | "PM";

type TimeDraft = {
  hour12: number;
  minute: number;
  period: Period;
};

const DEFAULT_DRAFT: TimeDraft = {
  hour12: 9,
  minute: 0,
  period: "AM",
};

function padTimePart(value: number) {
  return String(value).padStart(2, "0");
}

function parseTimeValue(value?: string): TimeDraft | undefined {
  if (!value?.trim()) return undefined;

  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return undefined;

  const hours24 = Number(match[1]);
  const minute = Number(match[2]);
  const period: Period = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;

  return { hour12, minute, period };
}

function getHours24({ hour12, period }: TimeDraft) {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
}

function toTimeValue(draft: TimeDraft) {
  return `${padTimePart(getHours24(draft))}:${padTimePart(draft.minute)}`;
}

function formatDisplayTime(value?: string, locale = "en-US") {
  const parsed = parseTimeValue(value);
  if (!parsed) return "";

  const date = new Date(2020, 0, 1, getHours24(parsed), parsed.minute);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function TimePickerInput({
  value,
  onChange,
  locale = "en-US",
  className,
  containerClassName,
  disabled,
  ...inputProps
}: TimePickerInputProps) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<TimeDraft>(DEFAULT_DRAFT);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const selectedHourRef = React.useRef<HTMLButtonElement | null>(null);
  const selectedMinuteRef = React.useRef<HTMLButtonElement | null>(null);
  const [popoverStyle, setPopoverStyle] = React.useState<
    React.CSSProperties | undefined
  >(undefined);

  const displayValue = formatDisplayTime(value, locale);
  const initialDraft = React.useMemo(
    () => parseTimeValue(value) ?? DEFAULT_DRAFT,
    [value],
  );

  const syncDraftFromValue = React.useCallback(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  const openPicker = React.useCallback(() => {
    if (disabled) return;
    syncDraftFromValue();
    setOpen(true);
  }, [disabled, syncDraftFromValue]);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const inputWrapper = wrapRef.current;
      const popover = popoverRef.current;

      if (inputWrapper?.contains(target) || popover?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
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
      const estimatedPopoverHeight = 412;

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
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    selectedHourRef.current?.scrollIntoView({ block: "center" });
    selectedMinuteRef.current?.scrollIntoView({ block: "center" });
  }, [open, draft]);

  const updateDraft = React.useCallback((nextDraft: TimeDraft) => {
    setDraft(nextDraft);
  }, []);

 
  const saveDraft = React.useCallback(() => {
    onChange?.(toTimeValue(draft));
    setOpen(false);
  }, [draft, onChange]);

  const hourOptions = React.useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );
  const minuteOptions = React.useMemo(
    () => Array.from({ length: 60 }, (_, index) => index),
    [],
  );

  return (
    <div
      ref={wrapRef}
      data-time-picker-root="true"
      className={cn("relative w-full", containerClassName)}
    >
      <Input
        {...inputProps}
        value={displayValue}
        readOnly
        disabled={disabled}
        placeholder={inputProps.placeholder ?? "HH:MM AM"}
        className={cn(
          "h-12! border border-secondary-light-hover bg-white pr-11 text-sm",
          className,
        )}
        rightIcon={
          <PiClockCountdown className="text-secondary-normal" size={20} />
        }
        onClick={openPicker}
        onFocus={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }

          inputProps.onKeyDown?.(event);
        }}
      />

      {open
        ? createPortal(
            <div
              ref={popoverRef}
              data-time-picker-popover="true"
              role="dialog"
              aria-label="Time picker"
              style={popoverStyle}
              className={cn(
                "rounded-md border border-secondary-light-hover bg-white p-4",
                "shadow-[0_10px_28px_rgba(0,0,0,0.12)]",
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-normal">
                    Select Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-secondary-normal">
                    {formatDisplayTime(toTimeValue(draft), locale)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-secondary-300 transition hover:bg-secondary-section-bg hover:text-secondary-600"
                  aria-label="Close time picker"
                >
                  <FiX size={16} />
                </button>
              </div>

              <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-normal">
                    Hour
                  </p>
                  <div className="max-h-52 overflow-y-auto rounded-sm border border-secondary-light-hover bg-secondary-section-bg/40 p-1 custom-scrollbar">
                    {hourOptions.map((hour) => {
                      const isSelected = draft.hour12 === hour;

                      return (
                        <button
                          key={hour}
                          type="button"
                          ref={isSelected ? selectedHourRef : null}
                          onClick={() =>
                            updateDraft({
                              ...draft,
                              hour12: hour,
                            })
                          }
                          className={cn(
                            "flex w-full items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition",
                            isSelected
                              ? "bg-primary-normal text-white"
                              : "text-secondary-normal hover:bg-secondary-light-hover",
                          )}
                        >
                          {padTimePart(hour)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-normal">
                    Minute
                  </p>
                  <div className="max-h-52 overflow-y-auto rounded-sm border border-secondary-light-hover bg-secondary-section-bg/40 p-1 custom-scrollbar">
                    {minuteOptions.map((minute) => {
                      const isSelected = draft.minute === minute;

                      return (
                        <button
                          key={minute}
                          type="button"
                          ref={isSelected ? selectedMinuteRef : null}
                          onClick={() =>
                            updateDraft({
                              ...draft,
                              minute,
                            })
                          }
                          className={cn(
                            "flex w-full items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition",
                            isSelected
                              ? "bg-primary-normal text-white"
                              : "text-secondary-normal hover:bg-secondary-light-hover",
                          )}
                        >
                          {padTimePart(minute)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-normal">
                    Period
                  </p>
                  <div className="flex flex-col gap-2">
                    {(["AM", "PM"] as const).map((period) => {
                      const isSelected = draft.period === period;

                      return (
                        <button
                          key={period}
                          type="button"
                          onClick={() =>
                            updateDraft({
                              ...draft,
                              period,
                            })
                          }
                          className={cn(
                            "rounded-sm border px-4 py-2 text-sm font-semibold transition",
                            isSelected
                              ? "border-primary-normal bg-primary-normal text-white"
                              : "border-secondary-light-hover bg-white text-secondary-normal hover:bg-secondary-section-bg",
                          )}
                        >
                          {period}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-secondary-light-hover pt-4">
           

                <Button type="button" size="sm" onClick={saveDraft}>
                  {t("timePicker.save")}
                </Button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
