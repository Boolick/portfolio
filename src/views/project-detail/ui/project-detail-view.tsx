"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import { type Project, resolveProjectImageCandidates } from "@/entities/project";
import { ShareCaseButton } from "@/features/telegram";
import { openExternalUrl } from "@/shared/lib/telegram/links";

interface ProjectDetailViewProps {
  project: Project;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { lang, t } = useLanguage();
  const title = pickLocale(project, "title", lang);
  const description = pickLocale(project, "description", lang);
  const longDescription =
    pickLocale(project, "long_description", lang) || description;

  const candidates = resolveProjectImageCandidates(project.slug, project.image_url);
  const [candidateIdx, setCandidateIdx] = useState(0);
  const currentImageSrc = candidates[candidateIdx] || candidates[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-12 md:py-20 flex-1 w-full">
        {/* Back Navigation (Web only: TMA uses native BackButton in title bar) */}
        <div className="mb-5 sm:mb-8 web-only">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 font-mono text-xs uppercase tracking-wider min-h-11 px-4 cursor-pointer"
          >
            <Link href="/#projects">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("Back to Projects", "Назад к проектам")}</span>
            </Link>
          </Button>
        </div>

        {/* Engineering Specification Sheet */}
        <article className="border border-border bg-card">
          <header className="p-4 sm:p-8 md:p-10 border-b border-border space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs uppercase tracking-wider">
              <span className="text-primary font-bold">
                {t("Engineering Case Study", "Инженерный кейс")}
              </span>
              <span className="text-muted-foreground">{project.slug}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-foreground font-sans">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
              {description}
            </p>

            {/* Inline Pipe-Separated Stack */}
            <div className="pt-4 border-t border-border font-mono text-xs">
              <span className="text-muted-foreground uppercase tracking-wider mr-2">
                {t("Stack:", "Стек:")}
              </span>
              <span className="text-foreground">{project.tags.join(" | ")}</span>
            </div>
          </header>

          {/* Project Visual with .webp -> .png candidate fallback chain */}
          {currentImageSrc && (
            <div className="border-b border-border bg-muted/40 p-4 sm:p-8 md:p-10">
              <div className="border border-border bg-background relative aspect-[16/10] overflow-hidden">
                <Image
                  src={currentImageSrc}
                  alt={title}
                  width={1280}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="w-full h-full object-cover"
                  priority
                  onError={() => {
                    if (candidateIdx < candidates.length - 1) {
                      setCandidateIdx((prev) => prev + 1);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Detailed Specification */}
          <div className="p-4 sm:p-8 md:p-10 space-y-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line">
              {longDescription}
            </div>

            {/* Specification Action Bar */}
            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {project.link && (
                  <button
                    type="button"
                    onClick={() => openExternalUrl(project.link!)}
                    className="tactile-btn min-h-12 px-6 bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors hover:brightness-110"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span>{t("Open Live System", "Открыть проект")}</span>
                  </button>
                )}

                <ShareCaseButton slug={project.slug} title={title} />
              </div>

              {project.link && (
                <span className="font-mono text-xs text-muted-foreground break-all">
                  {project.link}
                </span>
              )}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
