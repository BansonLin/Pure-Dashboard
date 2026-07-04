/**
 * 資料存取層 — UI 與資料來源之間的唯一介面。
 *
 * 階段二：所有函式包裝 /lib/mock 的同步資料。
 * 階段三：把各函式實作換成 API fetch（維持相同簽名），呼叫端零改動。
 *
 * 規則：
 * - app/ 與 components/ 一律 import 這裡，不得直接 import lib/mock
 * - 回傳值是「顯示就緒」的 view model（BU 名稱等已解析），
 *   widget 不需要再查表
 */

import type {
  ActionItem,
  AgingBucket,
  BusinessUnit,
  BuId,
  CashFlowNode,
  MaterialIndexPoint,
  OrgStructure,
  Person,
  PnlRow,
  Project,
  RiskItem,
} from "@/lib/types";

import { BUSINESS_UNITS, BU_MAP } from "@/lib/mock/bu-data";
import {
  MONTHLY_REVENUE,
  getGroupMonthlyRevenue,
  getRevenueChartData,
} from "@/lib/mock/revenue-data";
import {
  AR_AGING,
  AP_AGING,
  CASH_FLOW,
  MATERIAL_INDEX,
  getBuMonthlyPnl,
  getGroupMonthlyPnl,
  getGroupYtdPnl,
} from "@/lib/mock/finance-data";
import { getProjectsByBu } from "@/lib/mock/project-data";
import {
  ORG_STRUCTURE,
  buildOrgTree,
  getAllPeople,
  getAtRiskPeople,
  getGmSpanOfControl,
  getTotalHeadcount,
  type OrgNode,
} from "@/lib/mock/org-data";
import {
  getRiskCounts,
  getRisksByBu,
  getTopActions,
  getUnresolvedRisks,
} from "@/lib/mock/risk-data";

// ---------- View models ----------

export interface BuSeries {
  id: BuId;
  name: string;
}

export interface ActionItemView extends ActionItem {
  buName: string;
}

export interface RiskItemView extends RiskItem {
  buName: string;
}

export interface PersonView extends Person {
  buName?: string;
  crossBuNames: string[];
}

function buName(buId?: BuId | "group"): string {
  return buId && buId !== "group" ? (BU_MAP[buId]?.name ?? "集團") : "集團";
}

function toActionView(a: ActionItem): ActionItemView {
  return { ...a, buName: buName(a.buId) };
}

function toRiskView(r: RiskItem): RiskItemView {
  return { ...r, buName: buName(r.buId) };
}

function toPersonView(p: Person): PersonView {
  return {
    ...p,
    buName: p.buId ? BU_MAP[p.buId]?.name : undefined,
    crossBuNames:
      p.crossBuIds?.map((id) => BU_MAP[id]?.name).filter(Boolean) ?? [],
  };
}

// ---------- BU ----------

export async function fetchBusinessUnits(): Promise<BusinessUnit[]> {
  return BUSINESS_UNITS;
}

export async function fetchBu(id: string): Promise<BusinessUnit | undefined> {
  return BU_MAP[id];
}

/** 圖表 / 側欄用的 BU 序列（id + 名稱；顏色由 UI 層 buColor() 對照） */
export async function fetchBuSeries(): Promise<BuSeries[]> {
  return BUSINESS_UNITS.map((b) => ({ id: b.id, name: b.name }));
}

/** 該 BU 涉及的人員：主要編制 + 跨部門兼職支援 */
export async function fetchBuPeople(buId: string): Promise<PersonView[]> {
  return getAllPeople()
    .filter((p) => {
      const cross = (p.crossBuIds ?? []) as readonly string[];
      return p.buId === buId || cross.includes(buId);
    })
    .map(toPersonView);
}

// ---------- Revenue ----------

export interface GroupRevenueSummary {
  /** 當月營收 */
  currentMonth: number;
  /** 對上月增減率（-1~1 ratio） */
  momRatio: number;
  /** 當月標籤，如 "2026 年 5 月" */
  monthLabel: string;
}

export async function fetchGroupRevenueSummary(): Promise<GroupRevenueSummary> {
  const current = getGroupMonthlyRevenue();
  const prev = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];
  const prevSum = Object.values(prev.values).reduce((s, v) => s + v, 0);
  const last = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const [y, m] = last.month.split("-").map(Number);
  return {
    currentMonth: current,
    momRatio: prevSum > 0 ? (current - prevSum) / prevSum : 0,
    monthLabel: `${y} 年 ${m} 月`,
  };
}

export async function fetchRevenueChartData(): Promise<
  Array<Record<string, number | string>>
> {
  return getRevenueChartData();
}

// ---------- Finance ----------

export async function fetchGroupMonthlyPnl(): Promise<PnlRow[]> {
  return getGroupMonthlyPnl();
}

export async function fetchGroupYtdPnl() {
  return getGroupYtdPnl();
}

export async function fetchBuMonthlyPnl(buId: BuId): Promise<PnlRow[]> {
  return getBuMonthlyPnl(buId);
}

export interface CashFlowView {
  nodes: CashFlowNode[];
  opening: number;
  closing: number;
}

export async function fetchCashFlow(): Promise<CashFlowView> {
  return {
    nodes: CASH_FLOW,
    opening: CASH_FLOW[0].amount,
    closing: CASH_FLOW[CASH_FLOW.length - 1].amount,
  };
}

export async function fetchArAging(): Promise<AgingBucket[]> {
  return AR_AGING;
}

export async function fetchApAging(): Promise<AgingBucket[]> {
  return AP_AGING;
}

export interface MaterialIndexView {
  points: MaterialIndexPoint[];
  /** 最新一期各原物料指數 */
  latest: Record<string, number>;
}

export async function fetchMaterialIndex(): Promise<MaterialIndexView> {
  return {
    points: MATERIAL_INDEX,
    latest: MATERIAL_INDEX[MATERIAL_INDEX.length - 1].values,
  };
}

// ---------- Projects ----------

export async function fetchProjectsByBu(buId: BuId): Promise<Project[]> {
  return getProjectsByBu(buId);
}

// ---------- Org ----------

export async function fetchOrgStructure(): Promise<OrgStructure> {
  return ORG_STRUCTURE;
}

export async function fetchOrgTree(): Promise<OrgNode> {
  return buildOrgTree();
}

export async function fetchHeadcount() {
  return getTotalHeadcount();
}

export async function fetchAtRiskPeople(): Promise<PersonView[]> {
  return getAtRiskPeople().map(toPersonView);
}

export async function fetchGmSpanOfControl() {
  return getGmSpanOfControl();
}

export async function fetchPeopleRows(): Promise<PersonView[]> {
  return getAllPeople().map(toPersonView);
}

// ---------- Risk ----------

export async function fetchRiskCounts() {
  return getRiskCounts();
}

export async function fetchUnresolvedRisks(): Promise<RiskItemView[]> {
  return getUnresolvedRisks().map(toRiskView);
}

export async function fetchTopActions(limit = 5): Promise<ActionItemView[]> {
  return getTopActions(limit).map(toActionView);
}

export async function fetchRisksByBu(buId: string): Promise<RiskItemView[]> {
  return getRisksByBu(buId).map(toRiskView);
}

export type { OrgNode };
