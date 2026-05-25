import { TopBar } from "@/components/layout/TopBar";
import { PagePlaceholder } from "@/components/widgets/PagePlaceholder";

export const metadata = { title: "人力組織" };

export default function PeoplePage() {
  return (
    <>
      <TopBar title="人力組織" description="編制 / 實際在職 / 跨部門兼職關係" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PagePlaceholder
          title="人力組織儀表板"
          note="將呈現組織架構圖、編制 vs 實際、空缺職位、跨部門兼職關係、離職風險。"
        />
      </main>
    </>
  );
}
