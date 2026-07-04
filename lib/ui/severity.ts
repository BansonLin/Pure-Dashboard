import type { RiskCategory, RiskSeverity, StatusLevel } from "@/lib/types";

/**
 * 全站唯一的 嚴重度 → 標籤/色彩 對照。
 * 「中」使用 amber-700（淺色模式對比 ≥ 4.5:1）/ dark 用 amber-400。
 */
export const SEVERITY_META: Record<
  RiskSeverity,
  { label: string; dot: string; text: string; badge: string; rank: number }
> = {
  critical: {
    label: "紅燈",
    rank: 0,
    dot: "bg-danger",
    text: "text-danger",
    badge: "bg-danger/15 text-danger border-danger/30",
  },
  high: {
    label: "高",
    rank: 1,
    dot: "bg-warning",
    text: "text-warning",
    badge: "bg-warning/15 text-warning border-warning/30",
  },
  medium: {
    label: "中",
    rank: 2,
    dot: "bg-amber-700 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-700/15 text-amber-700 dark:text-amber-400 border-amber-700/30",
  },
  low: {
    label: "低",
    rank: 3,
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground border-border",
  },
};

/** 全站唯一的 紅黃綠燈 → 色彩 對照 */
export const STATUS_META: Record<
  StatusLevel,
  { label: string; dot: string; text: string; bg: string; bar: string }
> = {
  green: {
    label: "正常",
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
    bar: "bg-success",
  },
  amber: {
    label: "注意",
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
    bar: "bg-warning",
  },
  red: {
    label: "警示",
    dot: "bg-danger",
    text: "text-danger",
    bg: "bg-danger/10",
    bar: "bg-danger",
  },
};

/** 風險分類顯示名稱 */
export const RISK_CATEGORY_LABEL: Record<RiskCategory, string> = {
  people: "人事",
  finance: "財務",
  operation: "營運",
  market: "市場",
  compliance: "法遵",
};
