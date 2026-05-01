"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "./I18nProvider";

type Lang = "en" | "ar" | "de";

type ReactQueryProviderProps = PropsWithChildren<{
  initialLang: Lang;
}>;

export default function ReactQueryProvider({
  initialLang,
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
