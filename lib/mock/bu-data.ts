import type { BusinessUnit } from "@/lib/types";

/**
 * 六大事業體 - 截至 2026/05 月底
 * 宜蘭目標 8,000 萬、進度約 32%
 * 信義目標 5,000 萬、進度約 30%
 */
export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: "design-yilan",
    name: "璞石宜蘭",
    fullName: "璞石創研宜蘭",
    category: "interior",
    ownership: "direct",
    annualTarget: 80_000_000,
    ytdRevenue: 25_800_000,        // ~32.3%
    monthlyRevenue: 6_200_000,
    activeProjects: 11,
    headcount: 12,
    status: "amber",
    note: "5 月簽約量回穩，但設計師人均負載已達警戒。",
    accentHex: "#0f766e", // teal-700
  },
  {
    id: "design-xinyi",
    name: "璞石信義",
    fullName: "璞石創研信義",
    category: "interior",
    ownership: "direct",
    annualTarget: 50_000_000,
    ytdRevenue: 15_100_000,        // ~30.2%
    monthlyRevenue: 3_400_000,
    activeProjects: 6,
    headcount: 5,
    status: "red",
    note: "人力與目標落差大，行銷曝光不足，需重新評估策略。",
    accentHex: "#b45309", // amber-700
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
    activeProjects: 18,
    headcount: 7,
    status: "green",
    note: "輕裝修需求穩定，建議鎖定北宜兩地小坪數市場。",
    accentHex: "#4f46e5", // indigo-600
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
    activeProjects: 4,
    headcount: 0,                  // 目前空編，由總管理處兼辦
    status: "red",
    note: "行銷部完全空缺，目前由總管理處兼辦，急需建編。",
    accentHex: "#dc2626", // red-600
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
    activeProjects: 1,
    headcount: 3,
    status: "green",
    note: "宜蘭門市表現穩定；信義門市非直營暫不計入。",
    accentHex: "#059669", // emerald-600
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
    activeProjects: 0,
    headcount: 2,
    status: "amber",
    note: "5 月轉換率下滑，需檢視主力 SKU 的商品頁與廣告組合。",
    accentHex: "#7c3aed", // violet-600
  },
];

export const BU_MAP: Record<string, BusinessUnit> = Object.fromEntries(
  BUSINESS_UNITS.map((b) => [b.id, b]),
);

export function getBu(id: string): BusinessUnit | undefined {
  return BU_MAP[id];
}
