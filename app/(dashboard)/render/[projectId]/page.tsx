import { TopBar } from "@/components/layout/TopBar";
import { Workspace } from "@/components/render/Workspace";

export const metadata = { title: "渲染工作台" };

export default function RenderProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <>
      <TopBar title="渲染工作台" description="主圖先核准 → 衍生視角讀取同一份物件聖經；修正一律框選區域、開新版本" />
      <Workspace projectId={params.projectId} />
    </>
  );
}
