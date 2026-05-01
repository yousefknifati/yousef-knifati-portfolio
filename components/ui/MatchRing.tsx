import { cn } from "@/lib/utils/cn";

type MatchRingProps = {
  value?: number | null;
  className?: string;
};

export default function MatchRing({
  value,
  className,
}: MatchRingProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value ?? 0)));
  const radius = 19;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeValue / 100);

  return (
    <div
      className={cn("relative inline-flex h-12 w-12 items-center justify-center", className)}
      role="img"
      aria-label={`Contract match ${safeValue}%`}
    >
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="var(--color-primary-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="var(--color-primary-normal)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute text-center text-[12px] leading-6 font-bold text-primary-normal">
        {safeValue}%
      </span>
    </div>
  );
}
