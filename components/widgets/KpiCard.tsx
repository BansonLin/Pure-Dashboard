import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  /** 副資訊：例如 "vs 8,000 萬" 或 "本月" */
  hint?: string;
  /** 變動文字，例如 "+12% MoM"；正負透過 trend 控色 */
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: LucideIcon;
  /** 額外內容（如進度條） */
  children?: React.ReactNode;
  className?: string;
  accent?: "default" | "warning" | "danger" | "success";
}

const ACCENT_STRIP: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: "bg-foreground/80",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function KpiCard({
  label,
  value,
  hint,
  delta,
  trend = "flat",
  icon: Icon,
  children,
  className,
  accent = "default",
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
      ? "text-danger"
      : "text-muted-foreground";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-0 h-full w-0.5 opacity-70",
          ACCENT_STRIP[accent],
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground/5 group-hover:text-foreground">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        {delta && (
          <span className={cn("text-xs font-medium tabular-nums", trendColor)}>
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
