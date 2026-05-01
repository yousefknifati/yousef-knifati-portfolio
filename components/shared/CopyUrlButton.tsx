"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { RiFileCopyLine } from "react-icons/ri";
import { cn } from "@/lib/utils/cn";

type Props = {
  url: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function toAbsoluteUrl(url: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === "undefined") return url;
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  return `${window.location.origin}/${url}`;
}

export default function CopyUrlButton({
  url,
  className,
  ariaLabel = "Copy link",
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        try {
          const value = toAbsoluteUrl(url);
          if (!value) {
            toast.error("No link available");
            return;
          }
          await copyText(value);
          toast.success("Link copied");
        } catch {
          toast.error("Failed to copy link");
        }
      }}
      className={cn(
        "cursor-pointer p-2! hover:bg-secondary-light-hover transition-all duration-200 rounded-md text-secondary-normal hover:text-slate-900",
        disabled ? "cursor-not-allowed opacity-60" : "",
        className,
      )}
      aria-label={ariaLabel}
    >
      <RiFileCopyLine size={20} />
    </button>
  );
}
