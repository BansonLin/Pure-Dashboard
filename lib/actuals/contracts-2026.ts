/**
 * 【實際】2026 年簽約數字 — 已由真實帳務檔案驗證。
 *
 * 來源：璞石_合約管理表單_2026年.xlsx〈業績總表〉
 * 截至：2026-06-01（匯出日）
 * 稅基：含稅（金額經抽驗可被 1.05 整除）
 *
 * 維護規則：本檔案只放「已驗證的真值」。口述數字放 verbal-*、
 * 假設值放 lib/mock。W2 交換表上線後本檔退場，改由 parser 讀取。
 */

export const CONTRACTS_AS_OF = "2026-06-01";

export type SigningCategory = "提案" | "設計" | "工程";

export interface MonthlySigning {
  month: string; // "2026-01"
  label: string; // "1 月"
  提案: number;
  設計: number;
  工程: number;
}

/** 宜蘭（璞石創研室內裝修，82965868）2026 年 1–6 月簽約（元，含稅） */
export const YILAN_SIGNINGS: MonthlySigning[] = [
  { month: "2026-01", label: "1 月", 提案: 0,      設計: 1_057_350, 工程: 961_000 },
  { month: "2026-02", label: "2 月", 提案: 0,      設計: 89_200,    工程: 6_949_970 },
  { month: "2026-03", label: "3 月", 提案: 0,      設計: 821_425,   工程: 3_595_000 },
  { month: "2026-04", label: "4 月", 提案: 0,      設計: 0,         工程: 4_068_000 },
  { month: "2026-05", label: "5 月", 提案: 82_950, 設計: 624_750,   工程: 28_101_500 },
  { month: "2026-06", label: "6 月", 提案: 0,      設計: 0,         工程: 2_695_000 },
];

export function signingMonthTotal(m: MonthlySigning): number {
  return m.提案 + m.設計 + m.工程;
}

/** 宜蘭 YTD 簽約合計（含稅）＝ 49,046,145，由月別加總推導、不可寫死 */
export const YILAN_YTD_INCL = YILAN_SIGNINGS.reduce(
  (s, m) => s + signingMonthTotal(m),
  0,
);

/** 宜蘭年度目標（元；含稅或未稅【待 Patty 確認】，暫以同口徑計算） */
export const YILAN_TARGET = 80_000_000;

/** 信義（璞石創研設計，96833115）2026 H1 簽約合計（含稅）— 僅供止損板 */
export const XINYI_H1_SIGNED_INCL = 3_286_850;
export const XINYI_TARGET = 50_000_000;

/**
 * 璞域（96002337）已接入之簽約 — 目前僅 1 筆。
 * 來源：璞域_合約管理表單_2026年.xlsx〈合約〉。稅基未註明。
 */
export const PUYU_SIGNINGS = [
  {
    month: "2026-05",
    client: "鼎琳建設",
    type: "設計" as const,
    amount: 315_000,
    taxBasis: "unknown" as const,
  },
];
export const PUYU_TARGET = 24_000_000;
