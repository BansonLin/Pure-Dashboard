import { Calendar, User } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { cn, formatTwd, formatPercent } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        此事業體目前無進行中專案。
      </div>
    );
  }

  // Reference today for delta calculation (matches TopBar mock today)
  const today = new Date("2026-05-25T09:00:00+08:00");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((p) => {
        const due = new Date(p.dueAt);
        const daysLeft = differenceInDays(due, today);
        const dueColor =
          daysLeft < 0
            ? "text-danger"
            : daysLeft < 14
              ? "text-warning"
              : "text-muted-foreground";
        const progressColor =
          p.status === "red"
            ? "bg-danger"
            : p.status === "amber"
              ? "bg-warning"
              : "bg-success";

        return (
          <div
            key={p.id}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold leading-tight">
                  {p.name}
                </h4>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {p.client}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium",
                  p.grossMargin >= 0.38
                    ? "bg-success/15 text-success"
                    : p.grossMargin >= 0.32
                      ? "bg-warning/15 text-warning"
                      : "bg-danger/15 text-danger",
                )}
              >
                毛利 {formatPercent(p.grossMargin, 0)}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>進度</span>
                <span className="font-medium tabular-nums">{p.progress}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    progressColor,
                  )}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {p.owner}
              </span>
              <span className={cn("inline-flex items-center gap-1", dueColor)}>
                <Calendar className="h-3 w-3" />
                {format(due, "M/d", { locale: zhTW })}
                {daysLeft >= 0
                  ? ` · 剩 ${daysLeft} 天`
                  : ` · 已逾期 ${-daysLeft} 天`}
              </span>
              <span className="ml-auto font-medium tabular-nums text-foreground">
                {formatTwd(p.contractAmount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
