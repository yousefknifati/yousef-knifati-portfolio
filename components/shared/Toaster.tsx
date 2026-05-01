"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  const [theme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("theme") as
      | "dark"
      | "light"
      | null;

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return "dark";
  });

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: theme === "dark" ? "#1e1e1e" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          maxWidth: "420px",
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        },
        success: {
          style: {
            background: theme === "dark" ? "white" : "#16a34a",
            color: "black",
            maxWidth: "420px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          },
        },
        error: {
          style: {
            background: theme === "dark" ? "#ef4444" : "#b91c1c",
            color: "#fff",
            maxWidth: "420px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          },
        },
      }}
    />
  );
}
