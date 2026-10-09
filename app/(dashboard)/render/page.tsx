import { TopBar } from "@/components/layout/TopBar";
import { ProjectList } from "@/components/render/ProjectList";

export const metadata = { title: "渲染工作台" };

export default function RenderPage() {
  return (
    <>
      <TopBar title="渲染工作台" description="3D 圖 AI 優化：專案畫布 / 區域指令 / 跨視角一致 / 水波紋篩查 / 360 環景" />
      <ProjectList />
    </>
  );
}
