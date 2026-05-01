import { cn } from "@/lib/utils/cn";

export function InlineCheck({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-start gap-3 text-left"
      >
        <span
          className={cn(
            "mt-0.5 h-4 w-4 rounded-xs border flex items-center justify-center",
            checked
              ? "bg-primary-normal border-primary-normal"
              : "bg-white border-secondary-light-hover"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-[2px] bg-white transition-opacity",
              checked ? "opacity-100" : "opacity-0"
            )}
          />
        </span>

        <span className="text-xs text-secondary-300 leading-5">{children}</span>
      </button>

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}   