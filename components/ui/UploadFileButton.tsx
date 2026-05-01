"use client";

import { uploadImage, type UploadImageResponse } from "@/lib/api/uplaodImage";
import { cn } from "@/lib/utils/cn";
import { toAbsoluteFileUrl } from "@/lib/utils/fileUrl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import Loader from "./Loader";
import { useI18n } from "@/providers/I18nProvider";
type UploadFileButtonProps = {
  label?: ReactNode;
  uploadingLabel?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  showPreviewButton?: boolean;
  previewButtonClassName?: string;
  showRemoveButton?: boolean;
  removeButtonClassName?: string;
  isVideo?: boolean;

  onFilesSelected?: (files: FileList) => void;
  onUploaded?: (result: UploadImageResponse, file: File) => void;
  onUploadError?: (error: unknown) => void;

  initialPreviewSrc?: string;
  getPreviewSrc?: (
    result: UploadImageResponse,
    file: File,
  ) => string | null | undefined;

  onPreview?: (src: string) => void;
  onRemovePreview?: () => void;
};

function defaultGetPreviewSrc(result: UploadImageResponse): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = result as any;
  return (
    r?.url ??
    r?.fileUrl ??
    r?.imageUrl ??
    r?.path ??
    r?.data?.url ??
    r?.data?.fileUrl ??
    r?.data?.imageUrl ??
    r?.data?.path ??
    null
  );
}

