"use client";

import * as React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

import Button from "@/components/shared/Button";
import ModalShell from "@/components/ui/ModalShell";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  maxWidthClass?: string;
  className?: string;
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  maxWidthClass = "max-w-2xl",
  className,
}: DeleteConfirmModalProps) {
  const { t } = useI18n();

  const resolvedDescription =
    description ?? t("company.modals.delete.defaultDescription");
  const resolvedConfirmText =
    confirmText ?? t("company.modals.delete.confirmText");
  const resolvedCancelText = cancelText ?? t("company.common.cancel");

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass={maxWidthClass}
      className={cn(
        "bg-white rounded-sm border border-secondary-light-hover !scrollbar-hidden",
        className,
      )}
    >
      <header className="flex justify-between px-10 py-5 items-center border-b border-secondary-light-hover">
        <h2 className="text-2xl font-semibold text-primary-darker">{title}</h2>

        <button
          className="cursor-pointer text-sm font-medium text-primary-normal hover:bg-secondary-normal/30 p-2 rounded-md transition-all duration-300 disabled:opacity-50"
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label={t("profile.common.aria.close")}
        >
          <IoCloseOutline className="text-secondary-normal" size={22} />
        </button>
      </header>

      <main className="px-10 py-10 flex flex-col gap-4 !scrollbar-hidden">
        <p className="text-primary-darker font-medium text-xl">{resolvedDescription}</p>
      </main>

      <footer className="px-10 py-6">
        <div className="flex justify-end gap-6">
          <Button
            type="button"
            size="sm"
            className="text-secondary-normal bg-transparent text-base hover:bg-secondary-normal/30 hover:text-secondary-normal"
            onClick={onClose}
            disabled={isLoading}
          >
            {resolvedCancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            className="flex items-center gap-3 text-white bg-danger-normal hover:bg-danger-dark-hover text-base px-6"
            onClick={onConfirm}
            disabled={isLoading}
          >
            <span>
              {isLoading ? t("company.modals.delete.deleting") : resolvedConfirmText}
            </span>
            <RiDeleteBinLine className="text-white" size={18} />
          </Button>
        </div>
      </footer>
    </ModalShell>
  );
}