"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

type TooltipContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  delayDuration: number;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipCtx() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within <Tooltip />");
  return ctx;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computePosition(args: {
  triggerRect: DOMRect;
  contentRect: DOMRect;
  side: Side;
  align: Align;
  sideOffset: number;
}) {
  const { triggerRect, contentRect, side, align, sideOffset } = args;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const alignedX = () => {
    if (align === "start") return triggerRect.left;
    if (align === "end") return triggerRect.right - contentRect.width;
    return triggerRect.left + (triggerRect.width - contentRect.width) / 2;
  };

  const alignedY = () => {
    if (align === "start") return triggerRect.top;
    if (align === "end") return triggerRect.bottom - contentRect.height;
    return triggerRect.top + (triggerRect.height - contentRect.height) / 2;
  };

  let top = 0;
  let left = 0;

  if (side === "top") {
    top = triggerRect.top - contentRect.height - sideOffset;
    left = alignedX();
  } else if (side === "bottom") {
    top = triggerRect.bottom + sideOffset;
    left = alignedX();
  } else if (side === "left") {
    top = alignedY();
    left = triggerRect.left - contentRect.width - sideOffset;
  } else {
    top = alignedY();
    left = triggerRect.right + sideOffset;
  }

  const margin = 8;
  left = clamp(left, margin, viewportWidth - contentRect.width - margin);
  top = clamp(top, margin, viewportHeight - contentRect.height - margin);

  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  const arrowPadding = 10;

  const arrowLeft =
    side === "top" || side === "bottom"
      ? clamp(triggerCenterX - left, arrowPadding, contentRect.width - arrowPadding)
      : undefined;

  const arrowTop =
    side === "left" || side === "right"
      ? clamp(triggerCenterY - top, arrowPadding, contentRect.height - arrowPadding)
      : undefined;

  return { top, left, arrowLeft, arrowTop };
}

function TooltipProvider({
  delayDuration = 0,
  children,
}: {
  delayDuration?: number;
  children: React.ReactNode;
}) {
  void delayDuration;
  return <>{children}</>;
}

type TooltipProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
};

function Tooltip({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 0,
}: TooltipProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const ctxValue = React.useMemo<TooltipContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentId,
      delayDuration,
    }),
    [open, setOpen, contentId, delayDuration],
  );

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipContext.Provider value={ctxValue}>{children}</TooltipContext.Provider>
    </TooltipProvider>
  );
}

type TooltipTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>;

function TooltipTrigger({ children, asChild, ...props }: TooltipTriggerProps) {
  const { setOpen, triggerRef, contentId, delayDuration } = useTooltipCtx();
  const openTimerRef = React.useRef<number | null>(null);

  const clearTimer = React.useCallback(() => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const scheduleOpen = () => {
    clearTimer();
    if (delayDuration > 0) {
      openTimerRef.current = window.setTimeout(() => setOpen(true), delayDuration);
      return;
    }
    setOpen(true);
  };

  const close = () => {
    clearTimer();
    setOpen(false);
  };

  const onMouseEnter = () => scheduleOpen();
  const onMouseLeave = () => close();
  const onFocus = () => scheduleOpen();
  const onBlur = () => close();
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") close();
  };

  return (
    <span
      {...props}
      ref={(node) => {
        triggerRef.current = node;
      }}
      className={cn(asChild ? "contents" : undefined, props.className)}
      aria-describedby={contentId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      {children}
    </span>
  );
}

type TooltipContentProps = {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type TooltipPosition = {
  top: number;
  left: number;
  arrowLeft?: number;
  arrowTop?: number;
};

function TooltipContent({
  side = "top",
  align = "center",
  sideOffset = 8,
  className,
  children,
  ...props
}: TooltipContentProps) {
  const { open, setOpen, triggerRef, contentId } = useTooltipCtx();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState<TooltipPosition | null>(null);

  React.useEffect(() => setMounted(true), []);

  const updatePosition = React.useCallback(() => {
    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;
    if (!triggerElement || !contentElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const nextPosition = computePosition({
      triggerRect,
      contentRect,
      side,
      align,
      sideOffset,
    });
    setPosition(nextPosition);
  }, [align, side, sideOffset, triggerRef]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) return;

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onDocumentKeyDown);
    return () => document.removeEventListener("keydown", onDocumentKeyDown);
  }, [open, setOpen]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      {...props}
      id={contentId}
      role="tooltip"
      ref={contentRef}
      style={{
        position: "fixed",
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        zIndex: 4000,
      }}
      className={cn(
        "w-fit max-w-xs whitespace-pre-line wrap-break-word rounded-md border border-secondary-light-hover bg-primary-darker px-3 py-2 text-xs text-white shadow-xl",
        className,
      )}
    >
      {children}

      <span
        aria-hidden="true"
        style={{
          left: side === "top" || side === "bottom" ? position?.arrowLeft : undefined,
          top: side === "left" || side === "right" ? position?.arrowTop : undefined,
        }}
        className={cn(
          "absolute h-2 w-2 rotate-45 border border-secondary-light-hover bg-primary-darker",
          side === "top" && "-bottom-1 -translate-x-1/2 border-t-0 border-l-0",
          side === "bottom" && "-top-1 -translate-x-1/2 border-r-0 border-b-0",
          side === "left" && "-right-1 -translate-y-1/2 border-l-0 border-b-0",
          side === "right" && "-left-1 -translate-y-1/2 border-r-0 border-t-0",
        )}
      />
    </div>,
    document.body,
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
