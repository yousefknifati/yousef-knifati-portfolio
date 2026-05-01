// components/VideoUploadCard.tsx
"use client";

import { uploadImage, type UploadImageResponse } from "@/lib/api/uplaodImage";
import { cn } from "@/lib/utils/cn";
import { toAbsoluteFileUrl } from "@/lib/utils/fileUrl";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import { PiUploadFill } from "react-icons/pi";
import Loader from "./Loader";

type VideoUploadCardProps = {
  label?: string; // "Upload Video"
  subtitle?: string; // "Support mp4, mov, 3gp"
  accept?: string; // default video types
  disabled?: boolean;
  initialPreviewSrc?: string;
  onUploaded?: (result: UploadImageResponse, file: File) => void;
  onUploadError?: (error: unknown) => void;
  onPreview?: (src: string) => void;
  className?: string;
};

export default function VideoUploadCard({
  label = "Upload Video",
  subtitle = "Support mp4, mov, 3gp",
  accept = "video/mp4,video/quicktime,video/3gpp",
  disabled = false,
  initialPreviewSrc,
  onUploaded,
  onUploadError,
  onPreview,
  className,
}: VideoUploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    initialPreviewSrc ?? null,
  );
  const objectUrlRef = useRef<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const isDisabled = disabled || isUploading;

  const resolvedPreviewSrc = useMemo(() => {
    if (!previewSrc) return null;
    return toAbsoluteFileUrl(previewSrc);
  }, [previewSrc]);

  const canPreview = useMemo(() => !!resolvedPreviewSrc, [resolvedPreviewSrc]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const openFilePicker = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handlePreview = () => {
    if (!resolvedPreviewSrc) return;
    onPreview?.(previewSrc ?? resolvedPreviewSrc);
    // open in new tab for quick preview
    window.open(resolvedPreviewSrc, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "cursor-pointer w-full flex items-center gap-4 rounded-md border border-dashed border-dashboard-border bg-white px-4 py-3 text-left",
        className,
      )}
      onClick={openFilePicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFilePicker();
        }
      }}
      aria-disabled={isDisabled}
    >
      {/* left circular icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          "bg-primary-light text-primary-normal",
        )}
        aria-hidden
      >
        <PiUploadFill size={24} />
      </div>

      {/* text area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-secondary-normal truncate">
              {label}
            </p>
            <p className="text-xs text-secondary-300 truncate">{subtitle}</p>
          </div>

          {/* preview / filename */}
          <div className="flex items-center gap-3">
            {isUploading ? (
              <div className="inline-flex items-center gap-2">
                <Loader />
                <span className="text-sm text-secondary-300">Uploading…</span>
              </div>
            ) : canPreview ? (
              <div className="flex items-center gap-2">
                {resolvedPreviewSrc ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePreview();
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-1 border border-secondary-light-hover bg-white text-sm text-secondary-normal hover:bg-primary-light hover:text-primary-dark transition-colors"
                    aria-label="Preview video"
                  >
                    <FiEye size={16} />
                    <span className="max-w-40 text-ellipsis overflow-hidden whitespace-nowrap text-xs">
                      {fileName ??
                        new URL(resolvedPreviewSrc).pathname.split("/").pop()}
                    </span>
                  </span>
                ) : null}
              </div>
            ) : null}

            <div>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  const file = files[0];
                  setFileName(file.name);

                  // clear input so same file can be re-picked later
                  e.currentTarget.value = "";

               

                  setIsUploading(true);
                  try {
                    const res = await uploadImage(file, true);
                    // try to derive preview src from response
                    // prefer result.url-like fields
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const r = res as any;
                    const next =
                      r?.url ??
                      r?.fileUrl ??
                      r?.videoUrl ??
                      r?.path ??
                      r?.data?.url ??
                      r?.data?.fileUrl ??
                      r?.data?.videoUrl ??
                      null;
                    if (next) {
                      setPreviewSrc(next);
                      setFileName(file.name);
                    } else {
                      // fallback to blob preview (useful in dev)
                      const blobUrl = URL.createObjectURL(file);
                      if (objectUrlRef.current) {
                        URL.revokeObjectURL(objectUrlRef.current);
                      }
                      objectUrlRef.current = blobUrl;
                      setPreviewSrc(blobUrl);
                    }

                    onUploaded?.(res, file);
                  } catch (err) {
                    onUploadError?.(err);
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />

            </div>
          </div>
        </div>

        {null}
      </div>
    </div>
  );
}
