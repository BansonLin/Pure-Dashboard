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
  /** 一句話現況描述 */
  note?: string;
  /** 主視覺色 - tailwind hue token，用於圖表辨識 */
  accentHex: string;
}

export interface MonthlyRevenuePoint {
  /** ISO month e.g. "2026-01" */
  month: string;
  /** 標籤顯示，e.g. "1 月" */
  label: string;
  /** 各 BU 該月營收 */
  values: Record<BuId, number>;
}

export interface Person {
  id: string;
  name: string;
  title: string;
  department: string;
  status: "active" | "acting" | "vacant" | "cross-functional";
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
  category: "people" | "finance" | "operation" | "market" | "compliance";
  createdAt: string;
  /** 預計處理期限 */
  dueAt?: string;
  /** 建議行動 */
  action?: string;
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
