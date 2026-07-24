import { differenceInCalendarDays } from "date-fns";
import { parseDateOnly } from "@/lib/report-date";

/**
 * T4 信義止損觀察 — 2026-07-20 定調會決議。
 * 【口述】標記者為定調會口頭數字，待 Patty 以明細帳核實。
 * 【示意】標記者為暫用判定值，由 Banson 校準後修改。
 */

export const OBSERVATION_START = "2026-07-20";
export const CHECKPOINTS = ["2026-08-20", "2026-09-20"] as const;

/** 月燒（元/月）【口述，待 Patty 核實】 */
export const MONTHLY_BURN_VERBAL = 140_000;

/** 沉沒成本【口述】：千萬級，精確數字待 Patty 提供（null = 盤點中） */
export const SUNK_COST: number | null = null;

export interface StopLossThreshold {
  id: string;
  name: string;
  /** 判定線【示意】 */
  line: string;
  /** 手動維護：pass / fail / pending */
  status: "pass" | "fail" | "pending";
}

/** 三閾值檢核（判定值【示意】，狀態手動維護） */
export const THRESHOLDS: StopLossThreshold[] = [
  {
    id: "cash-burn",
    name: "現金消耗率",
    line: "月燒 ≤ 10 萬",
    status: "pending",
  },
  {
    id: "pipeline",
    name: "案量",
    line: "觀察期內 B2B 有效開門 ≥ 2 家 或 新簽 ≥ 100 萬",
    status: "pending",
  },
  {
    id: "team",
    name: "團隊穩定度",
    line: "留任關鍵人力 ≥ 既定名單",
    status: "pending",
  },
];

export const DECISION_RULE =
  "任一檢核點三閾值未達 → 果斷止損（收掉信義），由 CEO 裁決。";

/** 觀察期即時計算（需傳入伺服器當下時間；本模組不自行取 now 以利測試） */
export function stopLossClock(now: Date) {
  const start = parseDateOnly(OBSERVATION_START);
  const daysElapsed = Math.max(0, differenceInCalendarDays(now, start));
  const checkpoints = CHECKPOINTS.map((c) => ({
    date: c,
    daysLeft: differenceInCalendarDays(parseDateOnly(c), now),
  }));
  /** 自 7/20 起累計燒錢（月燒按 30 天日割） */
  const accumulatedBurn = Math.round((MONTHLY_BURN_VERBAL / 30) * daysElapsed);
  return { daysElapsed, checkpoints, accumulatedBurn };
}
