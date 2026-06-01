import type { OrgStructure, Person } from "@/lib/types";

export const ORG_STRUCTURE: OrgStructure = {
  ceo: {
    id: "p-banson",
    name: "Banson Lin",
    title: "集團董事長 / CEO",
    department: "集團總部",
    status: "active",
    grade: 10,
    joinedAt: "2018-01-01",
  },
  gm: {
    id: "p-wu",
    name: "吳嘉倩",
    title: "集團總經理",
    department: "集團總部",
    status: "active",
    grade: 9,
    joinedAt: "2020-03-15",
    note: "統籌四大部門營運。直管 4 個部門，管理幅度偏高。",
  },
  departments: [
    {
      id: "dept-design-yilan",
      name: "設計部 - 宜蘭",
      headcountTarget: 13,
      headcountActual: 12,
      head: {
        id: "p-design-yilan-head",
        name: "許舒婷",
        title: "設計部主管（暫代）",
        department: "設計部 - 宜蘭",
        status: "acting",
        grade: 7,
        joinedAt: "2022-06-01",
        buId: "design-yilan",
        note: "暫代主管職位三個月，尚未轉正。",
      },
      members: [
        {
          id: "p-d1", name: "陳怡安", title: "資深設計師",
          department: "設計部 - 宜蘭", status: "active",
          grade: 6, joinedAt: "2021-03-10", buId: "design-yilan",
        },
        {
          id: "p-d2", name: "林彥廷", title: "設計師",
          department: "設計部 - 宜蘭", status: "active",
          grade: 5, joinedAt: "2023-08-15", buId: "design-yilan",
        },
        {
          id: "p-d3", name: "黃靖雯", title: "助理設計師",
          department: "設計部 - 宜蘭", status: "active",
          grade: 3, joinedAt: "2025-02-01", buId: "design-yilan",
        },
        {
          id: "p-d4", name: "工務團隊（4 人）", title: "工務 ×4",
          department: "設計部 - 宜蘭", status: "active",
          grade: 4, buId: "design-yilan",
        },
        {
          id: "p-d5", name: "繪圖 / 行政（3 人）", title: "支援 ×3",
          department: "設計部 - 宜蘭", status: "active",
          grade: 3, buId: "design-yilan",
        },
      ],
    },
    {
      id: "dept-design-xinyi",
      name: "設計部 - 信義",
      headcountTarget: 9,
      headcountActual: 5,
      head: {
        id: "p-design-xinyi-head",
        name: "張可昕",
        title: "設計部副主管",
        department: "設計部 - 信義",
        status: "active",
        grade: 6,
        joinedAt: "2023-01-10",
        buId: "design-xinyi",
        note: "主管職從缺，由副主管暫掌業務。",
      },
      members: [
        {
          id: "p-x1", name: "陳又暐", title: "設計師（兼）",
          department: "設計部 - 信義", status: "cross-functional",
          grade: 5, joinedAt: "2022-09-15",
          buId: "design-xinyi", crossBuIds: ["design-yilan"],
          note: "同時支援宜蘭專案，每週北上兩天。",
        },
        {
          id: "p-x2", name: "李宇恩", title: "助理設計師",
          department: "設計部 - 信義", status: "active",
          grade: 3, joinedAt: "2024-11-01", buId: "design-xinyi",
        },
        {
          id: "p-x3", name: "工務團隊（2 人）", title: "工務 ×2",
          department: "設計部 - 信義", status: "active",
          grade: 4, buId: "design-xinyi",
        },
      ],
    },
    {
      id: "dept-marketing",
      name: "行銷企劃部",
      headcountTarget: 4,
      headcountActual: 0,
      head: undefined,
      members: [],
    },
    {
      id: "dept-admin",
      name: "行政財會部",
      headcountTarget: 5,
      headcountActual: 4,
      head: {
        id: "p-admin-head",
        name: "蔡明慧",
        title: "行政財會主管",
        department: "行政財會部",
        status: "active",
        grade: 7,
        joinedAt: "2019-05-01",
      },
      members: [
        {
          id: "p-a1", name: "周詠茹", title: "會計（同時負責 6 個 BU）",
          department: "行政財會部", status: "cross-functional",
          grade: 5, joinedAt: "2021-08-10",
          crossBuIds: ["design-yilan", "design-xinyi", "pure-house", "pu-yu", "wayhome", "homatch"],
          note: "六大 BU 月結均由其一人負責、平均 12 工作日才結出。",
        },
        {
          id: "p-a2", name: "吳承翰", title: "人資 / 行政",
          department: "行政財會部", status: "active",
          grade: 4, joinedAt: "2023-04-20",
        },
        {
          id: "p-a3", name: "助理（1 人）", title: "行政助理",
          department: "行政財會部", status: "active",
          grade: 2,
        },
      ],
    },
  ],
};

