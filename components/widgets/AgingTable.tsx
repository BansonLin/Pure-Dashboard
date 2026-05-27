import { cn, formatTwd, formatPercent } from "@/lib/utils";
import type { AgingBucket } from "@/lib/types";

interface AgingTableProps {
  title: string;
  buckets: AgingBucket[];
}

const LEVEL_BAR: Record<AgingBucket["level"], string> = {
  green: "bg-success",
  amber: "bg-warning",
  red: "bg-danger",
};

const LEVEL_TEXT: Record<AgingBucket["level"], string> = {
  green: "text-muted-foreground",
  amber: "text-warning",
  red: "text-danger",
};

export function AgingTable({ title, buckets }: AgingTableProps) {
  const total = buckets.reduce((s, b) => s + b.amount, 0);
  const overdue = buckets
    .filter((b) => b.level !== "green")
    .reduce((s, b) => s + b.amount, 0);
  const overdueRatio = total > 0 ? overdue / total : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          合計 {formatTwd(total)}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {buckets.map((b) => {
          const ratio = total > 0 ? b.amount / total : 0;
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs">
                <span className={cn("font-medium", LEVEL_TEXT[b.level])}>
                  {b.label}
                </span>
                <span className="tabular-nums">
                  {formatTwd(b.amount)}{" "}
                  <span className="text-muted-foreground">
                    ({formatPercent(ratio, 0)})
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", LEVEL_BAR[b.level])}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">逾期比例</span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            overdueRatio > 0.1
              ? "text-danger"
              : overdueRatio > 0.05
                ? "text-warning"
                : "text-success",
          )}
        >
          {formatPercent(overdueRatio, 1)} · {formatTwd(overdue)}
        </span>
      </div>
    </div>
  );
}
