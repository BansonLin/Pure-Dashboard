import { Sidebar } from "@/components/layout/Sidebar";
import { fetchBuSeries, fetchRiskCounts } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bus, riskCounts] = await Promise.all([
    fetchBuSeries(),
    fetchRiskCounts(),
  ]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        bus={bus}
        riskTotal={riskCounts.total}
        riskCritical={riskCounts.critical}
      />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
