import { Users, AlertOctagon, UserCheck, GitBranch } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/widgets/KpiCard";
import { OrgChart } from "@/components/widgets/OrgChart";
import { PeopleTable } from "@/components/widgets/PeopleTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ORG_STRUCTURE,
  getTotalHeadcount,
  getAtRiskPeople,
  getGmSpanOfControl,
} from "@/lib/mock/org-data";

export const metadata = { title: "人力組織" };

export default function PeoplePage() {
  const headcount = getTotalHeadcount();
  const atRisk = getAtRiskPeople();
  const span = getGmSpanOfControl();

  const vacantSeats = ORG_STRUCTURE.departments.reduce(
    (s, d) => s + Math.max(0, d.headcountTarget - d.headcountActual),
    0,
  );
  const actingCount = atRisk.filter((p) => p.status === "acting").length;
  const crossCount = atRisk.filter((p) => p.status === "cross-functional").length;

  return (
    <>
      <TopBar
        title="人力組織"
        description="組織架構 / 暫代 / 跨部門兼職 / 管理幅度警示"
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {span.warning && (
          <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 text-danger">
            <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">
                管理幅度警示：總經理 {ORG_STRUCTURE.gm.name} 直管 {span.span}{" "}
                個部門，超出建議上限 {span.threshold}
              </p>
              <p className="mt-0.5 text-xs opacity-80">
                建議拆出「行銷企劃部」與「行政財會部」由獨立 COO 統籌，或設立部門長層級。
              </p>
            </div>
          </div>
        )}

        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="實際 / 編制"
            value={`${headcount.actual} / ${headcount.target}`}
            hint={`缺額 ${vacantSeats} 個`}
            icon={Users}
            accent={vacantSeats > 3 ? "danger" : vacantSeats > 0 ? "warning" : "success"}
          />
          <KpiCard
            label="暫代未轉正"
            value={`${actingCount}`}
            hint={actingCount > 0 ? "需於本月決議" : "無"}
            icon={UserCheck}
            accent={actingCount > 0 ? "warning" : "default"}
          />
          <KpiCard
            label="跨部門兼職"
            value={`${crossCount}`}
            hint={crossCount > 0 ? "影響交付與績效" : "無"}
            icon={GitBranch}
            accent={crossCount > 1 ? "danger" : crossCount > 0 ? "warning" : "default"}
          />
          <KpiCard
            label="GM 管理幅度"
            value={`${span.span}`}
            hint={`建議上限 ${span.threshold}`}
            icon={AlertOctagon}
            accent={span.warning ? "danger" : "default"}
          />
        </section>

        {/* Org Chart */}
        <Card>
          <CardHeader>
            <CardTitle>組織架構圖</CardTitle>
            <CardDescription>
              紅框 = 空缺 / 過載；黃框 = 暫代 / 兼職
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrgChart />
          </CardContent>
        </Card>

        {/* Headcount by department */}
        <Card>
          <CardHeader>
            <CardTitle>各部門編制概況</CardTitle>
            <CardDescription>
              編制目標 vs 實際在職 vs 缺額
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ORG_STRUCTURE.departments.map((d) => {
              const ratio =
                d.headcountTarget > 0
                  ? d.headcountActual / d.headcountTarget
                  : 0;
              const gap = d.headcountTarget - d.headcountActual;
              const tone =
                ratio < 0.6
                  ? "bg-danger"
                  : ratio < 0.9
                    ? "bg-warning"
                    : "bg-success";
              return (
                <div key={d.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{d.name}</span>
                    <span className="tabular-nums">
                      <span className="font-semibold">{d.headcountActual}</span>{" "}
                      <span className="text-muted-foreground">
                        / {d.headcountTarget} 人
                      </span>
                      {gap > 0 && (
                        <span className="ml-2 text-xs text-danger">
                          缺 {gap}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${tone}`}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* People table */}
        <Card>
          <CardHeader>
            <CardTitle>人員清單</CardTitle>
            <CardDescription>
              職等、所屬 BU、跨部門關係、任職時長
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PeopleTable />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
