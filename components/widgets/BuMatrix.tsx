import Link from "next/link";
import { ArrowUpRight, Database, TimerOff } from "lucide-react";
import { formatTwd, formatPercent } from "@/lib/utils";
import { buColor } from "@/lib/ui/chart-colors";
import { stopLossClock, CHECKPOINTS } from "@/lib/actuals/xinyi-stoploss";
import { fetchPuyuPartial } from "@/lib/data";
import { SourceTag } from "./SourceTag";
import { RevenueProgressBar } from "./RevenueProgressBar";
import { StatusBadge } from "./StatusBadge";
import type { BusinessUnit, BuEntityInfo } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  interior: "室內設計",
  renovation: "輕裝修",
  marketing: "建案行銷",
  retail: "零售門市",
  ecommerce: "電商",
};

interface BuMatrixProps {
  bus: BusinessUnit[];
  entityMap: Record<string, BuEntityInfo>;
}

/**
 * T5 六大 BU 矩陣 — 依資料接入狀態誠實呈現：
 * live 正常卡｜monitor 止損深灰卡｜partial 部分接入｜none 未接入（保留目標）
 */
export function BuMatrix({ bus, entityMap }: BuMatrixProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bus.map((bu) => {
        const status = entityMap[bu.id]?.dataStatus ?? "none";
        switch (status) {
          case "live":
            return <LiveCard key={bu.id} bu={bu} />;
          case "monitor":
            return <MonitorCard key={bu.id} bu={bu} />;
          case "partial":
            return <PartialCard key={bu.id} bu={bu} />;
          default:
            return <NoneCard key={bu.id} bu={bu} />;
        }
      })}
    </div>
  );
}

/** 已接入真值 — 完整卡片 */
function LiveCard({ bu }: { bu: BusinessUnit }) {
  return (
    <Link
      href={`/bu/${bu.id}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
    >
      <span
        className="absolute left-0 top-0 h-full w-0.5 rounded-l-xl opacity-70"
        style={{ backgroundColor: buColor(bu.id) }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-tight">
              {bu.name}
            </h3>
            <StatusBadge level={bu.status} />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {CATEGORY_LABEL[bu.category]} ·{" "}
            {bu.ownership === "direct" ? "直營" : "子公司"}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="5 月簽約" value={formatTwd(bu.monthlyRevenue)} />
        <Metric label="YTD 簽約" value={formatTwd(bu.ytdRevenue)} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">年度目標進度</p>
          <SourceTag provenance="actual" scope="signed" tax="incl" />
        </div>
        <RevenueProgressBar current={bu.ytdRevenue} target={bu.annualTarget} />
      </div>

      {bu.note && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {bu.note}
        </p>
      )}
    </Link>
  );
}

/** T4 止損觀察 — 深灰卡 + 倒數 */
function MonitorCard({ bu }: { bu: BusinessUnit }) {
  const clock = stopLossClock(new Date());
  const next = clock.checkpoints.find((c) => c.daysLeft >= 0);
  return (
    <Link
      href={`/bu/${bu.id}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-stone-400/40 bg-stone-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-stone-600/60 dark:bg-stone-800/70"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-tight">
              {bu.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground/80 px-2.5 py-0.5 text-xs font-semibold text-background">
              <TimerOff className="h-3 w-3" />
              止損觀察中
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {CATEGORY_LABEL[bu.category]} · 2026-07-20 起
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric
          label="H1 簽約達成"
          value={formatPercent(bu.ytdRevenue / bu.annualTarget, 1)}
        />
        <Metric
          label={next ? `距檢核點 ${next.date.slice(5).replace("-", "/")}` : "檢核點"}
          value={next ? `${next.daysLeft} 天` : "已過"}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        雙檢核點 {CHECKPOINTS.map((c) => c.slice(5).replace("-", "/")).join("、")}
        ；三閾值未達即果斷止損。點入查看止損監控板。
      </p>
    </Link>
  );
}

/** 部分接入 — 已知真值 + 徽章 */
async function PartialCard({ bu }: { bu: BusinessUnit }) {
  const partial = await fetchPuyuPartial();
  return (
    <Link
      href={`/bu/${bu.id}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-tight">
              {bu.name}
            </h3>
            <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-medium text-warning">
              部分接入
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {CATEGORY_LABEL[bu.category]}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="年度目標" value={formatTwd(bu.annualTarget)} />
        <Metric
          label="已接入簽約"
          value={`${formatTwd(partial.knownTotal)}（${formatPercent(partial.ratio, 1)}）`}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        合約表僅 {partial.signings.length} 筆已接入（
        {partial.signings.map((x) => x.client).join("、")} · 2026-05）；
        其餘資料待交換表上線。
      </p>
    </Link>
  );
}

/** 未接入 — 灰卡、保留真實年度目標、不顯示任何假數字 */
function NoneCard({ bu }: { bu: BusinessUnit }) {
  return (
    <Link
      href={`/bu/${bu.id}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-tight">
              {bu.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Database className="h-3 w-3" />
              資料未接入
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {CATEGORY_LABEL[bu.category]} ·{" "}
            {bu.ownership === "direct" ? "直營" : "子公司"}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="年度目標" value={formatTwd(bu.annualTarget)} />
        <Metric label="YTD / 燈號" value="—" />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        待交換表（W2）填報後接入；接入前不顯示任何估計值。
      </p>
    </Link>
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
