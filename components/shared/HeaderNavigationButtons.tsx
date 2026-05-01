"use client";

import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { GoDesktopDownload } from "react-icons/go";
import { PiNotePencilDuotone } from "react-icons/pi";

import CopyUrlButton from "@/components/shared/CopyUrlButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils/cn";

type Props = {
  editHref: string;
  copyUrl: string;
  className?: string;
  showViewButton?: boolean;
  viewHref?: string;
  showDownloadButton?: boolean;
  onDownloadClick?: () => void;
  isDownloadPending?: boolean;
  editAriaLabel?: string;
  viewAriaLabel?: string;
  copyAriaLabel?: string;
  downloadAriaLabel?: string;
};

const ACTION_LINK_CLASS =
  "cursor-pointer rounded-md p-2! text-secondary-normal transition-all duration-200 hover:bg-secondary-light-hover hover:text-slate-900";

export default function HeaderNavigationButtons({
  editHref,
  copyUrl,
  className = "flex items-center gap-1",
  showViewButton = false,
  viewHref,
  showDownloadButton = false,
  onDownloadClick,
  isDownloadPending = false,
  editAriaLabel = "Edit",
  viewAriaLabel = "View as Client",
  copyAriaLabel = "Copy link",
  downloadAriaLabel = "Download PDF",
}: Props) {
  return (
    <div className={cn(className)}>
      {showViewButton && viewHref ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <Link
              href={viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className={ACTION_LINK_CLASS}
              aria-label={viewAriaLabel}
            >
              <FiEye size={20} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">{viewAriaLabel}</TooltipContent>
        </Tooltip>
      ) : null}

      <Tooltip delayDuration={120}>
        <TooltipTrigger className="inline-flex">
          <CopyUrlButton url={copyUrl} ariaLabel={copyAriaLabel} />
        </TooltipTrigger>
        <TooltipContent side="top">{copyAriaLabel}</TooltipContent>
      </Tooltip>

      {showDownloadButton ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <button
              type="button"
              onClick={onDownloadClick}
              disabled={isDownloadPending}
              className={ACTION_LINK_CLASS}
              aria-label={downloadAriaLabel}
            >
              <GoDesktopDownload size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{downloadAriaLabel}</TooltipContent>
        </Tooltip>
      ) : null}

      <Tooltip delayDuration={120}>
        <TooltipTrigger className="inline-flex">
          <Link
            href={editHref}
            className={ACTION_LINK_CLASS}
            aria-label={editAriaLabel}
          >
            <PiNotePencilDuotone size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top">{editAriaLabel}</TooltipContent>
      </Tooltip>
    </div>
  );
}
