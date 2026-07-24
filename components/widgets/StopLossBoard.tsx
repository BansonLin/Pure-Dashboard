import { AlertOctagon, Flame, Hourglass, PiggyBank, TrendingDown } from "lucide-react";
import { cn, formatTwd, formatPercent } from "@/lib/utils";
import {
  DECISION_RULE,
  MONTHLY_BURN_VERBAL,
  OBSERVATION_START,
  SUNK_COST,
  THRESHOLDS,
  stopLossClock,
} from "@/lib/actuals/xinyi-stoploss";
import { SourceTag } from "./SourceTag";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StopLossBoardProps {
  /** 伺服器當下時間（頁面為 force-dynamic，每次請求即時） */
  now: Date;
  h1: { signedIncl: number; target: number; ratio: number; asOf: string };
}

/**
 * T4 信義止損監控板 — 2026-07-20 定調會決議。
 * 觀察期倒數、燒錢累計、沉沒成本、H1 業績、三閾值檢核、決策規則。
 */
export function StopLossBoard({ now, h1 }: StopLossBoardProps) {
  const clock = stopLossClock(now);

  return (
    <div className="space-y-6">
      {/* 決策規則 — 放最上面，所有人先看到遊戲規則 */}
      <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 px-5 py-4">
        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
        <div>
          <p className="text-sm font-semibold text-danger">決策規則</p>
          <p className="mt-1 text-sm leading-relaxed">{DECISION_RULE}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            觀察期自 {OBSERVATION_START.replaceAll("-", "/")} 起算 · 主導：Banson
          </p>
        </div>
      </div>

      {/* 四張核心卡 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 觀察期倒數 */}
        <BoardCard
          icon={Hourglass}
          label="觀察期倒數"
          tone="neutral"
        >
          <div className="space-y-2">
            {clock.checkpoints.map((c, i) => (
              <div key={c.date} className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">
                  檢核點 {i + 1} · {c.date.slice(5).replace("-", "/")}
                </span>
                <span
                  className={cn(
                    "text-lg font-semibold tabular-nums",
                    c.daysLeft <= 7 && c.daysLeft >= 0 && "text-warning",
                    c.daysLeft < 0 && "text-muted-foreground line-through",
                  )}
                >
                  {c.daysLeft >= 0 ? `${c.daysLeft} 天` : "已過"}
                </span>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground">
              觀察已進行 {clock.daysElapsed} 天
            </p>
          </div>
        </BoardCard>

        {/* 燒錢卡 */}
        <BoardCard icon={Flame} label="現金消耗" tone="danger">
          <p className="text-2xl font-semibold tabular-nums text-danger">
            {formatTwd(clock.accumulatedBurn)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            自 7/20 起累計（月燒 {formatTwd(MONTHLY_BURN_VERBAL)} 日割推算）
          </p>
          <SourceTag provenance="verbal" className="mt-2" />
        </BoardCard>

        {/* 沉沒成本卡 */}
        <BoardCard icon={PiggyBank} label="沉沒成本" tone="neutral">
          {SUNK_COST === null ? (
            <>
              <p className="text-2xl font-semibold text-muted-foreground">
                盤點中
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                千萬級（定調會口述）；精確數字待 Patty 提供
              </p>
              <SourceTag provenance="verbal" className="mt-2" />
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold tabular-nums">
                {formatTwd(SUNK_COST)}
              </p>
              <SourceTag provenance="verbal" className="mt-2" />
            </>
          )}
        </BoardCard>

        {/* H1 業績卡 */}
        <BoardCard icon={TrendingDown} label="H1 簽約達成" tone="danger">
          <p className="text-2xl font-semibold tabular-nums text-danger">
            {formatPercent(h1.ratio, 1)}
          </p>
          <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
            {formatTwd(h1.signedIncl)} / {formatTwd(h1.target)}
          </p>
          <SourceTag
            provenance="actual"
            scope="signed"
            tax="incl"
            asOf={h1.asOf}
            className="mt-2"
          />
        </BoardCard>
      </section>

      {/* 三閾值檢核表 */}
      <Card>
        <CardHeader>
          <CardTitle>三閾值檢核</CardTitle>
          <CardDescription>
            判定線為【示意】、由 Banson 校準後改；狀態手動維護，每檢核點更新
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4 text-left font-medium">閾值</th>
                  <th className="py-2 pr-4 text-left font-medium">判定線（示意）</th>
                  <th className="py-2 text-left font-medium">目前狀態</th>
                </tr>
              </thead>
              <tbody>
                {THRESHOLDS.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 font-medium">{t.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{t.line}</td>
                    <td className="py-3">
                      {t.status === "pass" && (
                        <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                          達標
                        </span>
                      )}
                      {t.status === "fail" && (
                        <span className="rounded-md bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger">
                          未達
                        </span>
                      )}
                      {t.status === "pending" && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          待檢核
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BoardCard({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: "neutral" | "danger";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5",
        tone === "danger" ? "border-danger/30" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "danger" ? "text-danger" : "text-muted-foreground",
          )}
        />
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}
