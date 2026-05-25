import { TopBar } from "@/components/layout/TopBar";
import { PagePlaceholder } from "@/components/widgets/PagePlaceholder";

export const metadata = { title: "財務" };

export default function FinancePage() {
  return (
    <>
      <TopBar title="財務" description="現金流、應收應付、利潤結構" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PagePlaceholder
          title="財務儀表板"
          note="將涵蓋集團現金部位、應收/應付、毛利結構、月度損益對比。資料來源：會計系統 + 各 BU 帳。"
        />
      </main>
    </>
  );
}
