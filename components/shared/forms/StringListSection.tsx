"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

import { Input } from "@/components/shared/Input";
import FormCardSection from "@/components/shared/forms/FormCardSection";

type StringListSectionProps = {
  title: string;
  labelPrefix: string;
  items: string[];
  onItemsChange: (updater: (prev: string[]) => string[]) => void;
  isSubmitting: boolean;
  minItems?: number;
  showAddButton?: boolean;
  canRemoveItem?: (value: string, idx: number) => boolean;
};

export default function StringListSection({
  title,
  labelPrefix,
  items,
  onItemsChange,
  isSubmitting,
  minItems = 1,
  showAddButton = true,
  canRemoveItem,
}: StringListSectionProps) {
  return (
    <FormCardSection
      title={title}
      action={
        showAddButton ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-normal normal-case"
            onClick={() => onItemsChange((prev) => [...prev, ""])}
            disabled={isSubmitting}
          >
            <FiPlus size={20} />
          </button>
        ) : null
      }
    >
      <div className="mt-6 space-y-6">
        {items.map((value, idx) => {
          const removeDisabled =
            isSubmitting ||
            items.length <= minItems ||
            (canRemoveItem ? !canRemoveItem(value, idx) : false);

          return (
            <div key={`${labelPrefix}-${idx}`} className="flex items-center gap-6">
              <Input
                floatingLabel={`${labelPrefix} ${idx + 1}`}
                value={value}
                onChange={(e) => {
                  const next = e.target.value;
                  onItemsChange((prev) =>
                    prev.map((item, i) => (i === idx ? next : item)),
                  );
                }}
                disabled={isSubmitting}
                className="h-12! placeholder:text-dashboard-input-placeholder"
              />

              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center text-danger-normal disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() =>
                  onItemsChange((prev) => prev.filter((_, i) => i !== idx))
                }
                disabled={removeDisabled}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </FormCardSection>
  );
}