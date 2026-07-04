import { notFound } from "next/navigation";
import { CheckCircle2, AlertTriangle, AlertOctagon, Users, Briefcase, Activity } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/widgets/StatusBadge";
import { KpiCard } from "@/components/widgets/KpiCard";
import { RevenueProgressBar } from "@/components/widgets/RevenueProgressBar";
import { PnlTable } from "@/components/widgets/PnlTable";
import { ProjectList } from "@/components/widgets/ProjectList";
import { ActionList } from "@/components/widgets/ActionList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
  fetchBu,
  fetchBuMonthlyPnl,
  fetchBuPeople,
  fetchBusinessUnits,
  fetchProjectsByBu,
  fetchRisksByBu,
} from "@/lib/data";
import { tenureYearsFrom } from "@/lib/report-date";
import { formatTwd, formatPercent, cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/ui/severity";
import { buColor } from "@/lib/ui/chart-colors";
import type { StatusLevel } from "@/lib/types";

interface PageProps {
  params: { buId: string };
}

export async function generateStaticParams() {
  const bus = await fetchBusinessUnits();
  return bus.map((b) => ({ buId: b.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const bu = await fetchBu(params.buId);
  return { title: bu ? bu.name : "事業體" };
}

const STATUS_ICON = {
  green: CheckCircle2,
  amber: AlertTriangle,
  red: AlertOctagon,
} as const;

const STATUS_TONE: Record<
  StatusLevel,
  { wrap: string; icon: string; title: string }
> = {
  green: {
    wrap: "border-success/30 bg-success/5",
    icon: "text-success",
    title: "綠燈 · 進度正常",
  },
  amber: {
    wrap: "border-warning/30 bg-warning/5",
    icon: "text-warning",
    title: "黃燈 · 需要關注",
  },
  red: {
    wrap: "border-danger/30 bg-danger/5",
    icon: "text-danger",
    title: "紅燈 · 立即處理",
  },
};

export default async function BuDetailPage({ params }: PageProps) {
  const bu = await fetchBu(params.buId);
  if (!bu) return notFound();

  const [pnl, projects, buRisks, involvedPeople] = await Promise.all([
    fetchBuMonthlyPnl(bu.id),
    fetchProjectsByBu(bu.id),
    fetchRisksByBu(bu.id),
    fetchBuPeople(bu.id),
  ]);

  const progress = bu.annualTarget > 0 ? bu.ytdRevenue / bu.annualTarget : 0;
  const crossSupportCount = involvedPeople.filter(
    (p) =>
      p.buId !== bu.id &&
      (p.crossBuIds as readonly string[] | undefined)?.includes(bu.id),
  ).length;
  const totalContractAmount = projects.reduce(
    (s, p) => s + p.contractAmount * (1 - p.progress / 100),
    0,
  );

  const StatusIcon = STATUS_ICON[bu.status];
  const tone = STATUS_TONE[bu.status];

  return (
    <>
      <TopBar title={bu.fullName} description={bu.note} />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Summary card */}
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: buColor(bu.id) }}
                />
                <h2 className="text-xl font-semibold tracking-tight">{bu.name}</h2>
                <StatusBadge level={bu.status} pulse={bu.status !== "green"} />
              </div>
              <p className="text-sm text-muted-foreground">{bu.fullName}</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4 lg:w-auto">
              <Stat label="當月營收" value={formatTwd(bu.monthlyRevenue)} />
              <Stat label="YTD 營收" value={formatTwd(bu.ytdRevenue)} />
              <Stat label="年度達成" value={formatPercent(progress, 1)} />
              <Stat label="未完工金額" value={formatTwd(Math.round(totalContractAmount))} />
            </div>
          </CardContent>
        </Card>

        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="年度進度"
            value={formatPercent(progress, 1)}
            hint={`vs ${formatTwd(bu.annualTarget)} 目標`}
            icon={Activity}
            accent={bu.status === "red" ? "danger" : bu.status === "amber" ? "warning" : "success"}
          >
            <RevenueProgressBar
              current={bu.ytdRevenue}
              target={bu.annualTarget}
              showLabel={false}
              barClassName={STATUS_META[bu.status].bar}
            />
          </KpiCard>
          <KpiCard
            label="進行中專案"
            value={`${projects.length}`}
            hint={projects.length > 0 ? `總合約 ${formatTwd(projects.reduce((s, p) => s + p.contractAmount, 0))}` : "電商營運型 BU"}
            icon={Briefcase}
          />
          <KpiCard
            label="人力編制"
            value={`${bu.headcount} 人`}
            hint={crossSupportCount > 0 ? `+${crossSupportCount} 人跨部門支援` : "直接編制"}
            icon={Users}
          />
          <KpiCard
            label="風險"
            value={`${buRisks.length}`}
            hint={buRisks.length > 0 ? "點下方狀態說明查看" : "目前無未解決風險"}
            icon={AlertOctagon}
            accent={buRisks.some((r) => r.severity === "critical") ? "danger" : buRisks.length > 0 ? "warning" : "default"}
          />
        </section>

        {/* Status reasoning */}
        <Card className={cn("border", tone.wrap)}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-5 w-5", tone.icon)} />
              <CardTitle className={tone.icon}>{tone.title}</CardTitle>
            </div>
            <CardDescription>為什麼是這個顏色？</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {bu.statusReason.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      STATUS_META[bu.status].dot,
                    )}
                  />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* P&L */}
        <Card>
          <CardHeader>
            <CardTitle>月度損益表</CardTitle>
            <CardDescription>2026 年 1–5 月，單位：新台幣</CardDescription>
          </CardHeader>
          <CardContent>
            <PnlTable rows={pnl} />
          </CardContent>
        </Card>

        {/* Projects + People */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>進行中專案</CardTitle>
              <CardDescription>
                {projects.length > 0
                  ? `${projects.length} 個專案，依完工日排序`
                  : "目前無進行中專案"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectList
                projects={projects
                  .slice()
                  .sort((a, b) => a.dueAt.localeCompare(b.dueAt))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>人力配置</CardTitle>
              <CardDescription>
                含跨部門兼職 / 暫代狀態
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {involvedPeople.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  此事業體目前無直屬編制。
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {involvedPeople.map((p) => {
                    const tenure = p.joinedAt ? tenureYearsFrom(p.joinedAt) : null;
                    const personTone =
                      p.status === "acting" || p.status === "cross-functional"
                        ? "border-warning/40 bg-warning/5"
                        : p.status === "vacant"
                          ? "border-danger/40 bg-danger/5"
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
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {p.title}
                          </p>
                          {p.note && (
                            <p className="mt-1 text-[11px] leading-snug text-warning">
                              {p.note}
                            </p>
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
              )}
            </CardContent>
          </Card>
        </section>

        {buRisks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>此事業體相關風險</CardTitle>
              <CardDescription>
                共 {buRisks.length} 筆未解決項目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActionList
                actions={buRisks.map((r) => ({
                  id: r.id,
                  title: r.action ?? r.title,
                  severity: r.severity,
                  owner: r.owner,
                  buId: r.buId,
                  dueAt: r.dueAt,
                  buName: r.buName,
                }))}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </>
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
