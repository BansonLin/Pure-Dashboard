import type { PnlRow } from "@/lib/types";

/** 由損益列推導毛利 / 毛利率 / 淨利 / 淨利率 — 純計算，與資料來源無關 */
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

export type DerivedPnl = ReturnType<typeof derivePnl>;
