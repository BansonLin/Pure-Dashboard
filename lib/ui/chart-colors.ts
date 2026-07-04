import type { BuId } from "@/lib/types";

/**
 * BU 識別色 — 純 UI 資產，與資料層分離。
 * 真 API 不會回傳顏色，所以顏色由前端依 BU id 對照。
 * 中間色調在 light / dark 兩種模式下都有足夠對比。
 */
export const BU_COLORS: Record<BuId, string> = {
  "design-yilan": "#0d9488", // teal-600
  "design-xinyi": "#d97706", // amber-600
  "pure-house": "#6366f1",   // indigo-500
  "pu-yu": "#ef4444",        // red-500
  "wayhome": "#10b981",      // emerald-500
  "homatch": "#8b5cf6",      // violet-500
};

export function buColor(id: BuId | string): string {
  return BU_COLORS[id as BuId] ?? "#78716c"; // fallback: stone-500
}

/** 原物料指數線圖用色 */
export const MATERIAL_COLORS: Record<string, string> = {
  鋁料: "#dc2626",       // red-600
  鋼材: "#ea580c",       // orange-600
  板材: "#b45309",       // amber-700
  系統櫃面料: "#7c3aed", // violet-600
  油漆: "#0ea5e9",       // sky-500
};
