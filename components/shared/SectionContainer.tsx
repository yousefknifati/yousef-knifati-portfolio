import React, { JSX } from "react";

type SectionContainerProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  padded?: boolean;
  maxWidth?: "full" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
};

const MAX_WIDTH: Record<
  NonNullable<SectionContainerProps["maxWidth"]>,
  string
> = {
  full: "max-w-none",
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
};

function SectionContainer({
  id,
  className = "",
  innerClassName = "",
  as: Tag = "section",
  padded = true,
  maxWidth = "xl",
  children,
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={["w-full", padded ? "py-16 md:py-20" : "", className].join(
        " "
      )}
    >
      <div
        className={[
          "w-full mx-auto px-10 lg:px-32", // ✅ mx-auto added
          MAX_WIDTH[maxWidth], // ✅ supports full now
          innerClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </Tag>
  );
}

export default SectionContainer;
