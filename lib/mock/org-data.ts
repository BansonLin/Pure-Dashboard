import type { OrgStructure } from "@/lib/types";

export const ORG_STRUCTURE: OrgStructure = {
  ceo: {
    id: "p-banson",
    name: "Banson Lin",
    title: "集團董事長 / CEO",
    department: "集團總部",
    status: "active",
  },
  gm: {
    id: "p-wu",
    name: "吳嘉倩",
    title: "集團總經理",
    department: "集團總部",
    status: "active",
    note: "統籌四大部門營運。",
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
        note: "暫代主管職位三個月，尚未轉正。",
      },
      members: [
        {
          id: "p-d1",
          name: "陳怡安",
          title: "資深設計師",
          department: "設計部 - 宜蘭",
          status: "active",
        },
        {
          id: "p-d2",
          name: "林彥廷",
          title: "設計師",
          department: "設計部 - 宜蘭",
          status: "active",
        },
        {
          id: "p-d3",
          name: "黃靖雯",
          title: "助理設計師",
          department: "設計部 - 宜蘭",
          status: "active",
        },
        {
          id: "p-d4",
          name: "工務 ×4",
          title: "工務團隊",
          department: "設計部 - 宜蘭",
          status: "active",
        },
        {
          id: "p-d5",
          name: "繪圖/行政 ×3",
          title: "支援團隊",
          department: "設計部 - 宜蘭",
          status: "active",
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
        note: "主管職從缺，由副主管暫掌業務。",
      },
      members: [
        {
          id: "p-x1",
          name: "陳又暐",
          title: "設計師（兼）",
          department: "設計部 - 信義",
          status: "cross-functional",
          note: "同時支援宜蘭專案，每週北上兩天。",
        },
        {
          id: "p-x2",
          name: "李宇恩",
          title: "助理設計師",
          department: "設計部 - 信義",
          status: "active",
        },
        {
          id: "p-x3",
          name: "工務 ×2",
          title: "工務團隊",
          department: "設計部 - 信義",
          status: "active",
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
      },
      members: [
        {
          id: "p-a1",
          name: "周詠茹",
          title: "會計",
          department: "行政財會部",
          status: "active",
        },
        {
          id: "p-a2",
          name: "吳承翰",
          title: "人資 / 行政",
          department: "行政財會部",
          status: "active",
        },
        {
          id: "p-a3",
          name: "助理 ×1",
          title: "行政助理",
          department: "行政財會部",
          status: "active",
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
