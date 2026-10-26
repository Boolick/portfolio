"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import type { Project } from "../model/types";
import { resolveProjectImage } from "../lib/resolve-project-image";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 1 }: ProjectCardProps) {
  const { lang, t } = useLanguage();
  const title = pickLocale(project, "title", lang);
  const description = pickLocale(project, "description", lang);
  const imageSrc = resolveProjectImage(project.slug, project.image_url);
  const num = String(index).padStart(2, "0");

  return (
    <article className="border border-border bg-card flex flex-col">
      {/* Project Header Bar */}
      <div className="border-b border-border px-6 py-4 flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            {num}
          </span>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-foreground tracking-[-0.02em]">
            {title}
          </h3>
        </div>

        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("Production System", "Продакшн-система")}
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border last:border-b-0">
        {/* Left: Project Visual */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border p-6 bg-background/40">
          <Link
            href={`/projects/${project.slug}`}
            className="block border border-border bg-muted overflow-hidden relative aspect-[16/10] group"
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                width={1280}
                height={800}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-wider">
                {project.slug}
              </div>
            )}
          </Link>
        </div>

        {/* Right: Engineering Spec Sheet */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t("Engineering Overview", "Инженерное описание")}
              </div>
              <p className="font-sans text-sm sm:text-base text-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                {t("Technical Stack", "Технический стек")}
              </div>
              <div className="font-mono text-xs text-foreground leading-relaxed">
                {t("Stack:", "Стек:")} {project.tags.join(" | ")}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider font-bold hover:opacity-90"
              >
                <span>{t("Live System", "Открыть проект")}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t("Internal Architecture", "Внутренняя система")}
              </span>
            )}

            <Link
              href={`/projects/${project.slug}`}
              className="tactile-btn inline-flex items-center gap-2 px-4 py-2 border border-border bg-background text-foreground font-mono text-xs uppercase tracking-wider font-bold hover:border-primary hover:text-primary"
            >
              <span>{t("Case Study", "Подробный разбор")}</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
