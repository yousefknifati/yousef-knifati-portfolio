"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { toAbsoluteFileUrl } from "@/lib/utils/fileUrl";
import { useI18n } from "@/providers/I18nProvider";
import { MdPlayCircle } from "react-icons/md";

type VideoCardProps = {
  title?: string;
  note?: string;
  className?: string;

  // Future backend integration
  videoUrl?: string;
  posterUrl?: string;
};

const VideoCard = ({
  title,
  note,
  className,
  videoUrl,
  posterUrl,
}: VideoCardProps) => {
  const { t } = useI18n();
  const resolvedTitle = title ?? t("workContractDetails.video.title");
  const resolvedNote = note ?? t("workContractDetails.video.note");
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const resolvedVideoSrc = React.useMemo(() => {
    if (!videoUrl) return "";
    return toAbsoluteFileUrl(videoUrl);
  }, [videoUrl]);
  const resolvedPosterSrc = React.useMemo(() => {
    if (!posterUrl) return undefined;
    return toAbsoluteFileUrl(posterUrl);
  }, [posterUrl]);
  return (
    <section
      className={cn(
        "w-full rounded-md border border-secondary-light-hover bg-white",
        "p-6 sm:p-8",
        "shadow-[0_10px_26px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <h3 className="text-xl font-extrabold tracking-tight text-primary-darker">
        {resolvedTitle}
      </h3>

      <div
        className={cn(
          "mt-6 overflow-hidden rounded-sm",
          "border border-secondary-light-hover bg-secondary-light"
        )}
      >
        {videoUrl ? (
          <div className="relative">
            <video
              ref={videoRef}
              className="h-[280px] w-full bg-secondary-light object-cover sm:h-[360px]"
              src={resolvedVideoSrc}
              poster={resolvedPosterSrc}
              controls
              controlsList="nodownload"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {!isPlaying && (
              <button
                type="button"
                onClick={() => videoRef.current?.play()}
                className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/35"
                aria-label="Play video"
              >
                <MdPlayCircle className="text-white" size={64} />
              </button>
            )}
          </div>
        ) : (
          <div className="h-[280px] w-full bg-secondary-light sm:h-[360px]" />
        )}
      </div>

      <p className="mt-6 text-sm text-secondary-200">{resolvedNote}</p>
    </section>
  );
};

export default VideoCard;
