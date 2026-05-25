import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { PagePlaceholder } from "@/components/widgets/PagePlaceholder";
import { StatusBadge } from "@/components/widgets/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { BUSINESS_UNITS, getBu } from "@/lib/mock/bu-data";
import { formatTwd, formatPercent } from "@/lib/utils";

interface PageProps {
  params: { buId: string };
}

export function generateStaticParams() {
  return BUSINESS_UNITS.map((b) => ({ buId: b.id }));
}

export function generateMetadata({ params }: PageProps) {
  const bu = getBu(params.buId);
  return { title: bu ? bu.name : "事業體" };
}

export default function BuDetailPage({ params }: PageProps) {
  const bu = getBu(params.buId);
  if (!bu) return notFound();

  const progress = bu.annualTarget > 0 ? bu.ytdRevenue / bu.annualTarget : 0;

  return (
    <>
      <TopBar title={bu.fullName} description={bu.note} />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">{bu.name}</h2>
                <StatusBadge level={bu.status} pulse={bu.status !== "green"} />
              </div>
              <p className="text-sm text-muted-foreground">{bu.fullName}</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <Stat label="當月營收" value={formatTwd(bu.monthlyRevenue)} />
              <Stat label="YTD" value={formatTwd(bu.ytdRevenue)} />
              <Stat
                label="進度"
                value={formatPercent(progress, 1)}
              />
            </div>
          </CardContent>
        </Card>

        <PagePlaceholder
          title={`${bu.name} 詳情`}
          note="將涵蓋：營收明細、專案清單、人力配置、毛利率、客戶分析、與該 BU 相關風險。"
        />
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
