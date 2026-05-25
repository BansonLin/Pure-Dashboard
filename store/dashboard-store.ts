"use client";

import { create } from "zustand";

interface DashboardState {
  /** 側邊欄收合狀態（行動裝置會用） */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  /** 已展開檢視的風險 ID（首頁清單會用） */
  expandedRiskId: string | null;
  setExpandedRiskId: (id: string | null) => void;

  /** 目前選擇的時間區間（保留欄位，階段一暫不切換） */
  range: "ytd" | "qtd" | "mtd";
  setRange: (range: "ytd" | "qtd" | "mtd") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  expandedRiskId: null,
  setExpandedRiskId: (id) => set({ expandedRiskId: id }),

  range: "ytd",
  setRange: (range) => set({ range }),
}));