const UploadFileButton = ({
  label = "Upload",
  accept = "image/*",
  multiple = false,
  disabled = false,
  className,
  buttonClassName,
  showPreviewButton = true,
  previewButtonClassName,
  showRemoveButton = false,
  removeButtonClassName,
  onFilesSelected,

  isVideo = false,
  onUploaded,
  onUploadError,

  initialPreviewSrc,
  getPreviewSrc,

  onPreview,
  onRemovePreview,
}: UploadFileButtonProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [previewSrc, setPreviewSrc] = useState<string>(initialPreviewSrc ?? "");
  const objectUrlRef = useRef<string | null>(null);
  const { lang } = useI18n();
  const canPreview = useMemo(
    () => showPreviewButton && !!previewSrc && !isVideo,
    [showPreviewButton, previewSrc, isVideo],
  );
  const canRemove = useMemo(
    () => showRemoveButton && !!previewSrc && !isVideo,
    [showRemoveButton, previewSrc, isVideo],
  );
  const hasTrailingActions = canPreview || canRemove;
  const resolvedPreviewSrc = useMemo(
    () => (previewSrc ? toAbsoluteFileUrl(previewSrc) : ""),
    [previewSrc],
  );

  const isDisabled = disabled || isUploading;

  const handlePick = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handlePreview = () => {
    if (!canPreview) return;
    onPreview?.(previewSrc || resolvedPreviewSrc);
  };
  const handleRemove = () => {
    if (!canRemove) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewSrc("");
    onRemovePreview?.();
  };

  useEffect(() => {
    setPreviewSrc(initialPreviewSrc ?? "");
  }, [initialPreviewSrc]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("inline-flex items-center", className)}>
      {lang === "ar" ? (
        <>
          <div className="inline-flex">
            {canPreview ? (
              <button
                type="button"
                onClick={handlePreview}
                disabled={isDisabled}
                className={cn(
                  "h-10 w-10 rounded-sm",
                  "border border-secondary-light-hover bg-white text-primary-normal",
                  "transition-colors duration-300",
                  "hover:bg-primary-light hover:text-primary-dark",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-normal/30",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "inline-flex items-center justify-center",
                  canRemove ? "rounded-none border-r-0" : "rounded-l-none",
                  previewButtonClassName,
                )}
                aria-label="Preview uploaded image"
                title="Preview"
              >
                <FiEye size={18} />
              </button>
            ) : null}
            {canRemove ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isDisabled}
                className={cn(
                  "h-10 w-10 rounded-sm",
                  "border border-secondary-light-hover bg-white text-danger-normal",
                  "transition-colors duration-300",
                  "hover:bg-danger-normal/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-normal/30",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "inline-flex items-center justify-center",
                  "rounded-l-none",
                  removeButtonClassName,
                )}
                aria-label="Remove uploaded image"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={handlePick}
              disabled={isDisabled}
              aria-busy={isUploading}
              className={cn(
                "h-10 rounded-sm px-6 text-sm font-semibold",
                "border border-secondary-light-hover bg-white text-primary-normal",
                "transition-colors duration-300",
                "hover:bg-primary-light hover:text-primary-dark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-normal/30",
                "disabled:opacity-50 disabled:pointer-events-none",
                "inline-flex items-center justify-center gap-2",
                hasTrailingActions ? "rounded-r-none border-r-0" : "",
                buttonClassName,
              )}
            >
              {isUploading ? (
                <>
                  <span className="inline-flex items-center">
                    <Loader />
                  </span>
                </>
              ) : (
                label
              )}
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={isDisabled}
            className="hidden"
            onChange={(e) => {
              const list = e.target.files;
              if (!list || list.length === 0) return;

              const filesArr = Array.from(list);

              onFilesSelected?.(list);

              e.target.value = "";


              void (async () => {
                try {
                  setIsUploading(true);

                  for (const file of filesArr) {
                    const res = await uploadImage(file,  isVideo);

                    const next =
                      getPreviewSrc?.(res, file) ??
                      defaultGetPreviewSrc(res) ??
                      (!isVideo ? URL.createObjectURL(file) : null);

                    if (next) {
                      if (next.startsWith("blob:")) {
                        if (objectUrlRef.current) {
                          URL.revokeObjectURL(objectUrlRef.current);
                        }
                        objectUrlRef.current = next;
                      }
                      setPreviewSrc(next);
                    }

                    onUploaded?.(res, file);
                  }
                } catch (err) {
                  onUploadError?.(err);
                } finally {
                  setIsUploading(false);
                }
              })();
            }}
          />
        </>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={isDisabled}
            className="hidden"
            onChange={(e) => {
              const list = e.target.files;
              if (!list || list.length === 0) return;

              const filesArr = Array.from(list);

              onFilesSelected?.(list);

              e.target.value = "";


              void (async () => {
                try {
                  setIsUploading(true);

                  for (const file of filesArr) {
                    const res = await uploadImage(file,  isVideo);

                    const next =
                      getPreviewSrc?.(res, file) ??
                      defaultGetPreviewSrc(res) ??
                      (!isVideo ? URL.createObjectURL(file) : null);

                    if (next) {
                      if (next.startsWith("blob:")) {
                        if (objectUrlRef.current) {
                          URL.revokeObjectURL(objectUrlRef.current);
                        }
                        objectUrlRef.current = next;
                      }
                      setPreviewSrc(next);
                    }

                    onUploaded?.(res, file);
                  }
                } catch (err) {
                  onUploadError?.(err);
                } finally {
                  setIsUploading(false);
                }
              })();
            }}
          />

          <div className="inline-flex">
            <button
              type="button"
              onClick={handlePick}
              disabled={isDisabled}
              aria-busy={isUploading}
              className={cn(
                "h-10 rounded-sm px-6 text-sm font-semibold",
                "border border-secondary-light-hover bg-white text-primary-normal",
                "transition-colors duration-300",
                "hover:bg-primary-light hover:text-primary-dark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-normal/30",
                "disabled:opacity-50 disabled:pointer-events-none",
                "inline-flex items-center justify-center gap-2",
                hasTrailingActions ? "rounded-r-none border-r-0" : "",
                buttonClassName,
              )}
            >
              {isUploading ? (
                <>
                  <span className="inline-flex items-center">
                    <Loader />
                  </span>
                </>
              ) : (
                label
              )}
            </button>

            {canPreview ? (
              <button
                type="button"
                onClick={handlePreview}
                disabled={isDisabled}
                className={cn(
                  "h-10 w-10 rounded-sm",
                  "border border-secondary-light-hover bg-white text-primary-normal",
                  "transition-colors duration-300",
                  "hover:bg-primary-light hover:text-primary-dark",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-normal/30",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "inline-flex items-center justify-center",
                  canRemove ? "rounded-none border-r-0" : "rounded-l-none",
                  previewButtonClassName,
                )}
                aria-label="Preview uploaded image"
                title="Preview"
              >
                <FiEye size={18} />
              </button>
            ) : null}
            {canRemove ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isDisabled}
                className={cn(
                  "h-10 w-10 rounded-sm",
                  "border border-secondary-light-hover bg-white text-danger-normal",
                  "transition-colors duration-300",
                  "hover:bg-danger-normal/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-normal/30",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "inline-flex items-center justify-center",
                  "rounded-l-none",
                  removeButtonClassName,
                )}
                aria-label="Remove uploaded image"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default UploadFileButton;
