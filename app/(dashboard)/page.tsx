import { Activity, Building2, Target, AlertOctagon, Briefcase } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AlertBanner } from "@/components/widgets/AlertBanner";
import { KpiCard } from "@/components/widgets/KpiCard";
import { BuMatrix } from "@/components/widgets/BuMatrix";
import { RevenueTrendChart } from "@/components/widgets/RevenueTrendChart";
import { RevenueProgressBar } from "@/components/widgets/RevenueProgressBar";
import { ActionList } from "@/components/widgets/ActionList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { BUSINESS_UNITS, getBu } from "@/lib/mock/bu-data";
import { getGroupMonthlyRevenue, MONTHLY_REVENUE } from "@/lib/mock/revenue-data";
import { getRiskCounts } from "@/lib/mock/risk-data";
import { formatTwd, formatPercent } from "@/lib/utils";

export default function GroupOverviewPage() {
  const groupMonthly = getGroupMonthlyRevenue();
  const yilan = getBu("design-yilan")!;
  const xinyi = getBu("design-xinyi")!;
  const riskCounts = getRiskCounts();

  const totalActiveProjects = BUSINESS_UNITS.reduce(
    (s, b) => s + b.activeProjects,
    0,
  );

  const prevMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];
  const momPrev = Object.values(prevMonth.values).reduce((s, v) => s + v, 0);
  const momPct = momPrev > 0 ? ((groupMonthly - momPrev) / momPrev) * 100 : 0;

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

        {/* KPI Row */}
        <section
          aria-label="核心 KPI"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <KpiCard
            label="集團當月營收"
            value={formatTwd(groupMonthly)}
            hint="2026 年 5 月"
            delta={`${momPct >= 0 ? "+" : ""}${momPct.toFixed(1)}% MoM`}
            trend={momPct >= 0 ? "up" : "down"}
            icon={Activity}
          />
          <KpiCard
            label="宜蘭年度進度"
            value={formatPercent(yilan.ytdRevenue / yilan.annualTarget, 1)}
            hint={`vs ${formatTwd(yilan.annualTarget)} 目標`}
            icon={Target}
            accent="warning"
          >
            <RevenueProgressBar
              current={yilan.ytdRevenue}
              target={yilan.annualTarget}
              showLabel={false}
              barClassName="bg-warning"
            />
          </KpiCard>
          <KpiCard
            label="信義年度進度"
            value={formatPercent(xinyi.ytdRevenue / xinyi.annualTarget, 1)}
            hint={`vs ${formatTwd(xinyi.annualTarget)} 目標`}
            icon={Target}
            accent="danger"
          >
            <RevenueProgressBar
              current={xinyi.ytdRevenue}
              target={xinyi.annualTarget}
              showLabel={false}
              barClassName="bg-danger"
            />
          </KpiCard>
          <KpiCard
            label="進行中專案"
            value={`${totalActiveProjects}`}
            hint="六大事業體合計"
            icon={Briefcase}
          />
          <KpiCard
            label="風險數"
            value={`${riskCounts.total}`}
            hint={`紅燈 ${riskCounts.critical} · 高 ${riskCounts.high} · 中 ${riskCounts.medium}`}
            icon={AlertOctagon}
            accent={riskCounts.critical > 0 ? "danger" : "warning"}
          />
        </section>

        {/* BU Matrix */}
        <section aria-label="六大事業體" className="space-y-3">
          <SectionHeader
            icon={Building2}
            title="六大事業體"
            description="點擊卡片可進入該事業體詳情頁"
          />
          <BuMatrix />
        </section>

        {/* Trend + Actions */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>月度營收趨勢</CardTitle>
                  <CardDescription>
                    2026 年 1–5 月，依事業體堆疊
                  </CardDescription>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  單位：新台幣
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueTrendChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>本週行動 Top 5</CardTitle>
              <CardDescription>依風險嚴重度排序</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionList limit={5} />
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
