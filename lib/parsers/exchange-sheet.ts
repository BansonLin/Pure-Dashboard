/**
 * W2 交換表（儀表板交換表 V1.xlsx）欄位契約與 parser 介面。
 *
 * 交換表是儀表板唯一人工資料入口：Bella 月結後填寫、Patty 於〈說明〉
 * 「資料截至日」簽入日期即放行。藍途穩定後本表退場（落日條款）。
 *
 * 分頁與欄位（依 2026-07 V1 範本確認）：
 *
 * 〈業績_簽約〉
 *   簽約年月(YYYYMM), BU, 案名, 類型(提案|設計|工程), 金額_未稅(NTD),
 *   收款狀態(未收|部分收|已全收), 備註
 *   ※ 金額一律未稅；含稅來源 ÷1.05 四捨五入
 *
 * 〈現金水位〉
 *   月份(YYYYMM), 法人(統編_名稱), 帳戶(銀行_分行_末五碼),
 *   期初餘額, 當月收入, 當月支出, 期末餘額, 驗算(應為0), 備註
 *
 * 〈說明〉
 *   資料截至日（Patty 簽入，T7 之後 report-date 動態讀取此欄）
 */

import type { BuId } from "@/lib/types";

export interface ExchangeSigningRow {
  /** "202605" → { year: 2026, month: 5 } 由 parser 拆解 */
  yearMonth: string;
  buId: BuId;
  projectName: string;
  category: "提案" | "設計" | "工程";
  /** 未稅整數 */
  amountExcl: number;
  collectStatus: "未收" | "部分收" | "已全收";
  note?: string;
}

export interface ExchangeCashRow {
  yearMonth: string;
  /** "82965868_璞石創研宜蘭" */
  entity: string;
  /** "永豐_羅東_59583" */
  account: string;
  opening: number;
  inflow: number;
  outflow: number;
  closing: number;
  note?: string;
}

export interface ExchangeSheetData {
  /** Patty 簽入的資料截至日（YYYY-MM-DD）；未簽入 = null（不得使用） */
  asOf: string | null;
  reporter: string | null;
  signings: ExchangeSigningRow[];
  cash: ExchangeCashRow[];
  /** 驗算不為 0 的現金列（放行前必須清空） */
  cashValidationErrors: ExchangeCashRow[];
}

/**
 * 驗算現金列：期初 + 收入 − 支出 是否等於期末。
 * 交換表內建公式欄，此處為第二道防線。
 */
export function validateCashRow(row: ExchangeCashRow): boolean {
  return row.opening + row.inflow - row.outflow === row.closing;
}

/**
 * 接真時的實作位置（屆時採 xlsx 解析套件或改由 Google Sheets API 讀取）。
 * 資料層的 fetchYilanSignings / fetchYilanCash 屆時改讀本函式輸出，
 * UI 零改動。
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function parseExchangeSheet(source: unknown): ExchangeSheetData {
  throw new Error(
    "exchange-sheet parser 尚未接真源；欄位契約已固定，實作時勿更動介面。",
  );
}
