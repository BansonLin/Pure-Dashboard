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
    return `${Math.round(amount / 10_000).toLocaleString("zh-TW")} 萬`;
  }
  return amount.toLocaleString("zh-TW");
}

/** Format integer with thousands separator. */
export function formatNumber(n: number) {
  return n.toLocaleString("zh-TW");
}

/** Format ratio 0–1 (or 0–100 if >1) as percent string. */
export function formatPercent(value: number, digits = 1) {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(digits)}%`;
}
