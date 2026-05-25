import { cn, formatTwd, formatPercent } from "@/lib/utils";

interface RevenueProgressBarProps {
  current: number;
  target: number;
  /** Optional tailwind colour class for bar fill */
  barClassName?: string;
  /** 顯示 "目前 / 目標 (xx%)" 文字 */
  showLabel?: boolean;
  className?: string;
}

export function RevenueProgressBar({
  current,
  target,
  barClassName,
  showLabel = true,
  className,
}: RevenueProgressBarProps) {
  const ratio = target > 0 ? Math.min(current / target, 1) : 0;
  const pct = ratio * 100;
  const status =
    ratio >= 0.45 ? "bg-success" : ratio >= 0.3 ? "bg-warning" : "bg-danger";

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">
            {formatTwd(current)} <span className="opacity-60">/ {formatTwd(target)}</span>
          </span>
          <span className="font-medium tabular-nums">{formatPercent(ratio)}</span>
        </div>
      )}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            barClassName ?? status,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
