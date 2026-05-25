"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { cn } from "@/lib/utils/cn";

export type ProjectImage = {
  src: string;
  alt: string;
};

type ProjectCarouselProps = {
  images: ProjectImage[];
  direction?: "ltr" | "rtl";
  previousLabel: string;
  nextLabel: string;
  slideLabel: (index: number) => string;
};

export default function ProjectCarousel({
  images,
  direction = "ltr",
  previousLabel,
  nextLabel,
  slideLabel,
}: ProjectCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction,
    loop: images.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelectedIndex = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  return (
    <div className="group relative">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-xl border border-portfolio-border bg-neutral-900"
        dir={direction}
      >
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div key={image.src} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <div className="relative aspect-video w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute start-4 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <FiChevronLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => emblaApi?.scrollNext()}
            className="absolute end-4 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <FiChevronRight aria-hidden="true" className="size-5 rtl:rotate-180" />
          </button>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={slideLabel(index + 1)}
                aria-current={selectedIndex === index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  selectedIndex === index
                    ? "w-7 bg-portfolio-accent"
                    : "w-3 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
