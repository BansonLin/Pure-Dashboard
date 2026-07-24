import { notFound } from "next/navigation";
import { CheckCircle2, Database, Activity, Wallet } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/widgets/StatusBadge";
import { KpiCard } from "@/components/widgets/KpiCard";
import { RevenueProgressBar } from "@/components/widgets/RevenueProgressBar";
import { ActionList } from "@/components/widgets/ActionList";
import { SourceTag } from "@/components/widgets/SourceTag";
import { StopLossBoard } from "@/components/widgets/StopLossBoard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
  fetchBu,
  fetchBuPeople,
  fetchEntityMap,
  fetchPuyuPartial,
  fetchRisksByBu,
  fetchXinyiH1,
  fetchYilanCash,
  fetchYilanSignings,
  type PersonView,
  type RiskItemView,
} from "@/lib/data";
import { tenureYearsFrom } from "@/lib/report-date";
import { formatTwd, formatPercent, cn } from "@/lib/utils";
import { buColor } from "@/lib/ui/chart-colors";
import type { BusinessUnit, BuEntityInfo } from "@/lib/types";

// T4 止損板倒數需要「今天」→ 本路由改為動態渲染
export const dynamic = "force-dynamic";

interface PageProps {
  params: { buId: string };
}

export async function generateMetadata({ params }: PageProps) {
  const bu = await fetchBu(params.buId);
  return { title: bu ? bu.name : "事業體" };
}

export default async function BuDetailPage({ params }: PageProps) {
  const [bu, entityMap] = await Promise.all([
    fetchBu(params.buId),
    fetchEntityMap(),
  ]);
  if (!bu) return notFound();

  const entity = entityMap[bu.id];
  const status = entity?.dataStatus ?? "none";

  if (status === "monitor") return <XinyiStopLossPage bu={bu} entity={entity} />;
  if (status === "live") return <YilanLivePage bu={bu} entity={entity} />;
  return <NotIntegratedPage bu={bu} entity={entity} partial={status === "partial"} />;
}

/* ================= T4 信義止損監控板 ================= */

async function XinyiStopLossPage({
  bu,
  entity,
}: {
  bu: BusinessUnit;
  entity?: BuEntityInfo;
}) {
  const h1 = await fetchXinyiH1();
  return (
    <>
      <TopBar
        title={`${bu.fullName} · 止損監控板`}
        description="2026-07-20 定調會決議進入止損觀察期"
      />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <EntityLine entity={entity} />
        <StopLossBoard now={new Date()} h1={h1} />
      </main>
    </>
  );
}

/* ================= 宜蘭（已接入真值） ================= */

