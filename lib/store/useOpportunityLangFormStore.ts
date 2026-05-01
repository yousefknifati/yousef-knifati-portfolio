"use client";

import { create } from "zustand";

export type OpportunityLangTab = "en" | "ar" | "de";

type LocalizedValue = {
  en: string;
  ar: string;
  de: string;
};

type OpportunityLangFormState = {
  activeLangTab: OpportunityLangTab;
  title: LocalizedValue;
  audience: LocalizedValue[];
  setActiveLangTab: (tab: OpportunityLangTab) => void;
  reset: () => void;
  setTitleByLang: (lang: OpportunityLangTab, value: string) => void;
  setAudienceByLang: (
    index: number,
    lang: OpportunityLangTab,
    value: string,
  ) => void;
  syncEnglishAudience: (items: string[]) => void;
};

const createEmptyLocalized = (): LocalizedValue => ({
  en: "",
  ar: "",
  de: "",
});

export const useOpportunityLangFormStore = create<OpportunityLangFormState>(
  (set) => ({
    activeLangTab: "en",
    title: createEmptyLocalized(),
    audience: [],
    setActiveLangTab: (tab) => set({ activeLangTab: tab }),
    reset: () =>
      set({
        activeLangTab: "en",
        title: createEmptyLocalized(),
        audience: [],
      }),
    setTitleByLang: (lang, value) =>
      set((state) => ({
        title: {
          ...state.title,
          [lang]: value,
        },
      })),
    setAudienceByLang: (index, lang, value) =>
      set((state) => {
        const next = [...state.audience];
        while (next.length <= index) next.push(createEmptyLocalized());
        next[index] = {
          ...next[index],
          [lang]: value,
        };
        return { audience: next };
      }),
    syncEnglishAudience: (items) =>
      set((state) => {
        const next = items.map((item, idx) => {
          const prev = state.audience[idx] ?? createEmptyLocalized();
          return {
            ...prev,
            en: item,
          };
        });
        return { audience: next };
      }),
  }),
);
