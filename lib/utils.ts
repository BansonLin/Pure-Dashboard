import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as TWD with 萬 / 億 suffix. e.g. 80000000 → "8,000 萬" */
export function formatTwd(amount: number, opts: { compact?: boolean } = {}) {
  const { compact = true } = opts;
  if (!compact) {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  if (Math.abs(amount) >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(2)} 億`;
  }
  if (Math.abs(amount) >= 10_000) {
    const wan = amount / 10_000;
    // 100 萬以下且非整數 → 保留一位小數（如 31.5 萬），避免小額失真
    if (Math.abs(wan) < 100 && !Number.isInteger(wan)) {
      return `${wan.toFixed(1)} 萬`;
    }
    return `${Math.round(wan).toLocaleString("zh-TW")} 萬`;
  }
  return amount.toLocaleString("zh-TW");
}

/** Format integer with thousands separator. */
export function formatNumber(n: number) {
  return n.toLocaleString("zh-TW");
}

/** Format a 0–1 ratio as percent string（超過 1 = 超過 100%，照實顯示）. */
export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}
