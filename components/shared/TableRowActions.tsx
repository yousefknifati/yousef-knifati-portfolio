"use client";

import Link from "next/link";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { PiPencilSimpleLine } from "react-icons/pi";

import { cn } from "@/lib/utils/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { useI18n } from "@/providers/I18nProvider";

type TableRowActionsProps = {
  viewHref?: string;
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  itemLabel?: string;
  iconSize?: number;
  className?: string;
};

export default function TableRowActions({
  viewHref,
  editHref,
  onEdit,
  onDelete,
  itemLabel = "item",
  iconSize = 15,
  className,
}: TableRowActionsProps) {
  const { t } = useI18n();
  const viewLabel = `${t("company.tableRowActions.view")} ${itemLabel}`;
  const editLabel = `${t("company.tableRowActions.edit")} ${itemLabel}`;
  const deleteLabel = `${t("company.tableRowActions.delete")} ${itemLabel}`;

  return (
    <div
      className={cn(
        "flex items-center justify-center text-secondary-300",
        className,
      )}
    >
      {viewHref ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <Link
              href={viewHref}
              className="rounded-md p-2! transition-all duration-200 hover:bg-secondary-light-hover hover:text-secondary-500"
              aria-label={viewLabel}
            >
              <FiEye size={iconSize} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">{viewLabel}</TooltipContent>
        </Tooltip>
      ) : null}

      {onEdit ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <button
              type="button"
              className="cursor-pointer rounded-md p-2! transition-all duration-200 hover:bg-secondary-light-hover hover:text-secondary-500"
              aria-label={editLabel}
              onClick={onEdit}
            >
              <PiPencilSimpleLine size={iconSize} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{editLabel}</TooltipContent>
        </Tooltip>
      ) : null}

      {!onEdit && editHref ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <Link
              href={editHref}
              className="rounded-md p-2! transition-all duration-200 hover:bg-secondary-light-hover hover:text-secondary-500"
              aria-label={editLabel}
            >
              <PiPencilSimpleLine size={iconSize} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">{editLabel}</TooltipContent>
        </Tooltip>
      ) : null}

      {onDelete ? (
        <Tooltip delayDuration={120}>
          <TooltipTrigger className="inline-flex">
            <button
              type="button"
              className="cursor-pointer rounded-md p-2! text-danger-normal transition-all duration-200 hover:bg-secondary-light-hover hover:text-danger-dark"
              aria-label={deleteLabel}
              onClick={onDelete}
            >
              <FiTrash2 size={iconSize} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{deleteLabel}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
