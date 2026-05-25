import { cn } from "@/lib/utils";
import type { StatusLevel } from "@/lib/types";

interface StatusBadgeProps {
  level: StatusLevel;
  label?: string;
  className?: string;
  /** Show pulsing dot for red/amber */
  pulse?: boolean;
}

const STATUS_MAP: Record<
  StatusLevel,
  { dot: string; bg: string; text: string; label: string }
> = {
  green: {
    dot: "bg-success",
    bg: "bg-success/10",
    text: "text-success",
    label: "正常",
  },
  amber: {
    dot: "bg-warning",
    bg: "bg-warning/10",
    text: "text-warning",
    label: "注意",
  },
  red: {
    dot: "bg-danger",
    bg: "bg-danger/10",
    text: "text-danger",
    label: "警示",
  },
};

export function StatusBadge({ level, label, className, pulse = false }: StatusBadgeProps) {
  const s = STATUS_MAP[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.bg,
        s.text,
        className,
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        {pulse && level !== "green" && (
          <span
            className={cn(
              "absolute inset-0 inline-flex animate-ping rounded-full opacity-60",
              s.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", s.dot)} />
      </span>
      {label ?? s.label}
    </span>
  );
}
