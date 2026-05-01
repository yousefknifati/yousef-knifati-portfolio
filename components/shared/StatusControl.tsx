"use client";

type Props = {
  isActive: boolean;
  isPending?: boolean;
  onToggle: (checked: boolean) => void;
  inputId?: string;
  activeText?: string;
  inactiveText?: string;
  className?: string;
};

export default function StatusControl({
  isActive,
  isPending = false,
  onToggle,
  inputId = "status-control-toggle",
  activeText = "This opportunity is active on system",
  inactiveText = "This opportunity is not active on system",
  className = "flex gap-4 items-center justify-center",
}: Props) {
  return (
    <div className={className}>
      <div className="toggle-switch light">
        <input
          className="toggle-input"
          id={inputId}
          type="checkbox"
          checked={isActive}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={isPending}
        />
        <label className="toggle-label" htmlFor={inputId} />
      </div>

      {isActive ? (
        <div className="flex items-center justify-center gap-2">
          <p className="hidden lg:block text-sm italic text-dashboard-input-placeholder">{activeText}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-success-normal" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p className="hidden lg:block text-sm italic text-dashboard-input-placeholder">{inactiveText}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-normal" />
        </div>
      )}
    </div>
  );
}
