import Link from "next/link";
import { Activity, Building2, Target, AlertOctagon, Wallet } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AlertBanner } from "@/components/widgets/AlertBanner";
import { KpiCard } from "@/components/widgets/KpiCard";
import { BuMatrix } from "@/components/widgets/BuMatrix";
import { RevenueTrendChart } from "@/components/widgets/RevenueTrendChart";
import { RevenueProgressBar } from "@/components/widgets/RevenueProgressBar";
import { ActionList } from "@/components/widgets/ActionList";
import { SourceTag } from "@/components/widgets/SourceTag";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
  fetchBusinessUnits,
  fetchEntityMap,
  fetchRiskCounts,
  fetchTopActions,
  fetchXinyiH1,
  fetchYilanCash,
  fetchYilanSignings,
} from "@/lib/data";
import { formatTwd, formatPercent } from "@/lib/utils";

// 信義止損倒數需要「今天」，故本頁改為動態渲染（T4）
export const dynamic = "force-dynamic";

/** 簽約類別的圖表用色 */
const CATEGORY_SERIES = [
  { key: "工程", name: "工程", color: "#0d9488" },
  { key: "設計", name: "設計", color: "#6366f1" },
  { key: "提案", name: "提案", color: "#d97706" },
];

export default async function GroupOverviewPage() {
  const [bus, entityMap, yilan, xinyi, cash, riskCounts, topActions] =
    await Promise.all([
      fetchBusinessUnits(),
      fetchEntityMap(),
      fetchYilanSignings(),
      fetchXinyiH1(),
      fetchYilanCash(),
      fetchRiskCounts(),
      fetchTopActions(5),
    ]);

  const chartData = yilan.months.map((m) => ({
    label: m.label,
    工程: m.工程,
    設計: m.設計,
    提案: m.提案,
  }));

  return (
    <>
      <TopBar
        title="集團總覽"
        description="璞石集團 PURE GROUP · 2026 數據打底年"
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <AlertBanner
          criticalCount={riskCounts.critical}
          highCount={riskCounts.high}
        />

        {/* KPI Row — T3 校準後：只呈現已接入真值的指標 */}
        <section
          aria-label="核心 KPI"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <KpiCard
            label="宜蘭 YTD 簽約"
            value={formatTwd(yilan.ytdIncl)}
            hint={`未稅約 ${formatTwd(yilan.ytdExcl)}`}
            icon={Activity}
            accent="success"
          >
            <SourceTag provenance="actual" scope="signed" tax="incl" asOf={yilan.asOf} />
          </KpiCard>
          <KpiCard
            label="宜蘭年度達成"
            value={formatPercent(yilan.achieveIncl, 1)}
            hint={`vs ${formatTwd(yilan.target)} 目標（稅基待確認，同口徑計）`}
            icon={Target}
            accent="success"
          >
            <RevenueProgressBar
              current={yilan.ytdIncl}
              target={yilan.target}
              showLabel={false}
              barClassName="bg-success"
            />
          </KpiCard>
          <KpiCard
            label={`宜蘭 ${yilan.lastFullMonth.label}簽約`}
            value={formatTwd(yilan.lastFullMonth.total)}
            hint="最近完整月"
            delta={`${yilan.momRatio >= 0 ? "+" : ""}${(yilan.momRatio * 100).toFixed(0)}% MoM`}
            trend={yilan.momRatio >= 0 ? "up" : "down"}
            icon={Activity}
          >
            <SourceTag provenance="actual" scope="signed" tax="incl" asOf={yilan.asOf} />
          </KpiCard>
          <KpiCard
            label="宜蘭法人現金水位"
            value={formatTwd(cash.total)}
            hint={cash.entityLabel}
            icon={Wallet}
          >
            <SourceTag provenance="actual" scope="collected" asOf={cash.asOf} />
          </KpiCard>
          <Link href="/bu/design-xinyi" className="contents">
            <KpiCard
              label="信義止損觀察"
              value={formatPercent(xinyi.ratio, 1)}
              hint={`H1 簽約 ${formatTwd(xinyi.signedIncl)} / ${formatTwd(xinyi.target)}`}
              icon={AlertOctagon}
              accent="danger"
            >
              <SourceTag provenance="actual" scope="signed" tax="incl" asOf={xinyi.asOf} />
            </KpiCard>
          </Link>
        </section>

        {/* BU Matrix */}
        <section aria-label="六大事業體" className="space-y-3">
          <SectionHeader
            icon={Building2}
            title="六大事業體"
            description="僅宜蘭已接入真值；其餘依接入狀態誠實標示"
          />
          <BuMatrix bus={bus} entityMap={entityMap} />
        </section>

        {/* Trend + Actions */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>宜蘭月度簽約趨勢</CardTitle>
                  <CardDescription>
                    2026 年 1–6 月，依提案 / 設計 / 工程分類（6 月僅計至 6/1）
                  </CardDescription>
                </div>
                <SourceTag provenance="actual" scope="signed" tax="incl" asOf={yilan.asOf} />
              </div>
            </CardHeader>
            <CardContent>
              <RevenueTrendChart
                data={chartData}
                series={CATEGORY_SERIES}
                ariaLabel="宜蘭 2026 年 1 至 6 月簽約金額，依提案、設計、工程分類堆疊"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>本週行動 Top 5</CardTitle>
              <CardDescription>依風險嚴重度排序（評分為示意）</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionList actions={topActions} />
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>
      {description && (
        <p className="hidden text-xs text-muted-foreground sm:block">
          {description}
        </p>
      )}
    </div>
  );
}
