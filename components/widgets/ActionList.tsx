import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTopActions } from "@/lib/mock/risk-data";
import { BU_MAP } from "@/lib/mock/bu-data";
import type { RiskSeverity } from "@/lib/types";

const SEVERITY_STYLE: Record<RiskSeverity, { dot: string; label: string; text: string }> = {
  critical: { dot: "bg-danger", label: "紅燈", text: "text-danger" },
  high: { dot: "bg-warning", label: "高", text: "text-warning" },
  medium: { dot: "bg-amber-500", label: "中", text: "text-amber-500" },
  low: { dot: "bg-muted-foreground", label: "低", text: "text-muted-foreground" },
};

export function ActionList({ limit = 5 }: { limit?: number }) {
  const actions = getTopActions(limit);

  return (
    <ul className="divide-y divide-border">
      {actions.map((a, idx) => {
        const s = SEVERITY_STYLE[a.severity];
        const buLabel =
          a.buId && a.buId !== "group" ? BU_MAP[a.buId]?.name : "集團";
        return (
          <li
            key={a.id}
            className="group flex items-center gap-4 py-3 transition-colors hover:bg-accent/40 -mx-2 px-2 rounded-md cursor-pointer"
          >
            <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full self-start",
                s.dot,
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{a.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <span className={s.text}>{s.label}</span> · {buLabel}
                {a.owner ? ` · ${a.owner}` : ""}
                {a.dueAt
                  ? ` · ${format(new Date(a.dueAt), "M/d 前", { locale: zhTW })}`
                  : ""}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </li>
        );
      })}
    </ul>
  );
}
