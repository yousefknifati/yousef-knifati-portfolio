"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { useI18n } from "@/providers/I18nProvider";

import ProjectCard, { type ProjectCardData } from "./ProjectCard";

const projectDefinitions = [
  {
    key: "fintech",
    imagePosition: "right",
    images: [
      "/projects/fintech-design-system.jpg",
      "/projects/crocowallet.jpg",
      "/projects/crypto-portfolio.jpg",
    ],
  },
  {
    key: "wallet",
    imagePosition: "left",
    images: [
      "/projects/crocowallet.jpg",
      "/projects/crypto-portfolio.jpg",
      "/projects/fintech-design-system.jpg",
    ],
  },
] as const;

export default function SelectedWorksSection() {
  const { t, dir } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const projects: ProjectCardData[] = projectDefinitions.map((project) => ({
    category: t(`home.projects.${project.key}.category`),
    title: t(`home.projects.${project.key}.title`),
    description: t(`home.projects.${project.key}.description`),
    tags: [
      t(`home.projects.${project.key}.tagOne`),
      t(`home.projects.${project.key}.tagTwo`),
      t(`home.projects.${project.key}.tagThree`),
    ],
    images: project.images.map((src, index) => ({
      src,
      alt: t(`home.projects.${project.key}.imageAlt${index + 1}`),
    })),
    href: "#contact",
    imagePosition: project.imagePosition,
    textDirection: "inherit",
  }));

  return (
    <section id="work" className="bg-portfolio-surface px-6 py-20 text-white sm:px-10 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-20 flex flex-wrap items-end justify-between gap-8"
        >
          <div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t("home.projects.title")}
            </h2>
            <p className="mt-4 text-xs uppercase tracking-widest text-portfolio-muted">
              {t("home.projects.subtitle")}
            </p>
          </div>
          <Link
            href="#contact"
            className="text-xs text-portfolio-accent transition-colors hover:text-portfolio-accent-hover"
          >
            {t("home.projects.seeAll")}
          </Link>
        </motion.div>

        <div className="space-y-24 lg:space-y-32">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              carouselDirection={dir}
              viewCaseLabel={t("home.projects.viewCase")}
              tagsLabel={t("home.projects.tagsLabel")}
              previousLabel={t("home.projects.previousImage")}
              nextLabel={t("home.projects.nextImage")}
              slideLabel={(index) => `${t("home.projects.showImage")} ${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
