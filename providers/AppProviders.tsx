"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";

import ReactQueryProvider from "@/providers/ReactQueryProvider";

type Lang = "en" | "ar" | "de";

const AppToaster = dynamic(() => import("@/components/shared/Toaster"), {
  ssr: false,
  loading: () => null,
});

export default function AppProviders({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  return (
      <ReactQueryProvider initialLang={initialLang}>
        <NextTopLoader color="#1b86be" />
        {children}
        <AppToaster />
      </ReactQueryProvider>
  );
}
