/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type AuthIntent = "text" | "email" | "username" | "password" | "newPassword" | "otp";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  intent?: AuthIntent;

  // Backward compatible
  hasRightPadding?: boolean;

  // Modern extras
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  allowPasswordToggle?: boolean;

  hint?: string;
  error?: string;

  otpLength?: number;

  containerClassName?: string;
};

function getIntentDefaults(intent: AuthIntent) {
  switch (intent) {
    case "email":
      return {
        type: "email" as const,
        autoComplete: "email",
        inputMode: "email" as const,
        enterKeyHint: "next" as const,
        autoCapitalize: "none" as const,
        autoCorrect: "off" as const,
        spellCheck: false,
      };
    case "username":
      return {
        type: "text" as const,
        autoComplete: "username",
        inputMode: "email" as const,
        enterKeyHint: "next" as const,
        autoCapitalize: "none" as const,
        autoCorrect: "off" as const,
        spellCheck: false,
      };
    case "password":
      return {
        type: "password" as const,
        autoComplete: "current-password",
        enterKeyHint: "done" as const,
        autoCapitalize: "none" as const,
        autoCorrect: "off" as const,
        spellCheck: false,
      };
    case "newPassword":
      return {
        type: "password" as const,
        autoComplete: "new-password",
        enterKeyHint: "done" as const,
        autoCapitalize: "none" as const,
        autoCorrect: "off" as const,
        spellCheck: false,
      };
    case "otp":
      return {
        type: "text" as const,
        autoComplete: "one-time-code",
        inputMode: "numeric" as const,
        enterKeyHint: "done" as const,
        autoCapitalize: "none" as const,
        autoCorrect: "off" as const,
        spellCheck: false,
      };
    default:
      return {
        type: "text" as const,
        enterKeyHint: "next" as const,
      };
  }
}

export const AuthInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      containerClassName,
      intent = "text",
      hasRightPadding,
      startAdornment,
      endAdornment,
      allowPasswordToggle,
      hint,
      error,
      otpLength,
      id,
      ...rest
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const describedByFromProps =
      typeof rest["aria-describedby"] === "string" ? rest["aria-describedby"] : "";
    const describedBy = [describedByFromProps, hintId, errorId].filter(Boolean).join(" ") || undefined;

    const invalidFromProps =
      rest["aria-invalid"] === true || rest["aria-invalid"] === "true";
    const invalid = invalidFromProps || Boolean(error);

    const defaults = getIntentDefaults(intent);

    const [reveal, setReveal] = React.useState(false);
    const canTogglePassword =
      Boolean(allowPasswordToggle) &&
      (intent === "password" || intent === "newPassword");

    const computedType =
      canTogglePassword ? (reveal ? "text" : "password") : (rest.type ?? defaults.type);

    const rightSideExists = Boolean(endAdornment) || canTogglePassword;
    const leftSideExists = Boolean(startAdornment);

    const wantsRightPadding = Boolean(hasRightPadding) || rightSideExists;

    const input = (
      <input
        ref={ref}
        id={inputId}
        type={computedType}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-errormessage={error ? errorId : undefined}
        inputMode={rest.inputMode ?? (defaults as any).inputMode}
        autoComplete={rest.autoComplete ?? (defaults as any).autoComplete}
        enterKeyHint={(rest as any).enterKeyHint ?? (defaults as any).enterKeyHint}
        autoCapitalize={rest.autoCapitalize ?? (defaults as any).autoCapitalize}
        autoCorrect={rest.autoCorrect ?? (defaults as any).autoCorrect}
        spellCheck={rest.spellCheck ?? (defaults as any).spellCheck}
        {...(intent === "otp"
          ? {
              pattern: rest.pattern ?? "[0-9]*",
              maxLength: rest.maxLength ?? otpLength,
            }
          : null)}
        className={cn(
          // Layout
          "h-12 w-full rounded-sm px-4",
          leftSideExists && "pl-11",
          wantsRightPadding && "pr-11",

          // Base
          "border bg-white text-sm text-secondary-500",
          "border-secondary-light-hover placeholder:text-secondary-200",

          // Focus + transitions
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary-normal/25",

          // Disabled / readonly
          "disabled:cursor-not-allowed disabled:opacity-60",
          "read-only:bg-secondary-50 read-only:text-secondary-400",

          // Invalid state
          "aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20",

          // Keep autofill from changing look too much (Chrome/Safari)
          "[&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]",

          className
        )}
        {...rest}
      />
    );

    return (
      <div className={cn("w-full", containerClassName)}>
        <div className="relative">
          {leftSideExists ? (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              {startAdornment}
            </div>
          ) : null}

          {input}

          {rightSideExists ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endAdornment ? <span className="pointer-events-none">{endAdornment}</span> : null}

              {canTogglePassword ? (
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  className={cn(
                    "ml-2 inline-flex h-8 items-center rounded-sm px-2 text-xs",
                    "text-secondary-400 hover:text-secondary-600",
                    "focus:outline-none focus:ring-2 focus:ring-primary-normal/25"
                  )}
                  aria-label={reveal ? "Hide password" : "Show password"}
                >
                  {reveal ? "Hide" : "Show"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {hint ? (
          <p id={hintId} className="mt-2 text-xs text-secondary-300">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p id={errorId} className="mt-2 text-xs text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
