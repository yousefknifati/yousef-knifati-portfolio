"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  floatingLabel?: string;
  hint?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;

  mode?: "edit" | "view";
  displayValue?: React.ReactNode;
  viewLabel?: string;
  viewContainerClassName?: string;
  viewLabelClassName?: string;
  viewValueClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      floatingLabel,
      hint,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      mode = "edit",
      displayValue,
      viewLabel,
      viewContainerClassName,
      viewLabelClassName,
      viewValueClassName,
      placeholder,
      value,
      rows,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : "";

    const describedBy = [
      hint ? `${textareaId}-hint` : null,
      hasError ? `${textareaId}-error` : null,
    ]
      .filter(Boolean)
      .join(" ");

    const effectiveLabel =
      viewLabel ?? floatingLabel ?? label ?? placeholder ?? "";

    const resolvedTextValue = (() => {
      if (displayValue !== undefined) return displayValue;

      if (value == null) return "-";
      if (Array.isArray(value)) {
        const joined = value.filter(Boolean).join(", ");
        return joined.trim() ? joined : "-";
      }
      const s = String(value).trim();
      return s ? s : "-";
    })();

    if (mode === "view") {
      return (
        <div className={cn("w-full", containerClassName)}>
          <div className={cn("space-y-2", viewContainerClassName)}>
            <p
              className={cn(
                "text-md font-semibold text-primary-darker",
                viewLabelClassName
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

    const isFloating = !!floatingLabel;
    const effectiveRows = rows ?? (isFloating ? 4 : 3);

    return (
      <div className={cn("w-full", containerClassName)}>
        {!isFloating && label ? (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-white/90"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "relative",
            isFloating
              ? cn(
                  "rounded-sm border bg-white",
                  "border-secondary-light-hover",
                  "focus-within:border-primary-normal",
                  "focus-within:ring-1 focus-within:ring-primary-normal/60"
                )
              : ""
          )}
        >
          {isFloating ? (
            <span
              className={cn(
                "absolute -top-3 left-4 px-2 text-sm font-medium",
                "bg-white text-secondary-normal",
                disabled ? "opacity-60" : ""
              )}
            >
              {floatingLabel}
            </span>
          ) : null}

          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-3 text-black">
              {leftIcon}
            </span>
          ) : null}

          <textarea
            id={textareaId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={value as any}
            placeholder={placeholder}
            rows={effectiveRows}
            className={cn(
              isFloating
                ? cn(
                    "w-full rounded-sm border-0",
                    "px-5 pb-3 pt-3",
                    "bg-white text-md font-medium text-secondary-normal/70",
                    "placeholder:text-secondary-normal/70",
                    "focus:outline-none focus:ring-0",
                    "resize-none"
                  )
                : cn(
                    "w-full rounded-sm  px-4 py-3 text-sm transition placeholder:italic! border border-secondary-light-hover",
                    "bg-input-bg text-black placeholder:text-secondary-normal",
                    " focus-visible:border-white/30",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-normal/60",
                    "resize-none"
                  ),
              leftIcon ? (isFloating ? "pl-12" : "pl-10") : "",
              rightIcon ? (isFloating ? "pr-12" : "pr-10") : "",
              hasError
                ? isFloating
                  ? "border-danger-normal ring-1 ring-danger-normal focus-within:ring-danger-normal"
                  : "border-danger-normal ring-1 ring-danger-normal focus-visible:ring-danger-normal"
                : "",
              className
            )}
            {...props}
          />

          {rightIcon ? (
            <span className="pointer-events-none absolute right-3 top-3 text-black">
              {rightIcon}
            </span>
          ) : null}
        </div>

        {hint && !error ? (
          <p id={`${textareaId}-hint`} className="mt-2 text-xs text-black">
            {hint}
          </p>
        ) : null}

        {hasError && errorMessage ? (
          <p id={`${textareaId}-error`} className="mt-2 text-xs text-danger-normal">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
