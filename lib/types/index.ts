// Centralized domain types for 璞石集團儀表板

export type BuId =
  | "design-yilan"
  | "design-xinyi"
  | "pure-house"
  | "pu-yu"
  | "wayhome"
  | "homatch";

export type StatusLevel = "green" | "amber" | "red";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type RiskCategory = "people" | "finance" | "operation" | "market" | "compliance";

export interface BusinessUnit {
  id: BuId;
  name: string;          // 中文簡稱
  fullName: string;      // 完整名稱
  category: "interior" | "renovation" | "marketing" | "retail" | "ecommerce";
  ownership: "direct" | "franchise" | "subsidiary";
  /** 年度營收目標（新台幣，元） */
  annualTarget: number;
  /** YTD 累計營收（新台幣，元） */
  ytdRevenue: number;
  /** 當月營收（新台幣，元） */
  monthlyRevenue: number;
  /** 進行中專案 / 訂單數 */
  activeProjects: number;
  /** 員工數 */
  headcount: number;
  status: StatusLevel;
  /** 紅黃綠燈狀態的解釋（為什麼是這個顏色） */
  statusReason: string[];
  /** 一句話現況描述 */
  note?: string;
}

export interface MonthlyRevenuePoint {
  /** ISO month e.g. "2026-01" */
  month: string;
  /** 標籤顯示，e.g. "1 月" */
  label: string;
  /** 各 BU 該月營收 */
  values: Record<BuId, number>;
}

/** 單一 BU 單一月份的損益（單位：元） */
export interface PnlRow {
  month: string;          // "2026-01"
  label: string;          // "1 月"
  revenue: number;
  cost: number;           // 直接成本（材料 + 工資 + 外包）
  opex: number;           // 營業費用
  /** 衍生欄位由 utils 計算：grossProfit / grossMargin / netIncome */
}

export interface Project {
  id: string;
  buId: BuId;
  name: string;
  client: string;
  owner: string;
  /** 0–100 */
  progress: number;
  /** 預計完工日 */
  dueAt: string;
  /** 合約金額（元） */
  contractAmount: number;
  /** 毛利率 0–1 */
  grossMargin: number;
  status: StatusLevel;
}

export type EmploymentStatus = "active" | "acting" | "vacant" | "cross-functional";

export interface Person {
  id: string;
  name: string;
  title: string;
  department: string;
  status: EmploymentStatus;
  /** 職等 1–10 */
  grade?: number;
  /** 任職起始日 */
  joinedAt?: string;
  /** 主要所屬 BU */
  buId?: BuId;
  /** 兼職的其他 BU */
  crossBuIds?: BuId[];
  note?: string;
}

export interface Department {
  id: string;
  name: string;
  head?: Person;
  members: Person[];
  /** 編制人數 */
  headcountTarget: number;
  /** 實際在職 */
  headcountActual: number;
}

export interface OrgStructure {
  ceo: Person;
  gm: Person;
  departments: Department[];
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  owner?: string;
  buId?: BuId | "group";
  category: RiskCategory;
  createdAt: string;
  /** 預計處理期限 */
  dueAt?: string;
  /** 建議行動 */
  action?: string;
  /** 影響度 1–5 */
  impact: number;
  /** 發生機率 1–5 */
  probability: number;
  resolved?: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  severity: RiskSeverity;
  owner?: string;
  buId?: BuId | "group";
  dueAt?: string;
}

/** 集團現金流 - 瀑布圖節點 */
export interface CashFlowNode {
  label: string;
  /** 正數為流入、負數為流出，"total" 類型表示小計（顯示為實體柱） */
  amount: number;
  type: "in" | "out" | "total";
}

/** 應收 / 應付 Aging */
export interface AgingBucket {
  label: string;      // "0–30 天"
  amount: number;
  /** 風險等級 */
  level: StatusLevel;
}

/** 原物料價格指數 */
export interface MaterialIndexPoint {
  month: string;
  label: string;
  /** 各原物料相對於 2025/12 的指數（100 = 基準） */
  values: Record<string, number>;
}

