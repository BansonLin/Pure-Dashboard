/**
 * T1 全站口徑定義 — 業績與金額的統一語言。
 *
 * | 口徑     | 定義             | 來源             |
 * |----------|------------------|------------------|
 * | 簽約(主) | 簽約額（未稅）   | 合約管理表單     |
 * | 請款     | 請款額           | 專案工程請款進度總表 |
 * | 收款     | 收款額           | 銀行現流表       |
 *
 * 含稅換算：來源為含稅時 ÷ 1.05 四捨五入取整。
 * （合約管理表單金額經抽驗可被 1.05 整除，判定為含稅。）
 *
 * 注意：年度目標（8,000 萬等）的含稅/未稅屬性【待 Patty 確認】。
 * 確認前，達成率一律以「同口徑」計算（含稅簽約 ÷ 目標視為含稅）並於 UI 註記。
 */

export type RevenueScope = "signed" | "billed" | "collected";

export const SCOPE_LABEL: Record<RevenueScope, string> = {
  signed: "簽約",
  billed: "請款",
  collected: "收款",
};

export type TaxBasis = "incl" | "excl" | "unknown";

export const TAX_LABEL: Record<TaxBasis, string> = {
  incl: "含稅",
  excl: "未稅",
  unknown: "稅基未註明",
};

/** 含稅 → 未稅（÷1.05 四捨五入） */
export function toExclTax(amountIncl: number): number {
  return Math.round(amountIncl / 1.05);
}

/**
 * 資料可信度標記（本專案數字治理的核心分類）：
 * - actual：已由真實帳務檔案驗證
 * - verbal：定調會口頭數字，待財務核實
 * - mock：示意假設值
 */
export type Provenance = "actual" | "verbal" | "mock";

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  actual: "實際",
  verbal: "口述待核",
  mock: "示意數據",
};
