"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { PiFilePdfDuotone } from "react-icons/pi";

import Button from "@/components/shared/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

type Props = {
  onReject: () => void;
  onApprove: () => void;
  isPending?: boolean;
  rejectLabel?: string;
  approveLabel?: string;
  rejectAriaLabel?: string;
  approveAriaLabel?: string;
  showDownloadButton?: boolean;
  onDownloadClick?: () => void;
  isDownloadPending?: boolean;
  downloadAriaLabel?: string;
  className?: string;
};

const ACTION_LINK_CLASS =
  "cursor-pointer rounded-md p-2! text-secondary-normal transition-all duration-200 hover:bg-secondary-light-hover hover:text-slate-900";

export default function ActionButtonsHeader({
  onReject,
  onApprove,
  isPending = false,
  rejectLabel = "Reject",
  approveLabel = "Approve",
  rejectAriaLabel = "Reject",
  approveAriaLabel = "Approve",
  showDownloadButton = false,
  onDownloadClick,
  isDownloadPending = false,
  downloadAriaLabel = "Download PDF",
  className = "flex items-center justify-center gap-2",
}: Props) {
  return (
    <div className={className}>
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
              <PiFilePdfDuotone size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{downloadAriaLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      <Button
        type="button"
        size="sm"
        className="h-auto min-w-0 bg-danger-light px-1.5 py-0.5 text-danger-normal hover:bg-danger-normal hover:text-danger-light gap-2.5"
        onClick={onReject}
        disabled={isPending}
        aria-label={rejectAriaLabel}
      >
        <FiX size={16} />
        {rejectLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        className="h-auto min-w-0 bg-success-light px-1.5 py-0.5 text-success-normal hover:bg-success-normal hover:text-success-light gap-2.5"
        onClick={onApprove}
        disabled={isPending}
        aria-label={approveAriaLabel}
      >
        <FiCheck size={16} />
        {approveLabel}
      </Button>
    </div>
  );
}
