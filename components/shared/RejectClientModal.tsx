"use client";

import * as React from "react";

import Button from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import ModalShell from "@/components/ui/ModalShell";

type RejectClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void | Promise<void>;
  isPending?: boolean;
  title: string;
  reasonLabel: string;
  cancelLabel: string;
  confirmLabel: string;
};

export default function RejectClientModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  title,
  reasonLabel,
  cancelLabel,
  confirmLabel,
}: RejectClientModalProps) {
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-2xl"
      className="rounded-sm border border-secondary-light-hover bg-white"
    >
      <div className="space-y-6 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-primary-darker">{title}</h2>

        <Textarea
          floatingLabel={reasonLabel}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isPending}
          rows={5}
          className="placeholder:text-dashboard-input-placeholder"
        />

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="bg-transparent text-secondary-normal hover:bg-secondary-section-bg"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onSubmit(reason)}
            disabled={isPending}
            className="bg-danger-normal text-white hover:bg-danger-dark-hover"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
