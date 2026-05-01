import * as React from "react";

type LoaderProps = {
  className?: string;
  scale?: number;
  color?: string;
  label?: string;
};

function Loader({ className, scale = 0.25, color="#22a8ed", label = "Loading" }: LoaderProps) {
  return (
    <div
      className={["banter-loader", className].filter(Boolean).join(" ")}
      style={
        {
          ["--banter-scale" as unknown as string]: scale,
          ["--banter-color" as unknown as string]: color,
        } as React.CSSProperties
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="banter-loader__box" />
      ))}
    </div>
  );
}

export default Loader;
