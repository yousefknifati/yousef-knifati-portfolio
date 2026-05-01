/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";

type AppImageProps = Omit<NextImageProps, "src" | "alt" | "width" | "height" | "fill"> & {
  src?: NextImageProps["src"];
  alt?: string;

  width?: number;
  height?: number;

  fill?: boolean;

  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;

  /** Useful when using fill to preserve aspect ratio (e.g. 1 for square, 16/9, etc.) */
  ratio?: number;

  /** If the image fails to load, we try this source */
  fallbackSrc?: NextImageProps["src"];
};

export const AppImage = React.forwardRef<HTMLImageElement, AppImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill,
      sizes,
      className,

      wrapperClassName,
      wrapperStyle,
      ratio,

      fallbackSrc="/fallbackImage.png",
      onError,

      ...rest
    },
    ref
  ) => {
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
      setFailed(false);
    }, [src]);

    if (!src && !fallbackSrc) return null;

    const activeSrc = (failed && fallbackSrc) ? fallbackSrc : (src ?? fallbackSrc);

    if (!activeSrc) return null;

    const hasNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
    const hasFixedSize = hasNumber(width) && hasNumber(height);

    // Force fill when width/height are missing to avoid runtime errors.
    const useFill = Boolean(fill) || !hasFixedSize;

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
      if (fallbackSrc && !failed) setFailed(true);
      onError?.(e as any);
    };

    const img = (
      <NextImage
        {...rest}
        ref={ref as any}
        src={activeSrc}
        alt={alt ?? ""}
        onError={handleError as any}
        className={cn(className)}
        {...(useFill
          ? {
              fill: true as const,
              sizes: sizes ?? "100vw",
            }
          : {
              width: width as number,
              height: height as number,
            })}
      />
    );

    if (!useFill) return img;

    return (
      <span
        className={cn("relative inline-block overflow-hidden", wrapperClassName)}
        style={{
          ...(ratio ? { aspectRatio: String(ratio) } : null),
          ...wrapperStyle,
        }}
      >
        {img}
      </span>
    );
  }
);

AppImage.displayName = "AppImage";

export default AppImage;