export function getTotalHeadcount(): { actual: number; target: number } {
  const actual = ORG_STRUCTURE.departments.reduce(
    (s, d) => s + d.headcountActual,
    0,
  );
  const target = ORG_STRUCTURE.departments.reduce(
    (s, d) => s + d.headcountTarget,
    0,
  );
  return { actual, target };
}

/** 取得所有可顯示的人員（含主管） */
export function getAllPeople(): Person[] {
  const all: Person[] = [];
  for (const dept of ORG_STRUCTURE.departments) {
    if (dept.head) all.push(dept.head);
    all.push(...dept.members);
  }
  return all;
}

/** 計算任職時長（年） */
export function tenureYears(joinedAt: string | undefined, today = "2026-05-25"): number | null {
  if (!joinedAt) return null;
  const t = new Date(today).getTime();
  const j = new Date(joinedAt).getTime();
  return Math.max(0, (t - j) / (365.25 * 24 * 60 * 60 * 1000));
}

/** 篩出有「異常狀態」的人員 */
export function getAtRiskPeople() {
  return getAllPeople().filter(
    (p) =>
      p.status === "acting" ||
      p.status === "cross-functional" ||
      p.status === "vacant",
  );
}

/** 部門總管 → 直管部門數，用於管理幅度警示 */
export function getGmSpanOfControl(): {
  span: number;
  threshold: number;
  warning: boolean;
  buIds: string[];
} {
  const span = ORG_STRUCTURE.departments.length;
  return {
    span,
    threshold: 3,
    warning: span > 3,
    buIds: ORG_STRUCTURE.departments.map((d) => d.id),
  };
}

/** 用於組織樹排版的型別 */
export interface OrgNode {
  id: string;
  label: string;
  sub?: string;
  /** "person" / "dept" / "ceo" */
  kind: "ceo" | "gm" | "dept" | "person";
  /** 該節點是否標記紅框（暫代 / 兼職 / 空缺 / 過載） */
  flag?: "acting" | "cross" | "vacant" | "overloaded";
  children?: OrgNode[];
  meta?: string;
}

/** 整理為樹狀結構供 OrgChart 元件渲染 */
export function buildOrgTree(): OrgNode {
  const span = getGmSpanOfControl();
  return {
    id: ORG_STRUCTURE.ceo.id,
    label: ORG_STRUCTURE.ceo.name,
    sub: ORG_STRUCTURE.ceo.title,
    kind: "ceo",
    children: [
      {
        id: ORG_STRUCTURE.gm.id,
        label: ORG_STRUCTURE.gm.name,
        sub: ORG_STRUCTURE.gm.title,
        kind: "gm",
        flag: span.warning ? "overloaded" : undefined,
        meta: span.warning ? `直管 ${span.span} 部門，超出健康上限 ${span.threshold}` : undefined,
        children: ORG_STRUCTURE.departments.map((d) => ({
          id: d.id,
          label: d.name,
          sub: `${d.headcountActual} / ${d.headcountTarget} 人`,
          kind: "dept" as const,
          flag:
            d.headcountActual === 0
              ? ("vacant" as const)
              : d.headcountActual < d.headcountTarget
                ? ("vacant" as const)
                : undefined,
          meta:
            d.headcountActual === 0
              ? "目前由總管理處與 Banson 兼辦相關事務"
              : undefined,
          children: [
            ...(d.head
              ? [
                  {
                    id: d.head.id,
                    label: d.head.name,
                    sub: d.head.title,
                    kind: "person" as const,
                    flag:
                      d.head.status === "acting"
                        ? ("acting" as const)
                        : d.head.status === "cross-functional"
                          ? ("cross" as const)
                          : undefined,
                    meta: d.head.note,
                  },
                ]
              : []),
            ...d.members.map((m) => ({
              id: m.id,
              label: m.name,
              sub: m.title,
              kind: "person" as const,
              flag:
                m.status === "acting"
                  ? ("acting" as const)
                  : m.status === "cross-functional"
                    ? ("cross" as const)
                    : m.status === "vacant"
                      ? ("vacant" as const)
                      : undefined,
              meta: m.note,
            })),
          ],
        })),
      },
    ],
  };
}
