import type { BusinessUnit } from "@/lib/types";
import { PROJECTS } from "./project-data";
import {
  XINYI_H1_SIGNED_INCL,
  YILAN_SIGNINGS,
  YILAN_YTD_INCL,
  signingMonthTotal,
} from "@/lib/actuals/contracts-2026";

/**
 * 六大事業體 - 截至 2026/05 月底
 * 宜蘭目標 8,000 萬、進度約 32%
 * 信義目標 5,000 萬、進度約 30%
 *
 * activeProjects 一律由 project-data 推導，避免與 BU 詳情頁數字不一致。
 */
const RAW_BUSINESS_UNITS: Array<Omit<BusinessUnit, "activeProjects">> = [
  {
    id: "design-yilan",
    name: "璞石宜蘭",
    fullName: "璞石創研宜蘭",
    category: "interior",
    ownership: "direct",
    annualTarget: 80_000_000,
    // 【實際】YTD 簽約（含稅），由 lib/actuals 月別推導
    ytdRevenue: YILAN_YTD_INCL,
    // 【實際】最近完整月（2026-05）簽約
    monthlyRevenue: signingMonthTotal(YILAN_SIGNINGS[4]),
    headcount: 12,
    status: "green",
    statusReason: [
      "H1 簽約 4,905 萬（含稅）、達成 61.3%，進度超前線性目標。",
      "5 月單月工程簽約 2,810 萬為主因。",
      "風險在交付產能而非案源：工務排程與人力負載需盯緊。",
      "主管職由許舒婷暫代未轉正議題仍待處理（見風險清單）。",
    ],
    note: "H1 簽約超前；風險在交付產能而非案源。",
  },
  {
    id: "design-xinyi",
    name: "璞石信義",
    fullName: "璞石創研信義",
    category: "interior",
    ownership: "direct",
    annualTarget: 50_000_000,
    // 【實際】H1 簽約（含稅）— 止損板輸入
    ytdRevenue: XINYI_H1_SIGNED_INCL,
    monthlyRevenue: 0, // 月別未拆分

    headcount: 5,
    status: "red",
    statusReason: [
      "YTD 30.2%、進度落後線性目標 41.7% 達 11.5 個百分點。",
      "現有 5 人對應 5,000 萬目標、人均產值需 1,000 萬，業界標準約 600–700 萬。",
      "陳又暐長期兼職、近兩月加班 60+ 小時，離職風險升高。",
      "行銷部完全空缺，信義店無在地曝光策略、新案進線量持續下滑。",
    ],
    note: "人力與目標落差大，行銷曝光不足，需重新評估策略。",
  },
  {
    id: "pure-house",
    name: "璞石好室",
    fullName: "璞石好室 PURE HOUSE",
    category: "renovation",
    ownership: "direct",
    annualTarget: 36_000_000,
    ytdRevenue: 13_800_000,        // ~38%
    monthlyRevenue: 3_100_000,
    headcount: 7,
    status: "green",
    statusReason: [
      "YTD 38.3%、領先線性目標 41.7% 但差距僅 3.4 點，可視為達標。",
      "輕裝修客單價穩定、回頭客比例 22%（產業平均 12%）。",
      "工務排程已排到 8 月、現金流穩健。",
    ],
    note: "輕裝修需求穩定，建議鎖定北宜兩地小坪數市場。",
  },
  {
    id: "pu-yu",
    name: "璞域國際",
    fullName: "璞域國際企劃",
    category: "marketing",
    ownership: "subsidiary",
    annualTarget: 24_000_000,
    ytdRevenue: 7_900_000,         // ~33%
    monthlyRevenue: 1_650_000,
    headcount: 0,                  // 目前空編，由總管理處兼辦
    status: "red",
    statusReason: [
      "編制 0 人、由總管理處兼辦，人力結構不可持續。",
      "Q2 起無新建案合作合約進帳排程、6 月後營收可能斷層。",
      "目前 4 個專案皆為延續案、結案後將出現空窗期。",
    ],
    note: "行銷部完全空缺，目前由總管理處兼辦，急需建編。",
  },
  {
    id: "wayhome",
    name: "Wayhome",
    fullName: "Wayhome 軟裝零售（宜蘭直營店）",
    category: "retail",
    ownership: "direct",
    annualTarget: 18_000_000,
    ytdRevenue: 6_600_000,         // ~37%
    monthlyRevenue: 1_420_000,
    headcount: 3,
    status: "green",
    statusReason: [
      "宜蘭門市 YTD 36.7%、與線性目標差 5 點以內。",
      "5 月新增聯名商品線、客單價 + 18%。",
      "信義店非直營暫不計入合併營收。",
    ],
    note: "宜蘭門市表現穩定；信義門市非直營暫不計入。",
  },
  {
    id: "homatch",
    name: "Homatch",
    fullName: "Homatch 好搭家居（電商）",
    category: "ecommerce",
    ownership: "subsidiary",
    annualTarget: 15_000_000,
    ytdRevenue: 4_200_000,         // ~28%
    monthlyRevenue: 980_000,
    headcount: 2,
    status: "amber",
    statusReason: [
      "YTD 28%、落後線性目標 41.7% 達 13.7 點，是落差最大的 BU。",
      "5 月轉換率自 1.8% 降至 1.48%、廣告 ROAS 同步下滑。",
      "目前僅 2 人運營、行銷端外包品質不穩定。",
    ],
    note: "5 月轉換率下滑，需檢視主力 SKU 的商品頁與廣告組合。",
  },
];

/** activeProjects 由 project-data 實際筆數推導，兩頁數字結構性一致 */
export const BUSINESS_UNITS: BusinessUnit[] = RAW_BUSINESS_UNITS.map((b) => ({
  ...b,
  activeProjects: PROJECTS.filter((p) => p.buId === b.id).length,
}));

export const BU_MAP: Record<string, BusinessUnit> = Object.fromEntries(
  BUSINESS_UNITS.map((b) => [b.id, b]),
);

export function getBu(id: string): BusinessUnit | undefined {
  return BU_MAP[id];
}
