"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import { openExternalUrl } from "@/shared/lib/telegram/links";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import type { Project } from "../model/types";
import { resolveProjectImageCandidates } from "../lib/resolve-project-image";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 1 }: ProjectCardProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const title = pickLocale(project, "title", lang);
  const description = pickLocale(project, "description", lang);
  const num = String(index).padStart(2, "0");

  const candidates = useMemo(
    () => resolveProjectImageCandidates(project.slug, project.image_url),
    [project.slug, project.image_url]
  );
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [prevSlug, setPrevSlug] = useState(project.slug);

  if (project.slug !== prevSlug) {
    setPrevSlug(project.slug);
    setCandidateIdx(0);
    setImgFailed(false);
  }

  const currentImageSrc = candidates[candidateIdx];

  const handleImageError = () => {
    if (candidateIdx < candidates.length - 1) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  const casePath = `/projects/${project.slug}`;

  const handleCasePointerDown = () => {
    router.prefetch(casePath);
  };

  const handleCaseClick = () => {
    tmaHaptics.impact("light");
  };

  const handleLiveClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (project.link && /^https?:\/\//i.test(project.link)) {
      e.preventDefault();
      openExternalUrl(project.link);
    }
  };

  return (
    <article className="border border-border bg-card flex flex-col">
      {/* Project Header Bar */}
      <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3 sm:gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-aa font-bold">
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
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 bg-background/40">
          <Link
            href={casePath}
            onPointerDown={handleCasePointerDown}
            onClick={handleCaseClick}
            className="block border border-border bg-muted overflow-hidden relative aspect-[16/10] group"
          >
            {!imgFailed && currentImageSrc ? (
              <Image
                src={currentImageSrc}
                alt={title}
                width={1280}
                height={800}
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 60vw, 750px"
                onError={handleImageError}
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
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4 sm:space-y-6">
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
          <div
            className={
              project.link
                ? "pt-4 border-t border-border flex flex-col sm:grid sm:grid-cols-2 gap-2.5 font-mono text-xs uppercase tracking-wider"
                : "pt-4 border-t border-border flex flex-col font-mono text-xs uppercase tracking-wider"
            }
          >
            {project.link ? (
              <a
                href={project.link}
                onClick={handleLiveClick}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn min-h-12 sm:min-h-11 px-3 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-bold hover:opacity-90"
              >
                <span>{t("LIVE SYSTEM", "ОТКРЫТЬ")}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}

            <Link
              href={casePath}
              onPointerDown={handleCasePointerDown}
              onClick={handleCaseClick}
              className="tactile-btn min-h-12 sm:min-h-11 px-3 flex items-center justify-center gap-1.5 border border-border bg-background text-foreground font-bold hover:border-primary hover:text-primary"
            >
              <span>{t("CASE STUDY", "ПОДРОБНЫЙ РАЗБОР")}</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
