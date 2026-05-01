import { create } from "zustand";

type CountryStore = {
  countryOfResidence: string;
  setCountryOfResidence: (v: string) => void;
  clearCountryOfResidence: () => void;
};

export const useCountryStore = create<CountryStore>((set) => ({
  countryOfResidence: "",
  setCountryOfResidence: (v) => set({ countryOfResidence: v }),
  clearCountryOfResidence: () => set({ countryOfResidence: "" }),
}));
