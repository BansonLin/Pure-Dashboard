import type { Project, BuId } from "@/lib/types";

export const PROJECTS: Project[] = [
  // ===== 璞石宜蘭 =====
  {
    id: "prj-y-01", buId: "design-yilan",
    name: "礁溪林宅 32 坪全室",
    client: "林先生", owner: "陳怡安",
    progress: 78, dueAt: "2026-06-20",
    contractAmount: 3_800_000, grossMargin: 0.36, status: "green",
  },
  {
    id: "prj-y-02", buId: "design-yilan",
    name: "羅東透天 三層整建",
    client: "黃太太", owner: "許舒婷",
    progress: 45, dueAt: "2026-08-15",
    contractAmount: 6_200_000, grossMargin: 0.34, status: "amber",
  },
  {
    id: "prj-y-03", buId: "design-yilan",
    name: "宜蘭市張宅 25 坪",
    client: "張先生", owner: "林彥廷",
    progress: 92, dueAt: "2026-06-05",
    contractAmount: 2_400_000, grossMargin: 0.40, status: "green",
  },
  {
    id: "prj-y-04", buId: "design-yilan",
    name: "蘇澳濱海民宿",
    client: "海風民宿", owner: "陳怡安",
    progress: 22, dueAt: "2026-09-30",
    contractAmount: 5_100_000, grossMargin: 0.30, status: "amber",
  },
  {
    id: "prj-y-05", buId: "design-yilan",
    name: "員山陳宅 18 坪",
    client: "陳小姐", owner: "黃靖雯",
    progress: 60, dueAt: "2026-07-10",
    contractAmount: 1_900_000, grossMargin: 0.38, status: "green",
  },
  {
    id: "prj-y-06", buId: "design-yilan",
    name: "頭城海景豪宅 45 坪",
    client: "王董事長", owner: "許舒婷",
    progress: 15, dueAt: "2026-11-20",
    contractAmount: 8_400_000, grossMargin: 0.33, status: "amber",
  },

  // ===== 璞石信義 =====
  {
    id: "prj-x-01", buId: "design-xinyi",
    name: "信義路精品店面改裝",
    client: "Atelier 品牌", owner: "張可昕",
    progress: 55, dueAt: "2026-06-30",
    contractAmount: 4_200_000, grossMargin: 0.32, status: "amber",
  },
  {
    id: "prj-x-02", buId: "design-xinyi",
    name: "大安區李宅 28 坪",
    client: "李醫師", owner: "陳又暐",
    progress: 38, dueAt: "2026-08-01",
    contractAmount: 3_600_000, grossMargin: 0.30, status: "red",
  },
  {
    id: "prj-x-03", buId: "design-xinyi",
    name: "南京東路辦公室翻新",
    client: "明達科技", owner: "陳又暐",
    progress: 70, dueAt: "2026-07-15",
    contractAmount: 5_400_000, grossMargin: 0.36, status: "amber",
  },
  {
    id: "prj-x-04", buId: "design-xinyi",
    name: "松山機場周邊小宅 15 坪",
    client: "鄭小姐", owner: "李宇恩",
    progress: 85, dueAt: "2026-06-12",
    contractAmount: 1_500_000, grossMargin: 0.41, status: "green",
  },

  // ===== 璞石好室 =====
  {
    id: "prj-h-01", buId: "pure-house",
    name: "羅東小坪數輕裝修 ×6 戶",
    client: "幸福建設集合住宅", owner: "工務組",
    progress: 65, dueAt: "2026-07-05",
    contractAmount: 4_800_000, grossMargin: 0.44, status: "green",
  },
  {
    id: "prj-h-02", buId: "pure-house",
    name: "新北市 12 戶廚衛翻修",
    client: "永慶不動產代管", owner: "工務組",
    progress: 50, dueAt: "2026-08-20",
    contractAmount: 3_600_000, grossMargin: 0.42, status: "green",
  },
  {
    id: "prj-h-03", buId: "pure-house",
    name: "宜蘭老屋油漆改造 ×4 戶",
    client: "個人客戶", owner: "工務組",
    progress: 88, dueAt: "2026-06-01",
    contractAmount: 1_400_000, grossMargin: 0.46, status: "green",
  },

  // ===== 璞域國際 =====
  {
    id: "prj-p-01", buId: "pu-yu",
    name: "「綠映礁溪」建案行銷代理",
    client: "綠映建設", owner: "外包：策略夥伴",
    progress: 75, dueAt: "2026-07-30",
    contractAmount: 5_200_000, grossMargin: 0.55, status: "amber",
  },
  {
    id: "prj-p-02", buId: "pu-yu",
    name: "「璞園信義」品牌升級",
    client: "璞園建築", owner: "外包：4A 代理商",
    progress: 60, dueAt: "2026-06-30",
    contractAmount: 3_400_000, grossMargin: 0.50, status: "amber",
  },
  {
    id: "prj-p-03", buId: "pu-yu",
    name: "「海觀邸」公關活動",
    client: "海觀建設", owner: "Banson 兼辦",
    progress: 95, dueAt: "2026-05-30",
    contractAmount: 1_800_000, grossMargin: 0.58, status: "green",
  },
  {
    id: "prj-p-04", buId: "pu-yu",
    name: "「悅讀宜蘭」聯名行銷",
    client: "悅讀建設", owner: "Banson 兼辦",
    progress: 40, dueAt: "2026-08-15",
    contractAmount: 2_400_000, grossMargin: 0.52, status: "red",
  },

  // ===== Wayhome =====
  {
    id: "prj-w-01", buId: "wayhome",
    name: "宜蘭門市 Q2 聯名商品上架",
    client: "Wayhome 宜蘭店", owner: "店長",
    progress: 70, dueAt: "2026-06-15",
    contractAmount: 1_800_000, grossMargin: 0.48, status: "green",
  },

  // ===== Homatch =====
  // 電商以營運為主，不列專案
];

export function getProjectsByBu(buId: BuId): Project[] {
  return PROJECTS.filter((p) => p.buId === buId);
}
