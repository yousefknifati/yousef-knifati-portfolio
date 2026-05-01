"use client";

import DetailsSectionContainer from "@/components/shared/DetailsSectionContainer";

type Props = {
  title: string;
  items?: string[] | null;
  emptyText?: string;
  className?: string;
};

export default function DetailsListContent({
  title,
  items,
  emptyText = "-",
  className,
}: Props) {
  const normalizedItems = (items ?? []).filter(Boolean);

  return (
    <DetailsSectionContainer title={title} className={className}>
      {normalizedItems.length === 0 ? (
        <p className="text-md font-medium text-secondary-300">{emptyText}</p>
      ) : (
        <ul className="list-inside list-disc space-y-2 text-md font-medium text-secondary-normal">
          {normalizedItems.map((item, idx) => (
            <li key={`${item}-${idx}`}>{item}</li>
          ))}
        </ul>
      )}
    </DetailsSectionContainer>
  );
}
