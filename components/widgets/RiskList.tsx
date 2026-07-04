"use client";

import * as React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUnresolvedRisks, RISK_CATEGORY_LABEL } from "@/lib/mock/risk-data";
import { BU_MAP } from "@/lib/mock/bu-data";
import { SEVERITY_META } from "@/lib/ui/severity";
import { formatMonthDay } from "@/lib/report-date";
import type { RiskCategory } from "@/lib/types";

const FILTERS: Array<{ key: RiskCategory | "all"; label: string }> = [
  { key: "all", label: "全部" },
  { key: "people", label: "人事" },
  { key: "finance", label: "財務" },
  { key: "operation", label: "營運" },
  { key: "market", label: "市場" },
  { key: "compliance", label: "法遵" },
];

export function RiskList() {
  const risks = getUnresolvedRisks();
  const [active, setActive] = React.useState<RiskCategory | "all">("all");

  // 從風險矩陣圓點（/risk#r-xx）進來時：不論是初次載入還是同頁 hash 變更，
  // 都重置篩選為「全部」讓目標項目一定在 DOM，再捲動定位。
  React.useEffect(() => {
    const locate = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || !risks.some((r) => r.id === hash)) return;
      setActive("all");
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    };
    locate();
    window.addEventListener("hashchange", locate);
    return () => window.removeEventListener("hashchange", locate);
    // risks 來自 mock、每次 render 內容相同，僅在 mount 綁定即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    active === "all" ? risks : risks.filter((r) => r.category === active);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === "all"
              ? risks.length
              : risks.filter((r) => r.category === f.key).length;
          const isActive = active === f.key;
          return (
            <Button
              key={f.key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(f.key)}
              className="gap-1.5"
              aria-pressed={isActive}
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
          const s = SEVERITY_META[r.severity];
          const buName =
            r.buId && r.buId !== "group" ? BU_MAP[r.buId]?.name : "集團";
          return (
            <li
              key={r.id}
              id={r.id}
              className="group scroll-mt-24 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-3">
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
                    s.badge,
                  )}
                >
                  {s.label} · {r.impact}×{r.probability}
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
                  發現於 {formatMonthDay(r.createdAt)}
                </span>
                {r.dueAt && (
                  <span className="inline-flex items-center gap-1 text-warning">
                    <ArrowRight className="h-3 w-3" />
                    {formatMonthDay(r.dueAt)} 前處理
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
