import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTopActions } from "@/lib/mock/risk-data";
import { BU_MAP } from "@/lib/mock/bu-data";
import { SEVERITY_META } from "@/lib/ui/severity";
import { formatMonthDay } from "@/lib/report-date";
import type { ActionItem } from "@/lib/types";

interface ActionListProps {
  /** 自訂行動清單；未提供時取全公司 Top N */
  actions?: ActionItem[];
  limit?: number;
}

export function ActionList({ actions, limit = 5 }: ActionListProps) {
  const items = actions ?? getTopActions(limit);
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        目前無待處理項目。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((a, idx) => {
        const s = SEVERITY_META[a.severity];
        const buLabel =
          a.buId && a.buId !== "group" ? BU_MAP[a.buId]?.name : "集團";
        return (
          <li key={a.id}>
            <Link
              href={`/risk#${a.id}`}
              className="group -mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-accent/40"
            >
              <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 self-start rounded-full",
                  s.dot,
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  <span className={s.text}>{s.label}</span> · {buLabel}
                  {a.owner ? ` · ${a.owner}` : ""}
                  {a.dueAt ? ` · ${formatMonthDay(a.dueAt)} 前` : ""}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
