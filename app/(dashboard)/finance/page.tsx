import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/widgets/KpiCard";
import { PnlTable } from "@/components/widgets/PnlTable";
import { CashFlowWaterfall } from "@/components/widgets/CashFlowWaterfall";
import { AgingTable } from "@/components/widgets/AgingTable";
import { MaterialsCostChart } from "@/components/widgets/MaterialsCostChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  CASH_FLOW,
  AR_AGING,
  AP_AGING,
  MATERIAL_INDEX,
  getGroupMonthlyPnl,
  getGroupYtdPnl,
} from "@/lib/mock/finance-data";
import { formatTwd, formatPercent } from "@/lib/utils";

export const metadata = { title: "財務" };

export default function FinancePage() {
  const monthlyPnl = getGroupMonthlyPnl();
  const ytd = getGroupYtdPnl();
  const closingCash = CASH_FLOW[CASH_FLOW.length - 1].amount;
  const openingCash = CASH_FLOW[0].amount;
  const cashDelta = closingCash - openingCash;

  const arTotal = AR_AGING.reduce((s, b) => s + b.amount, 0);
  const apTotal = AP_AGING.reduce((s, b) => s + b.amount, 0);

  // 5 月鋁料指數
  const lastMaterial = MATERIAL_INDEX[MATERIAL_INDEX.length - 1].values;
  const aluminumDelta = lastMaterial["鋁料"] - 100;

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
            value={formatTwd(closingCash)}
            hint={`較年初 ${cashDelta >= 0 ? "+" : ""}${formatTwd(cashDelta)}`}
            delta={`${cashDelta >= 0 ? "+" : ""}${formatPercent(cashDelta / openingCash, 1)} YTD`}
            trend={cashDelta >= 0 ? "up" : "down"}
            icon={Wallet}
          />
          <KpiCard
            label="鋁料價格指數"
            value={`${lastMaterial["鋁料"]}`}
            hint="2025/12 = 100，已 +40%"
            delta={`+${aluminumDelta}`}
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
                  自 1/1 期初 {formatTwd(openingCash)} 到 5/31 期末{" "}
                  {formatTwd(closingCash)}
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
            <CashFlowWaterfall data={CASH_FLOW} />
          </CardContent>
        </Card>

        {/* AR / AP Aging */}
        <section className="grid gap-6 lg:grid-cols-2">
          <AgingTable
            title={`應收帳款 Aging · 合計 ${formatTwd(arTotal)}`}
            buckets={AR_AGING}
            tone="receivable"
          />
          <AgingTable
            title={`應付帳款 Aging · 合計 ${formatTwd(apTotal)}`}
            buckets={AP_AGING}
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
            <MaterialsCostChart />
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
