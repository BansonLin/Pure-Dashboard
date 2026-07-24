/**
 * 【實際】現金水位 — 已由真實帳務檔案驗證。
 * 來源：璞石創研_銀行現流表_2026年.xlsx〈6月份〉期初列（= 2026-05-31 餘額）。
 */

export const CASH_AS_OF = "2026-05-31";

export interface CashAccount {
  label: string;
  amount: number;
}

/** 璞石創研宜蘭法人（82965868）銀行＋現金 */
export const YILAN_CASH_ACCOUNTS: CashAccount[] = [
  { label: "永豐銀行 羅東分行", amount: 3_020_154 },
  { label: "永豐銀行 信義分行", amount: 254_019 },
  { label: "庫存現金", amount: 300_000 },
];

/** 合計 3,574,173 — 由帳戶加總推導、不可寫死 */
export const YILAN_CASH_TOTAL = YILAN_CASH_ACCOUNTS.reduce(
  (s, a) => s + a.amount,
  0,
);
