// components/VideoPreviewModal.tsx
"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

import { toAbsoluteFileUrl } from "@/lib/utils/fileUrl";
import { useI18n } from "@/providers/I18nProvider";
import ModalShell from "./ModalShell";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

export default function VideoPreviewModal({
  isOpen,
  onClose,
  src,
  autoPlay = false,
  loop = false,
  muted = false,
}: Props) {
  const { t } = useI18n();
  const closeAriaLabel = t("profile.common.aria.close");

  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // compute full source (support blob and absolute urls)
  const resolvedSrc = React.useMemo(() => {
    if (!src) return "";
    const trimmed = src.trim();
    return toAbsoluteFileUrl(trimmed);
  }, [src]);

  useEffect(() => {
    if (!isOpen || !resolvedSrc) return;

    let active = true;

    // create a temporary video element to extract metadata if videoRef not ready
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.src = resolvedSrc;

    const onLoadedMeta = () => {
      if (!active) return;
      const naturalW = probe.videoWidth || 640;
      const naturalH = probe.videoHeight || 360;

      const maxW = Math.min(window.innerWidth * 0.95, 2000);
      const maxH = Math.min(window.innerHeight * 0.85, 2000);
      const scale = Math.min(maxW / naturalW, maxH / naturalH, 1);

      setSize({
        w: Math.max(1, Math.round(naturalW * scale)),
        h: Math.max(1, Math.round(naturalH * scale)),
      });
    };

    const onError = () => {
      if (!active) return;
      setSize(null);
    };

    probe.addEventListener("loadedmetadata", onLoadedMeta);
    probe.addEventListener("error", onError);

    // in case metadata already loaded quickly
    if (probe.readyState >= 1) {
      onLoadedMeta();
    }

    return () => {
      active = false;
      probe.removeEventListener("loadedmetadata", onLoadedMeta);
      probe.removeEventListener("error", onError);
      try {
        probe.src = "";
      } catch {
        // ignore
      }
    };
  }, [isOpen, resolvedSrc]);

  // when modal opens, try to pause any playing video elsewhere and focus the modal video
  useEffect(() => {
    if (!isOpen) return;

    const cleanup = () => {
      try {
        // try pause other videos on page
        document.querySelectorAll("video").forEach((v) => {
          if (v !== videoRef.current) v.pause();
        });
      } catch {
        // ignore
      }
    };

    cleanup();
  }, [isOpen]);

  if (!resolvedSrc) return null;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-none">
      <div className="relative flex items-center justify-center p-0">
        <div
          className="relative flex items-center justify-center"
          style={size ? { width: `${size.w}px`, height: `${size.h}px` } : undefined}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-20 rounded-full bg-black/70 p-1.5 text-[#EDBB5C] hover:bg-black/80"
            aria-label={closeAriaLabel}
          >
            <FiX size={20} />
          </button>

          {size ? (
            <video
              ref={videoRef}
              src={resolvedSrc}
              width={size.w}
              height={size.h}
              controls
              playsInline
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              className="select-none object-contain"
            />
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={resolvedSrc}
                controls
                playsInline
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                className="h-auto max-h-[85vh] w-auto max-w-[95vw] select-none object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}