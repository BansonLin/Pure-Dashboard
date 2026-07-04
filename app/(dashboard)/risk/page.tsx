import { AlertOctagon, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/widgets/KpiCard";
import { RiskMatrix } from "@/components/widgets/RiskMatrix";
import { RiskList } from "@/components/widgets/RiskList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getUnresolvedRisks, getRiskCounts } from "@/lib/mock/risk-data";
import { isOverdue } from "@/lib/report-date";

export const metadata = { title: "風險預警" };

export default function RiskPage() {
  const risks = getUnresolvedRisks();
  const counts = getRiskCounts();
  const highImpact = risks.filter((r) => r.impact >= 4).length;
  const overdue = risks.filter((r) => r.dueAt && isOverdue(r.dueAt)).length;

  return (
    <>
      <TopBar
        title="風險預警"
        description="影響度 × 機率矩陣 / 分類篩選 / 行動追蹤"
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="未解決風險"
            value={`${counts.total}`}
            hint={`紅燈 ${counts.critical} · 高 ${counts.high} · 中 ${counts.medium}`}
            icon={ShieldAlert}
            accent={counts.critical > 0 ? "danger" : "warning"}
          />
          <KpiCard
            label="紅燈"
            value={`${counts.critical}`}
            hint="需立即處理"
            icon={AlertOctagon}
            accent="danger"
          />
          <KpiCard
            label="高影響度"
            value={`${highImpact}`}
            hint="影響度 ≥ 4 / 5"
            icon={AlertTriangle}
            accent="warning"
          />
          <KpiCard
            label="已逾期"
            value={`${overdue}`}
            hint={overdue > 0 ? "處理期限已過" : "全部在期內"}
            icon={ShieldCheck}
            accent={overdue > 0 ? "danger" : "default"}
          />
        </section>

        {/* Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>風險矩陣</CardTitle>
            <CardDescription>
              影響度（縱）× 發生機率（橫），點擊圓點可定位到下方清單
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskMatrix risks={risks} />
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>風險清單</CardTitle>
            <CardDescription>
              可依分類篩選；每筆含嚴重度、影響/機率分數、負責人、發現日、處理期限與建議行動
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskList />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