async function YilanLivePage({
  bu,
  entity,
}: {
  bu: BusinessUnit;
  entity?: BuEntityInfo;
}) {
  const [signings, cash, people, risks] = await Promise.all([
    fetchYilanSignings(),
    fetchYilanCash(),
    fetchBuPeople(bu.id),
    fetchRisksByBu(bu.id),
  ]);

  return (
    <>
      <TopBar title={bu.fullName} description={bu.note} />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Summary */}
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: buColor(bu.id) }}
                />
                <h2 className="text-xl font-semibold tracking-tight">{bu.name}</h2>
                <StatusBadge level={bu.status} />
              </div>
              <EntityLine entity={entity} />
            </div>
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:w-auto">
              <Stat label="YTD 簽約（含稅）" value={formatTwd(signings.ytdIncl)} />
              <Stat label="年度達成" value={formatPercent(signings.achieveIncl, 1)} />
              <Stat label="未稅換算" value={formatTwd(signings.ytdExcl)} />
            </div>
          </CardContent>
        </Card>

        {/* KPI */}
        <section className="grid gap-4 sm:grid-cols-3">
          <KpiCard
            label="年度進度"
            value={formatPercent(signings.achieveIncl, 1)}
            hint={`vs ${formatTwd(signings.target)} 目標（稅基待確認）`}
            icon={Activity}
            accent="success"
          >
            <RevenueProgressBar
              current={signings.ytdIncl}
              target={signings.target}
              showLabel={false}
              barClassName="bg-success"
            />
          </KpiCard>
          <KpiCard
            label={`${signings.lastFullMonth.label}簽約（最近完整月）`}
            value={formatTwd(signings.lastFullMonth.total)}
            delta={`${signings.momRatio >= 0 ? "+" : ""}${(signings.momRatio * 100).toFixed(0)}% MoM`}
            trend={signings.momRatio >= 0 ? "up" : "down"}
            icon={Activity}
          >
            <SourceTag provenance="actual" scope="signed" tax="incl" asOf={signings.asOf} />
          </KpiCard>
          <KpiCard
            label="法人現金水位"
            value={formatTwd(cash.total)}
            hint={`${cash.entityLabel}`}
            icon={Wallet}
          >
            <SourceTag provenance="actual" scope="collected" asOf={cash.asOf} />
          </KpiCard>
        </section>

        {/* 燈號解釋 */}
        <Card className="border border-success/30 bg-success/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <CardTitle className="text-success">綠燈 · 簽約超前</CardTitle>
            </div>
            <CardDescription>為什麼是這個顏色？</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {bu.statusReason.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 月別簽約表【實際】 */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>月別簽約明細</CardTitle>
                <CardDescription>
                  2026 年 1–6 月，依提案 / 設計 / 工程（6 月僅計至 6/1）
                </CardDescription>
              </div>
              <SourceTag provenance="actual" scope="signed" tax="incl" asOf={signings.asOf} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4 text-left font-medium">類別</th>
                    {signings.months.map((m) => (
                      <th key={m.month} className="py-2 pl-4 text-right font-medium">
                        {m.label}
                      </th>
                    ))}
                    <th className="py-2 pl-4 text-right font-semibold text-foreground">
                      小計
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(["提案", "設計", "工程"] as const).map((cat) => {
                    const rowTotal = signings.months.reduce((s, m) => s + m[cat], 0);
                    return (
                      <tr key={cat} className="border-b border-border/60">
                        <td className="py-2 pr-4">{cat}</td>
                        {signings.months.map((m) => (
                          <td key={m.month} className="py-2 pl-4 text-right tabular-nums">
                            {m[cat] > 0 ? formatTwd(m[cat]) : "—"}
                          </td>
                        ))}
                        <td className="py-2 pl-4 text-right font-semibold tabular-nums">
                          {formatTwd(rowTotal)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/30">
                    <td className="py-2 pr-4 font-semibold">合計</td>
                    {signings.months.map((m) => (
                      <td key={m.month} className="py-2 pl-4 text-right font-semibold tabular-nums">
                        {formatTwd(m.total)}
                      </td>
                    ))}
                    <td className="py-2 pl-4 text-right font-bold tabular-nums">
                      {formatTwd(signings.ytdIncl)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 人力 + 風險 */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>人力配置</CardTitle>
              <CardDescription>含跨部門兼職 / 暫代狀態</CardDescription>
            </CardHeader>
            <CardContent>
              <PeopleList people={people} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>相關風險</CardTitle>
              <CardDescription>共 {risks.length} 筆（評分為示意）</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskActionList risks={risks} />
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}

/* ================= 未接入 / 部分接入殼頁 ================= */

async function NotIntegratedPage({
  bu,
  entity,
  partial,
}: {
  bu: BusinessUnit;
  entity?: BuEntityInfo;
  partial: boolean;
}) {
  const partialData = partial ? await fetchPuyuPartial() : null;
  const risks = await fetchRisksByBu(bu.id);

  return (
    <>
      <TopBar title={bu.fullName} description="資料未接入" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">{bu.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <Database className="h-3 w-3" />
                  {partial ? "部分接入" : "資料未接入"}
                </span>
              </div>
              <EntityLine entity={entity} />
            </div>
            <div className="grid w-full grid-cols-2 gap-6 lg:w-auto">
              <Stat label="年度目標" value={formatTwd(bu.annualTarget)} />
              <Stat
                label="已接入簽約"
                value={partialData ? formatTwd(partialData.knownTotal) : "—"}
              />
            </div>
          </CardContent>
        </Card>

        {partialData && (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>已接入合約</CardTitle>
                  <CardDescription>
                    來源：璞域_合約管理表單_2026年.xlsx（稅基未註明）
                  </CardDescription>
                </div>
                <SourceTag provenance="actual" scope="signed" tax="unknown" asOf={partialData.asOf} />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {partialData.signings.map((s0) => (
                  <li
                    key={`${s0.client}-${s0.month}`}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                  >
                    <span>
                      {s0.client} · {s0.type} · {s0.month.replace("-", "/")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatTwd(s0.amount)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                佔年度目標 {formatPercent(partialData.ratio, 1)}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Database className="h-6 w-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                營運數據待交換表（W2）接入
              </h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                依 T5 誠實標示規則：接入前不顯示任何估計燈號或假數字。
                月結後由 Bella 填報交換表、Patty 審核放行，本頁自動點亮。
              </p>
              {entity?.note && (
                <p className="mx-auto max-w-md text-xs leading-relaxed text-warning">
                  {entity.note}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {risks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>相關風險</CardTitle>
              <CardDescription>共 {risks.length} 筆（評分為示意）</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskActionList risks={risks} />
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

/* ================= 共用小元件 ================= */

function EntityLine({ entity }: { entity?: BuEntityInfo }) {
  if (!entity) return null;
  return (
    <p className="text-sm text-muted-foreground">
      {entity.legalName ? (
        <>
          {entity.legalName} · 統編 {entity.taxId}
        </>
      ) : (
        <span className="text-warning">法人歸屬待確認（見 T2 對照表）</span>
      )}
    </p>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function PeopleList({ people }: { people: PersonView[] }) {
  if (people.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">此事業體目前無直屬編制。</p>
    );
  }
  return (
    <ul className="space-y-2.5">
      {people.map((p) => {
        const tenure = p.joinedAt ? tenureYearsFrom(p.joinedAt) : null;
        const personTone =
          p.status === "acting" || p.status === "cross-functional"
            ? "border-warning/40 bg-warning/5"
            : "border-border";
        return (
          <li
            key={p.id}
            className={cn(
              "flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5",
              personTone,
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">
                {p.name}
                {p.status === "cross-functional" && (
                  <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                    跨部門兼職
                  </span>
                )}
                {p.status === "acting" && (
                  <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                    暫代未轉正
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.title}</p>
              {p.note && (
                <p className="mt-1 text-[11px] leading-snug text-warning">{p.note}</p>
              )}
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
              {p.grade ? `G${p.grade}` : ""}
              {tenure !== null ? ` · ${tenure.toFixed(1)}y` : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function RiskActionList({ risks }: { risks: RiskItemView[] }) {
  return (
    <ActionList
      actions={risks.map((r) => ({
        id: r.id,
        title: r.action ?? r.title,
        severity: r.severity,
        owner: r.owner,
        buId: r.buId,
        dueAt: r.dueAt,
        buName: r.buName,
      }))}
    />
  );
}
