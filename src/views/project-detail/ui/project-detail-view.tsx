"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button, Badge } from "@/shared/ui";
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
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 font-mono text-xs uppercase">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("[ ← BACK TO CONSOLE ]", "[ ← НАЗАД К КОНСОЛИ ]")}</span>
            </Link>
          </Button>
        </div>

        {/* Technical Module Datasheet Card */}
        <article className="chassis-module-double relative overflow-hidden">
          {/* Top Rail with Bolts */}
          <div className="chassis-header bg-muted">
            <div className="flex items-center gap-3">
              <div className="rack-bolt" />
              <span className="px-2 py-0.5 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-bold text-[11px] tracking-wider font-mono">
                [ MODULE_DATASHEET // {project.slug.toUpperCase()} ]
              </span>
              <span className="font-bold text-foreground text-xs font-mono uppercase hidden sm:inline">
                SPEC_REV: 02.4
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="statusOk">STATUS: PRODUCTION</Badge>
              <div className="rack-bolt" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <header className="space-y-2 border-b border-border pb-6">
              <div className="font-mono text-xs text-primary font-bold uppercase tracking-widest">
                SYSTEM IDENTIFIER // {project.slug}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans uppercase">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
                {description}
              </p>
            </header>

            {/* Viewport Frame */}
            {imageSrc && (
              <div className="border border-border bg-muted relative aspect-[16/10] overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={1280}
                  height={800}
                  className="w-full h-full object-cover filter contrast-[1.02]"
                  priority
                />
                <div className="absolute bottom-1.5 right-1.5 bg-foreground/90 text-background font-mono text-[9px] px-2 py-0.5">
                  SLOT_01 // HIGH_RES_RENDER
                </div>
              </div>
            )}

            {/* Tags Registers */}
            <div className="recessed-well p-4 space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground uppercase block font-bold">
                BUS REGISTERS & DEPENDENCIES:
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Case Study Long Description */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed pt-2 font-sans text-sm sm:text-base border-t border-border/40 whitespace-pre-line">
              {longDescription}
            </div>

            {/* Actions */}
            {project.link && (
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <Button asChild size="lg" className="gap-2">
                  <a href={project.link} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span>{t("LAUNCH PRODUCTION SYSTEM", "ОТКРЫТЬ ПРОДАКШН-СИСТЕМУ")}</span>
                  </a>
                </Button>

                <span className="font-mono text-[11px] text-muted-foreground">
                  TARGET: {project.link}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Chassis Footer */}
          <div className="chassis-footer">
            <span>SPEC_CHECKSUM: SHA-256 VERIFIED</span>
            <span>DATA_LAYER: POSTGRESQL + REDIS CACHED</span>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
