import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/ui/severity";
import type { StatusLevel } from "@/lib/types";

interface StatusBadgeProps {
  level: StatusLevel;
  label?: string;
  className?: string;
  /** Show pulsing dot for red/amber */
  pulse?: boolean;
}

export function StatusBadge({ level, label, className, pulse = false }: StatusBadgeProps) {
  const s = STATUS_META[level];
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
