"use client";

import { useI18n } from "@/providers/I18nProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { toAbsoluteFileUrl } from "@/lib/utils/fileUrl";
import ModalShell from "./ModalShell";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
};

const ImagePreviewModal = ({ isOpen, onClose, src, alt }: Props) => {
  const { t } = useI18n();
  const resolvedAlt = alt ?? t("profile.common.previewAlt");
  const closeAriaLabel = t("profile.common.aria.close");

  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !src) return;

    let active = true;
    const img = new window.Image();
    img.src = toAbsoluteFileUrl(src);

    img.onload = () => {
      if (!active) return;

      const maxW = Math.min(window.innerWidth * 0.95, 2000);
      const maxH = Math.min(window.innerHeight * 0.85, 2000);
      const scale = Math.min(
        maxW / img.naturalWidth,
        maxH / img.naturalHeight,
        1,
      );

      setSize({
        w: Math.max(1, Math.round(img.naturalWidth * scale)),
        h: Math.max(1, Math.round(img.naturalHeight * scale)),
      });
    };

    img.onerror = () => {
      if (active) setSize(null);
    };

    return () => {
      active = false;
    };
  }, [isOpen, src]);

  if (!src) return null;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-none">
      <div className="relative flex items-center justify-center p-0">
        {size ? (
          <div
            className="relative"
            style={{ width: `${size.w}px`, height: `${size.h}px` }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-1.5 text-primary-normal hover:bg-black/80"
              aria-label={closeAriaLabel}
            >
              <FiX size={20} />
            </button>

            <Image
              src={toAbsoluteFileUrl(src)}
              alt={resolvedAlt}
              fill
              sizes={`${size.w}px`}
              className="select-none object-contain"
              priority
              unoptimized
            />
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-1 z-10 rounded-full bg-black/70 p-1.5 text-primary-normal hover:bg-black/80"
              aria-label={closeAriaLabel}
            >
              <FiX size={20} />
            </button>

            <Image
              width={500}
              height={500}
              src={toAbsoluteFileUrl(src)}
              alt={resolvedAlt}
              className="h-auto max-h-[85vh] w-auto max-w-[95vw] select-none object-contain"
              priority
              unoptimized
            />
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default ImagePreviewModal;