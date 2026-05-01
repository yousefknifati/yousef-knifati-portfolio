import { create } from "zustand";

export type TabType = "overview" | "applications";

type TabStore = {
  activeTab: TabType;
  setTab: (tab: TabType) => void;
};

export const useTabStore = create<TabStore>((set, get) => ({
  activeTab: "overview",

  setTab: (tab) => {
    if (get().activeTab === tab) return;
    set({ activeTab: tab });
  },
}));
