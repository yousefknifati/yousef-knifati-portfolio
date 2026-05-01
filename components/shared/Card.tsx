"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type CategoryCardProps = {
  title: string;
  positions: number;
  icon: React.ReactNode;
  className?: string;
};

const bgVariants = {
  rest: { scaleY: 0 },
  hover: { scaleY: 1 },
};

const iconVariants = {
  rest: { rotateY: 0 },
  hover: { rotateY: 180 },
};

const CategoryCard = ({
  title,
  positions,
  icon,
  className,
}: CategoryCardProps) => {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn(
        "group relative overflow-hidden",
        "flex flex-col items-center justify-center text-center cursor-pointer",
        "rounded-md border border-secondary-light-hover bg-white",
        "px-6 py-6",
        "transition-all duration-400  hover:shadow-md",
        className
      )}
      style={{ perspective: 1000 }}
    >
      {/* Solid BG wipe from top -> bottom */}
      <motion.span
        aria-hidden="true"
        variants={bgVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 origin-top bg-primary-normal"
        style={{ transformOrigin: "top" }}
      />

      <motion.div
        variants={iconVariants}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="relative z-10 mb-6 text-primary-normal transition-colors duration-200 group-hover:text-white"
        style={{ transformStyle: "preserve-3d" }}
      >
        {icon}
      </motion.div>

      <h3 className="relative z-10 text-xl font-bold text-primary-darker transition-colors duration-200 group-hover:text-white">
        {title}
      </h3>

      <div className="relative z-10 mt-7 inline-flex items-center justify-center rounded-md bg-primary-light px-5 py-2 text-sm text-primary-dark transition-colors duration-200 group-hover:bg-white/15 group-hover:text-white">
        {positions} Positions
      </div>
    </motion.div>
  );
};

export default CategoryCard;
