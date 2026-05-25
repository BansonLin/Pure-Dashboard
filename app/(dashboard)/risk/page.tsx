import { TopBar } from "@/components/layout/TopBar";
import { PagePlaceholder } from "@/components/widgets/PagePlaceholder";

export const metadata = { title: "風險預警" };

export default function RiskPage() {
  return (
    <>
      <TopBar
        title="風險預警"
        description="紅燈 / 黃燈 / 行動清單 / 負責人追蹤"
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PagePlaceholder
          title="風險預警儀表板"
          note="將完整列出所有風險、嚴重度分類、負責人、截止日，並支援狀態更新與行動追蹤。"
        />
      </main>
    </>
  );
}
