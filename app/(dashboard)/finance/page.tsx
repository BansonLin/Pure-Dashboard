import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/widgets/KpiCard";
import { PnlTable } from "@/components/widgets/PnlTable";
import { CashFlowWaterfall } from "@/components/widgets/CashFlowWaterfall";
import { AgingTable } from "@/components/widgets/AgingTable";
import { MaterialsCostChart } from "@/components/widgets/MaterialsCostChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  fetchApAging,
  fetchArAging,
  fetchCashFlow,
  fetchGroupMonthlyPnl,
  fetchGroupYtdPnl,
  fetchMaterialIndex,
} from "@/lib/data";
import { formatTwd, formatPercent } from "@/lib/utils";

export const metadata = { title: "財務" };

export default async function FinancePage() {
  const [monthlyPnl, ytd, cashFlow, arAging, apAging, materials] =
    await Promise.all([
      fetchGroupMonthlyPnl(),
      fetchGroupYtdPnl(),
      fetchCashFlow(),
      fetchArAging(),
      fetchApAging(),
      fetchMaterialIndex(),
    ]);

  const cashDelta = cashFlow.closing - cashFlow.opening;
  const arTotal = arAging.reduce((s, b) => s + b.amount, 0);
  const apTotal = apAging.reduce((s, b) => s + b.amount, 0);
  const aluminumIndex = materials.latest["鋁料"];

  return (
    <>
      <TopBar
        title="財務"
        description="集團合併損益 / 現金流 / 應收應付 / 原物料"
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="YTD 營業收入"
            value={formatTwd(ytd.revenue)}
            hint="六大 BU 合計"
            icon={Activity}
          />
          <KpiCard
            label="YTD 淨利"
            value={formatTwd(ytd.netIncome)}
            hint={`淨利率 ${formatPercent(ytd.netMargin, 1)}`}
            icon={ytd.netIncome >= 0 ? TrendingUp : TrendingDown}
            trend={ytd.netIncome >= 0 ? "up" : "down"}
            accent={ytd.netMargin >= 0.1 ? "success" : "warning"}
          />
          <KpiCard
            label="期末現金部位"
            value={formatTwd(cashFlow.closing)}
            hint={`較年初 ${cashDelta >= 0 ? "+" : ""}${formatTwd(cashDelta)}`}
            delta={`${cashDelta >= 0 ? "+" : ""}${formatPercent(cashDelta / cashFlow.opening, 1)} YTD`}
            trend={cashDelta >= 0 ? "up" : "down"}
            icon={Wallet}
          />
          <KpiCard
            label="鋁料價格指數"
            value={`${aluminumIndex}`}
            hint={`2025/12 = 100，已 +${aluminumIndex - 100}%`}
            delta={`+${aluminumIndex - 100}`}
            trend="up"
            icon={TrendingUp}
            accent="danger"
          />
        </section>

        {/* 合併損益 */}
        <Card>
          <CardHeader>
            <CardTitle>集團合併損益</CardTitle>
            <CardDescription>
              六大 BU 加總，2026 年 1–5 月，單位：新台幣
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PnlTable rows={monthlyPnl} />
          </CardContent>
        </Card>

        {/* 現金流瀑布 */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <CardTitle>YTD 現金流瀑布</CardTitle>
                <CardDescription>
                  自 1/1 期初 {formatTwd(cashFlow.opening)} 到 5/31 期末{" "}
                  {formatTwd(cashFlow.closing)}
                </CardDescription>
              </div>
              <div className="flex gap-4 text-xs">
                <Pill color="success" label="流入" />
                <Pill color="danger" label="流出" />
                <Pill color="foreground" label="餘額" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CashFlowWaterfall data={cashFlow.nodes} />
          </CardContent>
        </Card>

        {/* AR / AP Aging */}
        <section className="grid gap-6 lg:grid-cols-2">
          <AgingTable
            title={`應收帳款 Aging · 合計 ${formatTwd(arTotal)}`}
            buckets={arAging}
            tone="receivable"
          />
          <AgingTable
            title={`應付帳款 Aging · 合計 ${formatTwd(apTotal)}`}
            buckets={apAging}
            tone="payable"
          />
        </section>

        {/* 原物料 */}
        <Card>
          <CardHeader>
            <CardTitle>原物料成本指數</CardTitle>
            <CardDescription>
              2025/12 = 100；鋁料已 +40%、板材 +38%、系統櫃 +34%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialsCostChart points={materials.points} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Pill({
  color,
  label,
}: {
  color: "success" | "danger" | "foreground";
  label: string;
}) {
  const map = {
    success: "bg-success",
    danger: "bg-danger",
    foreground: "bg-foreground",
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${map[color]}`} />
      {label}
    </span>
  );
}
