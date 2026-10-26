"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import { type Project, resolveProjectImage } from "@/entities/project";

interface ProjectDetailViewProps {
  project: Project;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { lang, t } = useLanguage();
  const title = pickLocale(project, "title", lang);
  const description = pickLocale(project, "description", lang);
  const longDescription =
    pickLocale(project, "long_description", lang) || description;
  const imageSrc = resolveProjectImage(project.slug, project.image_url);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex-1 w-full">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <Link href="/#projects">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("Back to Projects", "Назад к проектам")}</span>
            </Link>
          </Button>
        </div>

        {/* Engineering Specification Sheet */}
        <article className="border border-border bg-card">
          <header className="p-6 sm:p-10 border-b border-border space-y-4">
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

          {/* Project Visual */}
          {imageSrc && (
            <div className="border-b border-border bg-muted/40 p-6 sm:p-10">
              <div className="border border-border bg-background relative aspect-[16/10] overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={1280}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Detailed Specification */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line">
              {longDescription}
            </div>

            {project.link && (
              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <Button asChild size="lg" className="gap-2">
                  <a href={project.link} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span>{t("Open Live System", "Открыть проект")}</span>
                  </a>
                </Button>

                <span className="font-mono text-xs text-muted-foreground">
                  {project.link}
                </span>
              </div>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
