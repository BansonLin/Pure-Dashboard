import type { RiskItem, ActionItem } from "@/lib/types";

export const RISK_ITEMS: RiskItem[] = [
  {
    id: "r-01",
    title: "信義店人力與 5,000 萬目標嚴重落差",
    description:
      "信義店目前僅 5 人、年度目標 5,000 萬；以人均產值估算需 9–11 人，缺口最大，5 月達成率僅 30%。",
    severity: "critical",
    owner: "Banson / 吳嘉倩",
    buId: "design-xinyi",
    category: "people",
    createdAt: "2026-04-15",
    dueAt: "2026-06-30",
    action: "兩週內提出重新編列方案：補人、調目標、或調整商業模式三選一。",
  },
  {
    id: "r-02",
    title: "行銷企劃部完全空缺",
    description:
      "行銷部編制 4 人目前 0 人，由總管理處兼辦；六大 BU 對外曝光與品牌一致性無人負責。",
    severity: "critical",
    owner: "吳嘉倩",
    buId: "pu-yu",
    category: "people",
    createdAt: "2026-03-01",
    dueAt: "2026-07-01",
    action: "Q2 內完成行銷主管定位 + 1 名企劃到職，並先以外包補位。",
  },
  {
    id: "r-03",
    title: "原物料連動上漲 40%（系統櫃 / 板材）",
    description:
      "供應商 4 月起連續調漲，整體裝修成本上升約 12–15%；既有合約多為固定價，毛利壓縮。",
    severity: "high",
    owner: "設計部主管",
    buId: "group",
    category: "market",
    createdAt: "2026-04-20",
    dueAt: "2026-06-15",
    action: "新案合約加入物料連動條款；舊案盤點補價可能性。",
  },
  {
    id: "r-04",
    title: "許舒婷暫代設計部主管未轉正",
    description:
      "暫代已逾三個月，內部認知模糊，影響團隊指揮鏈與績效對接。",
    severity: "high",
    owner: "吳嘉倩",
    buId: "design-yilan",
    category: "people",
    createdAt: "2026-02-10",
    dueAt: "2026-06-01",
    action: "本月內決定轉正、外聘或維持暫代並公開說明。",
  },
  {
    id: "r-05",
    title: "陳又暐跨部門兼職造成負荷",
    description:
      "同時負責宜蘭與信義設計案、每週通勤兩天；近兩月加班時數 60+ 小時，離職風險升高。",
    severity: "medium",
    owner: "張可昕",
    buId: "design-xinyi",
    category: "people",
    createdAt: "2026-03-25",
    dueAt: "2026-06-15",
    action: "重新分配信義案件至外援，或正式調整職務與薪酬。",
  },
  {
    id: "r-06",
    title: "Homatch 5 月轉換率下滑 18%",
    description:
      "電商轉換率自 1.8% 降至 1.48%；客單價未變，主要影響來自廣告組合與商品頁。",
    severity: "medium",
    owner: "行銷代理 / Banson",
    buId: "homatch",
    category: "operation",
    createdAt: "2026-05-08",
    action: "本週內完成 Top 10 SKU 商品頁 audit、暫停低 ROAS 廣告組。",
  },
  {
    id: "r-07",
    title: "六大 BU 共用會計系統，月結延遲",
    description:
      "現行單一會計同時負責六個 BU、月結時間平均 12 個工作日，影響月度經營決策。",
    severity: "medium",
    owner: "蔡明慧",
    buId: "group",
    category: "finance",
    createdAt: "2026-04-01",
    dueAt: "2026-08-01",
    action: "評估導入雲端會計系統並補實 1 名會計人員。",
  },
  {
    id: "r-08",
    title: "璞域國際 Q2 無新建案合作合約",
    description:
      "目前合作的建案均為延續案，Q2 起無新案進帳排程；6 月後營收可能斷層。",
    severity: "high",
    owner: "Banson",
    buId: "pu-yu",
    category: "operation",
    createdAt: "2026-05-12",
    dueAt: "2026-06-30",
    action: "5 月底前簽下 2 個新建案、否則啟動人力凍結。",
  },
];

export function getUnresolvedRisks() {
  return RISK_ITEMS.filter((r) => !r.resolved);
}

export function getRiskCounts() {
  const open = getUnresolvedRisks();
  return {
    total: open.length,
    critical: open.filter((r) => r.severity === "critical").length,
    high: open.filter((r) => r.severity === "high").length,
    medium: open.filter((r) => r.severity === "medium").length,
    low: open.filter((r) => r.severity === "low").length,
  };
}

const SEVERITY_RANK: Record<RiskItem["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/** Top N 行動清單，依嚴重度排序 */
export function getTopActions(limit = 5): ActionItem[] {
  return getUnresolvedRisks()
    .slice()
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
    .slice(0, limit)
    .map((r) => ({
      id: r.id,
      title: r.action ?? r.title,
      severity: r.severity,
      owner: r.owner,
      buId: r.buId,
      dueAt: r.dueAt,
    }));
}
