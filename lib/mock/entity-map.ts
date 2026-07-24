import type { BuEntityInfo } from "@/lib/types";

/**
 * T2 BU ↔ 法人對照表。
 * 來源：公司基本資料_2026年.xlsx〈公司基本資料〉（統編為【實際】）。
 * dataStatus 決定該 BU 在儀表板的呈現方式（T5 誠實標示規則）：
 * - live    已接入真值 → 正常卡片與燈號
 * - monitor 止損監控   → 深灰卡 + 止損觀察徽章（T4）
 * - partial 部分接入   → 灰卡 + 已知真值 + 「部分接入」徽章
 * - none    未接入     → 灰卡 + 保留年度目標 + 「資料未接入」
 */
export const ENTITY_MAP: Record<string, BuEntityInfo> = {
  "design-yilan": {
    buId: "design-yilan",
    legalName: "璞石創研室內裝修有限公司",
    taxId: "82965868",
    dataStatus: "live",
  },
  "design-xinyi": {
    buId: "design-xinyi",
    legalName: "璞石創研設計室內裝修有限公司",
    taxId: "96833115",
    dataStatus: "monitor",
    note: "2026-07-20 定調會決議進入止損觀察期（T4）。",
  },
  "pu-yu": {
    buId: "pu-yu",
    legalName: "璞域國際企劃有限公司",
    taxId: "96002337",
    dataStatus: "partial",
    note: "合約管理表單僅 1 筆簽約已接入。",
  },
  "wayhome": {
    buId: "wayhome",
    legalName: "吉月傢俱股份有限公司",
    taxId: "60736016",
    dataStatus: "none",
  },
  "pure-house": {
    buId: "pure-house",
    legalName: undefined,
    taxId: undefined,
    dataStatus: "none",
    note: "法人歸屬待確認：璞玉家居國際（95490941，負責人吳嘉倩）？或掛璞石創研宜蘭（82965868）帳下？— Banson/Patty 確認後回填。",
  },
  "homatch": {
    buId: "homatch",
    legalName: undefined,
    taxId: undefined,
    dataStatus: "none",
    note: "法人歸屬待確認：璞遇國際（93617108，負責人吳嘉倩）？— Banson/Patty 確認後回填。",
  },
};

export function getEntityInfo(buId: string): BuEntityInfo | undefined {
  return ENTITY_MAP[buId];
}
