"use client";

type Props = {
  value?: string | null;
  emptyText?: string;
  className?: string;
};

export default function DetailsTextContent({
  value,
  emptyText = "-",
  className = "max-h-80 overflow-y-auto whitespace-pre-wrap wrap-break-word text-md font-medium leading-relaxed text-secondary-normal",
}: Props) {
  return <div className={className}>{value || emptyText}</div>;
}
