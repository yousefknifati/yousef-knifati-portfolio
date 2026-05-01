"use client";

import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  maxWidthClass?: string;
  className?: string;
  children: React.ReactNode;
};

const ModalShell = ({
  isOpen,
  onClose,
  maxWidthClass = "max-w-xl",
  className,
  children,
}: ModalShellProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-2001 bg-black/10 backdrop-blur-sm "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-2001 flex items-center justify-center p-4 mx-auto "
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
          >
            <div
              ref={contentRef}
              onClick={(e) => e.stopPropagation()}
              className={classNames(
                "relative w-full",
                maxWidthClass,
                "max-h-[90svh]",
                className
              )}
            >
              <div className="relative rounded-xl overflow-auto max-h-[90svh] custom-scrollbar shadow-[0_0_4px_0_rgba(255,255,255,0.1)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalShell;
