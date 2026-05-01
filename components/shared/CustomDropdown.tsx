// CustomDropdown.tsx (or place above your component in same file)
import React, { useState, useRef, useEffect } from "react";
import type { DropdownProps } from "react-day-picker";
import { cn } from "@/lib/utils/cn";

export function CustomDropdown(props: DropdownProps) {
  const { options = [], value, onChange, "aria-label": ariaLabel } = props;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const handleSelect = (v: string | number | undefined) => {
    // DayPicker expects onChange to receive a native-like change event
    if (!onChange) return;
    const syntheticEvent = {
      target: { value: String(v) },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setOpen(false);
  };

  // label for current value
  const currentLabel =
    options.find((o) => String(o.value) === String(value))?.label ?? "";

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-3 py-1 rounded-md  bg-white text-sm"
      >
        <span>{currentLabel}</span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className={cn(
            "absolute z-50 mt-1 w-48 rounded-md bg-white shadow-lg border border-dashboard-border",
            // adjust max height here:
            "max-h-[200px] overflow-auto"
          )}
        >
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.value?.toString()}
                type="button"
                disabled={opt.disabled}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm",
                  String(opt.value) === String(value)
                    ? "bg-primary-normal/10 font-semibold"
                    : "hover:bg-zinc-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
