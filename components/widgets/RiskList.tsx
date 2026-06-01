"use client";

import * as React from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RISK_ITEMS, RISK_CATEGORY_LABEL } from "@/lib/mock/risk-data";
import { BU_MAP } from "@/lib/mock/bu-data";
import type { RiskCategory, RiskItem } from "@/lib/types";

const SEVERITY_LABEL: Record<RiskItem["severity"], string> = {
  critical: "紅燈",
  high: "高",
  medium: "中",
  low: "低",
};

const SEVERITY_STYLE: Record<RiskItem["severity"], string> = {
  critical: "bg-danger/15 text-danger border-danger/30",
  high: "bg-warning/15 text-warning border-warning/30",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  low: "bg-muted text-muted-foreground border-border",
};

const FILTERS: Array<{ key: RiskCategory | "all"; label: string }> = [
  { key: "all", label: "全部" },
  { key: "people", label: "人事" },
  { key: "finance", label: "財務" },
  { key: "operation", label: "營運" },
  { key: "market", label: "市場" },
  { key: "compliance", label: "法遵" },
];

export function RiskList() {
  const [active, setActive] = React.useState<RiskCategory | "all">("all");

  // When the page is opened with a hash (e.g. /risk#r-03) — typically from the
  // risk matrix — reset to "all" so the target row is guaranteed visible, then
  // scroll it into view.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const target = RISK_ITEMS.find((r) => r.id === hash);
    if (!target) return;
    setActive("all");
    // Wait a tick for the (potentially un-filtered) item to render.
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  const filtered =
    active === "all"
      ? RISK_ITEMS
      : RISK_ITEMS.filter((r) => r.category === active);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === "all"
              ? RISK_ITEMS.length
              : RISK_ITEMS.filter((r) => r.category === f.key).length;
          const isActive = active === f.key;
          return (
            <Button
              key={f.key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(f.key)}
              className="gap-1.5"
            >
              {f.label}
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] tabular-nums",
                  isActive ? "bg-background/20" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            此分類目前無未解決風險。
          </li>
        )}
        {filtered.map((r) => {
          const buName =
            r.buId && r.buId !== "group" ? BU_MAP[r.buId]?.name : "集團";
          return (
            <li
              key={r.id}
              id={r.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-3">
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
                    SEVERITY_STYLE[r.severity],
                  )}
                >
                  {SEVERITY_LABEL[r.severity]} · {r.impact}×{r.probability}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-tight">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5">
                  {RISK_CATEGORY_LABEL[r.category]}
                </span>
                <span>· {buName}</span>
                {r.owner && (
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {r.owner}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  發現於 {format(new Date(r.createdAt), "M/d", { locale: zhTW })}
                </span>
                {r.dueAt && (
                  <span className="inline-flex items-center gap-1 text-warning">
                    <ArrowRight className="h-3 w-3" />
                    {format(new Date(r.dueAt), "M/d 前處理", { locale: zhTW })}
                  </span>
                )}
              </div>

              {r.action && (
                <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs">
                  <span className="font-semibold">建議行動：</span>
                  <span className="ml-1 text-muted-foreground">{r.action}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
