"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { cn } from "@/lib/utils/cn";

import ProjectCarousel, { type ProjectImage } from "./ProjectCarousel";

export type ProjectCardData = {
  category: string;
  title: string;
  description: string;
  tags: string[];
  images: ProjectImage[];
  href: string;
  imagePosition?: "left" | "right";
  textDirection?: "inherit" | "ltr" | "rtl";
};

type ProjectCardProps = {
  project: ProjectCardData;
  viewCaseLabel: string;
  tagsLabel: string;
  previousLabel: string;
  nextLabel: string;
  slideLabel: (index: number) => string;
  carouselDirection: "ltr" | "rtl";
};

export default function ProjectCard({
  project,
  viewCaseLabel,
  tagsLabel,
  previousLabel,
  nextLabel,
  slideLabel,
  carouselDirection,
}: ProjectCardProps) {
  const isImageFirst = project.imagePosition === "left";
  const dir = project.textDirection === "inherit" ? undefined : project.textDirection;
  const prefersReducedMotion = useReducedMotion();
  const revealFromX = project.imagePosition === "left" ? 30 : -30;

  return (
    <article className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <motion.div
        dir={dir}
        initial={prefersReducedMotion ? false : { opacity: 0, x: revealFromX, y: 18 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className={cn(
          "flex flex-col items-start",
          isImageFirst && "lg:order-2",
          project.textDirection === "rtl" && "items-end text-end",
        )}
      >
        <p className="text-xs uppercase tracking-widest text-portfolio-accent">
          {project.category}
        </p>
        <h3 className="mt-5 max-w-lg text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-md text-sm leading-6 text-portfolio-muted">
          {project.description}
        </p>
        <ul className="mt-8 flex flex-wrap gap-3" aria-label={tagsLabel}>
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-portfolio-border px-4 py-2 text-xs uppercase text-portfolio-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
        <Link
          href={project.href}
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-white px-7 py-4 text-sm font-medium text-portfolio-surface transition-colors hover:bg-white/85"
        >
          {viewCaseLabel}
          <FiArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, x: -revealFromX, scale: 0.98 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className={cn(isImageFirst && "lg:order-1")}
      >
        <ProjectCarousel
          images={project.images}
          direction={carouselDirection}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          slideLabel={slideLabel}
        />
      </motion.div>
    </article>
  );
}
