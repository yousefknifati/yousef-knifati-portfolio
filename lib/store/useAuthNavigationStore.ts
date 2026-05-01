import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthNavigationStore = {
  authBackHref: string;
  setAuthBackHref: (href: string) => void;
  resetAuthBackHref: () => void;
};

export const useAuthNavigationStore = create<AuthNavigationStore>()(
  persist(
    (set) => ({
      authBackHref: "/",
      setAuthBackHref: (href) =>
        set({
          authBackHref: href.trim() || "/",
        }),
      resetAuthBackHref: () =>
        set({
          authBackHref: "/",
        }),
    }),
    {
      name: "auth-navigation-store",
    },
  ),
);
