import { differenceInCalendarDays } from "date-fns";

/**
 * 報表基準日 — 全站「營運資料截至日」。
 * T7：以合約管理表單匯出日 2026-06-01 為準。
 * W2 交換表上線後，改為動態讀取交換表〈說明〉的「資料截至日」欄位
 * （lib/parsers/exchange-sheet.ts 的 asOf）。
 *
 * 注意：信義止損板的倒數/燒錢累計用「伺服器當下時間」而非本基準日
 * （見 lib/actuals/xinyi-stoploss.ts stopLossClock）。
 */
export const REPORT_DATE_ISO = "2026-06-01";

/** TopBar 顯示用字串（預先排好版，避免 SSR/CSR 時區差異造成 hydration mismatch） */
export const REPORT_DATE_DISPLAY = "2026 / 06 / 01 星期一";

/**
 * 將 date-only 字串（YYYY-MM-DD）解析為「本地時區的當日零時」。
 * 直接 new Date("YYYY-MM-DD") 會解析成 UTC 午夜，
 * 在 UTC 以西的時區 format 會提前一天 — 必須用這個函式取代。
 */
export function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 報表基準日的 Date 物件（本地時區當日零時，兩端一致） */
export function reportToday(): Date {
  return parseDateOnly(REPORT_DATE_ISO);
}

/** date-only 字串 → "M/d" 顯示（時區安全） */
export function formatMonthDay(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
}

/** 距報表基準日的日曆天數（正 = 未來、負 = 已逾期） */
export function daysUntil(iso: string): number {
  return differenceInCalendarDays(parseDateOnly(iso), reportToday());
}

/** 是否已逾期（相對報表基準日） */
export function isOverdue(iso: string): boolean {
  return daysUntil(iso) < 0;
}

/** 任職時長（年），相對報表基準日 */
export function tenureYearsFrom(joinedAt: string): number {
  const days = -daysUntil(joinedAt);
  return Math.max(0, days / 365.25);
}
