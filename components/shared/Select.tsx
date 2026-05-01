"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { useI18n } from "@/providers/I18nProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export type SelectOption = { label: string; value: string };
const DROPDOWN_HEIGHTS = {
  short: 140,
  mid: 220,
  long: 320,
} as const;

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> & {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  searchable?: boolean;
  searchPlaceholder?: string;

  mode?: "edit" | "view";
  floatingLabel?: string;
  displayValue?: React.ReactNode;
  viewLabel?: string;
  viewContainerClassName?: string;
  viewLabelClassName?: string;
  viewValueClassName?: string;
  containerClassName?: string;
  onOpenChange?: (open: boolean) => void;
  error?: string | boolean;
  err?: string | boolean;
  withTooltip?: boolean;
  listSize?: "short" | "mid" | "long";
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder = "Select",
      value,
      onValueChange,
      dir,
      searchable = false,
      searchPlaceholder = "Search...",
      mode = "edit",
      floatingLabel,
      displayValue,
      viewLabel,
      viewContainerClassName,
      viewLabelClassName,
      viewValueClassName,
      containerClassName,
      disabled,
      onOpenChange,
      error,
      err,
      withTooltip = false,
      listSize = "long",
      id,
      name,
      required,
      ...props
    },
    ref,
  ) => {
    const { dir: appDir } = useI18n();
    const resolvedDir = dir ?? appDir;
    const isRTL = resolvedDir === "rtl";
    const shouldReduceMotion = useReducedMotion();
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    const [open, setOpen] = React.useState(false);
    const [isDropdownMounted, setIsDropdownMounted] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [dropdownPlacement, setDropdownPlacement] = React.useState<
      "top" | "bottom"
    >("bottom");
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const isPointerInsideDropdownRef = React.useRef(false);
    const [dropdownStyle, setDropdownStyle] = React.useState<
      React.CSSProperties | undefined
    >(undefined);

    const effectiveLabel =
      viewLabel ?? floatingLabel ?? placeholder ?? "Select";

    const selectedOption = React.useMemo(
      () => options.find((o) => o.value === (value ?? "")),
      [options, value],
    );

    const resolvedTextValue = (() => {
      if (displayValue !== undefined) return displayValue;
      const txt = selectedOption?.label?.trim() ?? "";
      return txt ? txt : "-";
    })();
    const hasError = Boolean(error || err);
    const errorMessage =
      typeof error === "string" ? error : typeof err === "string" ? err : "";
    const describedBy = hasError ? `${selectId}-error` : undefined;

    React.useEffect(() => {
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node;
        if (
          !rootRef.current?.contains(target) &&
          !dropdownRef.current?.contains(target)
        ) {
          setOpen(false);
        }
      };

      const onEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };

      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onEscape);

      return () => {
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("keydown", onEscape);
      };
    }, []);

    const getPendingDropdownStyle = React.useCallback((): React.CSSProperties => {
      const rect = triggerRef.current?.getBoundingClientRect();

      return {
        position: "fixed",
        top: rect ? rect.bottom + 12 : -9999,
        left: rect?.left ?? -9999,
        width: rect?.width,
        maxHeight: DROPDOWN_HEIGHTS[listSize],
        visibility: "hidden",
      };
    }, [listSize]);

    React.useEffect(() => {
      if (open) {
        setDropdownStyle((current) => current ?? getPendingDropdownStyle());
        setIsDropdownMounted(true);
      }
    }, [getPendingDropdownStyle, open]);

    React.useEffect(() => {
      if (open) setSearch("");
    }, [open]);

    React.useEffect(() => {
      onOpenChange?.(open);
    }, [open, onOpenChange]);

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !search.trim()) return options;
      const needle = search.trim().toLowerCase();
      return options.filter((o) =>
        o.label.toLowerCase().includes(needle),
      );
    }, [options, search, searchable]);

    React.useLayoutEffect(() => {
      if (!open || !isDropdownMounted) return;

      let frameId = 0;
      let resizeObserver: ResizeObserver | null = null;

      const updatePosition = () => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const dropdown = dropdownRef.current;
        const viewportPadding = 8;
        const dropdownGap = 12;
        const requestedHeight = Math.min(
          DROPDOWN_HEIGHTS[listSize],
          window.innerHeight - viewportPadding * 2,
        );
        const spaceBelow = Math.max(
          0,
          window.innerHeight - rect.bottom - dropdownGap - viewportPadding,
        );
        const spaceAbove = Math.max(
          0,
          rect.top - dropdownGap - viewportPadding,
        );
        const dropdownHeight = dropdown
          ? Math.min(dropdown.scrollHeight, requestedHeight)
          : requestedHeight;
        const shouldOpenUp =
          spaceBelow < Math.min(dropdownHeight, 180) &&
          spaceAbove > spaceBelow;
        const availableHeight = shouldOpenUp ? spaceAbove : spaceBelow;
        const maxHeight = Math.min(requestedHeight, availableHeight);
        const renderedHeight = dropdown
          ? Math.min(dropdown.scrollHeight, maxHeight)
          : maxHeight;
        const top = shouldOpenUp
          ? Math.max(viewportPadding, rect.top - dropdownGap - renderedHeight)
          : rect.bottom + dropdownGap;

        setDropdownPlacement(shouldOpenUp ? "top" : "bottom");
        setDropdownStyle({
          position: "fixed",
          top,
          left: rect.left,
          width: rect.width,
          maxHeight,
        });
      };

      const scheduleUpdate = () => {
        window.cancelAnimationFrame(frameId);
        frameId = window.requestAnimationFrame(updatePosition);
      };

      const onScroll = (event: Event) => {
        const target = event.target as Node | null;
        const isScrollingInsideDropdown = target
          ? dropdownRef.current?.contains(target)
          : false;

        if (isScrollingInsideDropdown || isPointerInsideDropdownRef.current) {
          scheduleUpdate();
          return;
        }

        setOpen(false);
      };

      updatePosition();
      window.addEventListener("resize", scheduleUpdate);
      window.addEventListener("scroll", onScroll, true);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          scheduleUpdate();
        });

        if (triggerRef.current) resizeObserver.observe(triggerRef.current);
        if (dropdownRef.current) resizeObserver.observe(dropdownRef.current);
      }

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver?.disconnect();
        window.removeEventListener("resize", scheduleUpdate);
        window.removeEventListener("scroll", onScroll, true);
      };
    }, [filteredOptions.length, isDropdownMounted, listSize, open]);

    if (mode === "view") {
      return (
        <div className="w-full">
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
              className={cn(
                "text-lg text-secondary-normal",
                viewValueClassName,
              )}
            >
              {resolvedTextValue}
            </p>
          </div>
        </div>
      );
    }

    const isFloating = !!floatingLabel;
    const dropdownMotion =
      shouldReduceMotion
        ? {
            initial: { opacity: 1 },
            animate: { opacity: 1 },
            exit: { opacity: 1 },
            transition: { duration: 0 },
          }
        : {
            initial: {
              opacity: 0,
              y: dropdownPlacement === "top" ? 8 : -8,
              scale: 0.98,
            },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: {
              opacity: 0,
              y: dropdownPlacement === "top" ? 6 : -6,
              scale: 0.98,
            },
            transition: {
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          };
    return (
      <>
      <div
        ref={rootRef}
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
          hasError
            ? "border-danger-normal focus-within:border-danger-normal focus-within:ring-danger-normal/35"
            : "",
          containerClassName,
        )}
      >
        {isFloating ? (
          <span
            className={cn(
              "absolute -top-3 px-2 text-sm font-medium",
              isRTL ? "right-4" : "left-4",
              "bg-white text-secondary-normal",
              disabled ? "opacity-60" : "",
            )}
          >
            {floatingLabel}
          </span>
        ) : null}

        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          value={value ?? ""}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          id={`${selectId}-trigger`}
          ref={triggerRef}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            setOpen((isOpen) => {
              if (isOpen) return false;
              setDropdownStyle(getPendingDropdownStyle());
              return true;
            });
          }}
          className={cn(
            "w-full rounded-sm ",
            value ? "text-secondary-500" : "text-secondary-200",
            "focus:outline-none",
            isRTL ? "pl-12 pr-5" : "pr-12 pl-5",
            isRTL ? "text-right" : "text-left",
            isFloating
              ? cn(
                  "h-14 border-0 px-5 text-md font-medium ",
                  "text-secondary-normal/70 ",
                )
              : cn(
                  "h-14 border px-5 text-sm",
                  "border-secondary-light-hover focus:border-primary-normal bg-white",
                ),
            hasError
              ? isFloating
                ? "border-danger-normal focus-within:ring-danger-normal/35"
                : "border-danger-normal focus:border-danger-normal focus-visible:ring-danger-normal/35"
              : "",
            " disabled:cursor-not-allowed",
            className,
          )}
        >
          {withTooltip ? (
            <Tooltip delayDuration={150}>
              <TooltipTrigger>
                <span className="block truncate">
                  {selectedOption?.label ?? placeholder}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {selectedOption?.label ?? placeholder}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="block truncate">
              {selectedOption?.label ?? placeholder}
            </span>
          )}

          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-secondary-200 transition-transform ",
              open ? "rotate-180" : "rotate-0",
              isRTL ? "left-4" : "right-4",
            )}
          >
            <IoChevronDown size={18} />
          </span>
        </button>

        {isDropdownMounted && !disabled
          ? createPortal(
              <AnimatePresence onExitComplete={() => setIsDropdownMounted(false)}>
                {open ? (
                  <motion.div
                    role="listbox"
                    ref={dropdownRef}
                    style={dropdownStyle}
                    onMouseEnter={() => {
                      isPointerInsideDropdownRef.current = true;
                    }}
                    onMouseLeave={() => {
                      isPointerInsideDropdownRef.current = false;
                    }}
                    initial={dropdownMotion.initial}
                    animate={dropdownMotion.animate}
                    exit={dropdownMotion.exit}
                    transition={dropdownMotion.transition}
                    className={cn(
                      "z-3005 overflow-y-auto overflow-x-hidden rounded-sm border border-secondary-light-hover bg-white shadow-lg custom-scrollbar",
                    )}
                  >
                    {searchable ? (
                      <div className="sticky top-0 bg-white p-2 border-b border-secondary-light-hover">
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={searchPlaceholder}
                          className={cn(
                            "h-9 w-full rounded-sm border px-3 text-sm",
                            "border-secondary-light-hover  text-secondary-500",
                            "placeholder:text-secondary-200 focus:outline-none focus:border-primary-normal",
                          )}
                        />
                      </div>
                    ) : null}

                    {filteredOptions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-secondary-300">
                        No results.
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const active = option.value === (value ?? "");

                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              onValueChange?.(option.value);
                              setOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2 text-sm text-left",
                              isRTL ? "text-right" : "text-left",
                              active
                                ? "bg-primary-light text-primary-dark"
                                : "text-secondary-500 hover:bg-secondary-section-bg",
                            )}
                          >
                            {withTooltip ? (
                              <Tooltip delayDuration={150}>
                                <TooltipTrigger>
                                  <span className="block truncate">
                                    {option.label}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center">
                                  {option.label}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="block truncate">
                                {option.label}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </div>

      {hasError && errorMessage ? (
        <p id={`${selectId}-error`} className="mt-2 text-xs text-danger-normal">
          {errorMessage}
        </p>
      ) : null}
      </>
    );
  },
);

Select.displayName = "Select";
export default Select;
