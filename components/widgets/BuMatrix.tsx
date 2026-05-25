import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BUSINESS_UNITS } from "@/lib/mock/bu-data";
import { formatTwd } from "@/lib/utils";
import { RevenueProgressBar } from "./RevenueProgressBar";
import { StatusBadge } from "./StatusBadge";

const CATEGORY_LABEL: Record<string, string> = {
  interior: "室內設計",
  renovation: "輕裝修",
  marketing: "建案行銷",
  retail: "零售門市",
  ecommerce: "電商",
};

export function BuMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BUSINESS_UNITS.map((bu) => {
        return (
          <Link
            key={bu.id}
            href={`/bu/${bu.id}`}
            className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
          >
            <span
              className="absolute left-0 top-0 h-full w-0.5 rounded-l-xl opacity-70"
              style={{ backgroundColor: bu.accentHex }}
            />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-semibold leading-tight">
                    {bu.name}
                  </h3>
                  <StatusBadge level={bu.status} pulse={bu.status !== "green"} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {CATEGORY_LABEL[bu.category]} · {bu.ownership === "direct" ? "直營" : "子公司"}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Metric label="當月營收" value={formatTwd(bu.monthlyRevenue)} />
              <Metric label="進行中專案" value={`${bu.activeProjects}`} />
              <Metric label="編制" value={`${bu.headcount} 人`} />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">年度目標進度</p>
              <RevenueProgressBar
                current={bu.ytdRevenue}
                target={bu.annualTarget}
              />
            </div>

            {bu.note && (
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {bu.note}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
