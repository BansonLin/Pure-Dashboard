import type { MonthlyRevenuePoint, BuId } from "@/lib/types";

/**
 * 2026 1–5 月每月營收（單位：元）
 * 確保 5 個月加總 ≈ 各 BU 的 ytdRevenue
 */
export const MONTHLY_REVENUE: MonthlyRevenuePoint[] = [
  {
    month: "2026-01",
    label: "1 月",
    values: {
      "design-yilan": 4_200_000,
      "design-xinyi": 2_500_000,
      "pure-house": 2_400_000,
      "pu-yu": 1_300_000,
      "wayhome": 1_180_000,
      "homatch": 720_000,
    },
  },
  {
    month: "2026-02",
    label: "2 月",
    values: {
      "design-yilan": 4_900_000,   // 春節旺季
      "design-xinyi": 2_800_000,
      "pure-house": 2_700_000,
      "pu-yu": 1_400_000,
      "wayhome": 1_320_000,
      "homatch": 850_000,
    },
  },
  {
    month: "2026-03",
    label: "3 月",
    values: {
      "design-yilan": 5_300_000,
      "design-xinyi": 3_100_000,
      "pure-house": 2_700_000,
      "pu-yu": 1_650_000,
      "wayhome": 1_340_000,
      "homatch": 880_000,
    },
  },
  {
    month: "2026-04",
    label: "4 月",
    values: {
      "design-yilan": 5_200_000,
      "design-xinyi": 3_300_000,
      "pure-house": 2_900_000,
      "pu-yu": 1_900_000,
      "wayhome": 1_340_000,
      "homatch": 770_000,
    },
  },
  {
    month: "2026-05",
    label: "5 月",
    values: {
      "design-yilan": 6_200_000,
      "design-xinyi": 3_400_000,
      "pure-house": 3_100_000,
      "pu-yu": 1_650_000,
      "wayhome": 1_420_000,
      "homatch": 980_000,
    },
  },
];

/** 集團當月總營收 */
export function getGroupMonthlyRevenue(): number {
  const last = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  return Object.values(last.values).reduce((s, v) => s + v, 0);
}

/** 集團 YTD 累計營收 */
export function getGroupYtdRevenue(): number {
  return MONTHLY_REVENUE.reduce(
    (s, m) => s + Object.values(m.values).reduce((a, b) => a + b, 0),
    0,
  );
}

/** 將月度資料攤平為 Recharts 用的 data array */
export function getRevenueChartData(): Array<Record<string, number | string>> {
  return MONTHLY_REVENUE.map((m) => ({
    label: m.label,
    ...m.values,
  }));
}

/** 取得某 BU 的月度序列 */
export function getBuMonthlySeries(buId: BuId): number[] {
  return MONTHLY_REVENUE.map((m) => m.values[buId]);
}
