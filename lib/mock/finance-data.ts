import type {
  BuId,
  PnlRow,
  CashFlowNode,
  AgingBucket,
  MaterialIndexPoint,
} from "@/lib/types";
import { MONTHLY_REVENUE } from "./revenue-data";
import { BUSINESS_UNITS } from "./bu-data";

/**
 * 各 BU 的直接成本率與營業費用率（穩定假設，便於由營收反推 P&L）
 */
const PNL_RATIO: Record<BuId, { costRate: number; opexRate: number }> = {
  "design-yilan": { costRate: 0.62, opexRate: 0.20 },   // 毛利 38%、淨利 18%
  "design-xinyi": { costRate: 0.66, opexRate: 0.26 },   // 毛利 34%、淨利 8%（人均產值偏低）
  "pure-house":   { costRate: 0.58, opexRate: 0.18 },   // 毛利 42%、淨利 24%
  "pu-yu":        { costRate: 0.45, opexRate: 0.40 },   // 毛利 55%、淨利 15%（行銷服務、無料）
  "wayhome":      { costRate: 0.55, opexRate: 0.30 },   // 毛利 45%、淨利 15%
  "homatch":      { costRate: 0.60, opexRate: 0.32 },   // 毛利 40%、淨利 8%
};

/** 取得某 BU 的月度損益（1–5 月） */
export function getBuMonthlyPnl(buId: BuId): PnlRow[] {
  const { costRate, opexRate } = PNL_RATIO[buId];
  return MONTHLY_REVENUE.map((m) => {
    const revenue = m.values[buId];
    return {
      month: m.month,
      label: m.label,
      revenue,
      cost: Math.round(revenue * costRate),
      opex: Math.round(revenue * opexRate),
    };
  });
}

/** 集團合併月度損益（六大 BU 加總） */
export function getGroupMonthlyPnl(): PnlRow[] {
  return MONTHLY_REVENUE.map((m) => {
    let revenue = 0;
    let cost = 0;
    let opex = 0;
    for (const bu of BUSINESS_UNITS) {
      const r = m.values[bu.id];
      const { costRate, opexRate } = PNL_RATIO[bu.id];
      revenue += r;
      cost += r * costRate;
      opex += r * opexRate;
    }
    return {
      month: m.month,
      label: m.label,
      revenue: Math.round(revenue),
      cost: Math.round(cost),
      opex: Math.round(opex),
    };
  });
}

/** 衍生欄位 */
export function derivePnl(row: PnlRow) {
  const grossProfit = row.revenue - row.cost;
  const netIncome = grossProfit - row.opex;
  return {
    ...row,
    grossProfit,
    grossMargin: row.revenue > 0 ? grossProfit / row.revenue : 0,
    netIncome,
    netMargin: row.revenue > 0 ? netIncome / row.revenue : 0,
  };
}

/** 集團 YTD 累計損益 */
export function getGroupYtdPnl() {
  const rows = getGroupMonthlyPnl();
  const sum = rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.revenue,
      cost: acc.cost + r.cost,
      opex: acc.opex + r.opex,
    }),
    { revenue: 0, cost: 0, opex: 0 },
  );
  return derivePnl({ month: "ytd", label: "YTD", ...sum });
}

/**
 * 集團 2026 年 YTD 現金流瀑布
 * 起：1/1 期初現金；終：5/31 期末現金
 */
export const CASH_FLOW: CashFlowNode[] = [
  { label: "期初現金", amount: 32_000_000, type: "total" },
  { label: "營業收入", amount: 91_300_000, type: "in" },
  { label: "材料 / 工資", amount: -55_400_000, type: "out" },
  { label: "薪資費用", amount: -14_200_000, type: "out" },
  { label: "辦公 / 租金", amount: -3_800_000, type: "out" },
  { label: "行銷支出", amount: -2_400_000, type: "out" },
  { label: "稅 / 利息", amount: -1_900_000, type: "out" },
  { label: "資本支出", amount: -4_500_000, type: "out" },
  { label: "期末現金", amount: 41_100_000, type: "total" },
];

/** 應收帳款 Aging（5/31 餘額，單位：元） */
export const AR_AGING: AgingBucket[] = [
  { label: "0–30 天", amount: 14_800_000, level: "green" },
  { label: "31–60 天", amount: 6_200_000, level: "green" },
  { label: "61–90 天", amount: 2_100_000, level: "amber" },
  { label: "90 天以上", amount: 1_400_000, level: "red" },
];

/** 應付帳款 Aging（5/31 餘額，單位：元） */
export const AP_AGING: AgingBucket[] = [
  { label: "0–30 天", amount: 9_100_000, level: "green" },
  { label: "31–60 天", amount: 3_400_000, level: "green" },
  { label: "61–90 天", amount: 580_000, level: "amber" },
  { label: "90 天以上", amount: 0, level: "green" },
];

/**
 * 原物料價格指數（2025/12 = 100）
 * 反映「鋁 +40%、鋼 +10% 月增」等趨勢
 */
export const MATERIAL_INDEX: MaterialIndexPoint[] = [
  {
    month: "2025-12", label: "2025/12",
    values: { 鋁料: 100, 鋼材: 100, 板材: 100, 系統櫃面料: 100, 油漆: 100 },
  },
  {
    month: "2026-01", label: "1 月",
    values: { 鋁料: 108, 鋼材: 104, 板材: 102, 系統櫃面料: 103, 油漆: 101 },
  },
  {
    month: "2026-02", label: "2 月",
    values: { 鋁料: 116, 鋼材: 108, 板材: 108, 系統櫃面料: 108, 油漆: 102 },
  },
  {
    month: "2026-03", label: "3 月",
    values: { 鋁料: 124, 鋼材: 113, 板材: 116, 系統櫃面料: 116, 油漆: 104 },
  },
  {
    month: "2026-04", label: "4 月",
    values: { 鋁料: 132, 鋼材: 117, 板材: 126, 系統櫃面料: 125, 油漆: 105 },
  },
  {
    month: "2026-05", label: "5 月",
    values: { 鋁料: 140, 鋼材: 121, 板材: 138, 系統櫃面料: 134, 油漆: 107 },
  },
];

export const MATERIAL_COLORS: Record<string, string> = {
  鋁料: "#dc2626",      // red-600
  鋼材: "#ea580c",      // orange-600
  板材: "#b45309",      // amber-700
  系統櫃面料: "#7c3aed", // violet-600
  油漆: "#0ea5e9",       // sky-500
};
