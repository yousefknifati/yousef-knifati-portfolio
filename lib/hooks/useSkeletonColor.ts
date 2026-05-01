"use client";

type SkeletonColors = {
  baseColor: string;
  highlightColor: string;
};

export function useSkeletonColor(): SkeletonColors {
  // Only dark mode
  return {
    baseColor: "#d4dee3",
    highlightColor: "#dcecf4",
  };
}
