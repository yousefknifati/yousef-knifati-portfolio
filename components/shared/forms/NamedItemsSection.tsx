"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

import FormCardSection from "@/components/shared/forms/FormCardSection";
import { Input } from "@/components/shared/Input";

type NamedItem = {
  name: string;
};

type NamedItemsSectionProps<T extends NamedItem> = {
  title: string;
  labelPrefix: string;
  items: T[];
  onItemsChange: (updater: (prev: T[]) => T[]) => void;
  isSubmitting: boolean;
  minItems?: number;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  createItem: () => T;
  canRemoveItem?: (item: T, idx: number) => boolean;
};

export default function NamedItemsSection<T extends NamedItem>({
  title,
  labelPrefix,
  items,
  onItemsChange,
  isSubmitting,
  minItems = 1,
  showAddButton = true,
  showRemoveButton = true,
  createItem,
  canRemoveItem,
}: NamedItemsSectionProps<T>) {
  return (
    <FormCardSection
      title={title}
      action={
        showAddButton ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-normal normal-case"
            onClick={() => onItemsChange((prev) => [...prev, createItem()])}
            disabled={isSubmitting}
          >
            <FiPlus size={20} />
          </button>
        ) : null
      }
    >
      <div className="mt-6 space-y-6">
        {items.map((item, idx) => (
          <div key={`${labelPrefix}-${idx}`} className="flex items-center gap-6">
            <Input
              floatingLabel={`${labelPrefix} ${idx + 1}`}
              value={item.name}
              onChange={(e) => {
                const next = e.target.value;
                onItemsChange((prev) =>
                  prev.map((row, i) =>
                    i === idx ? ({ ...row, name: next } as T) : row,
                  ),
                );
              }}
              disabled={isSubmitting}
              className="h-12! placeholder:text-dashboard-input-placeholder"
            />
            {showRemoveButton ? (
              <button
                type="button"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center text-danger-normal disabled:cursor-not-allowed"
                onClick={() =>
                  onItemsChange((prev) => prev.filter((_, i) => i !== idx))
                }
                disabled={
                  isSubmitting ||
                  items.length <= minItems ||
                  (canRemoveItem ? !canRemoveItem(item, idx) : false)
                }
              >
                <FiTrash2 size={18} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </FormCardSection>
  );
}
