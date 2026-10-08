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
      <main className="container mx-auto max-w-4xl px-4 py-12 flex-1">
        <Button asChild variant="ghost" size="sm" className="mb-6 cursor-pointer gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> {t("Back to overview", "Назад к портфолио")}
          </Link>
        </Button>

        <article className="space-y-8">
          <header>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
            <p className="mt-3 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          </header>

          {imageSrc && (
            <div className="rounded-2xl overflow-hidden border border-border bg-muted relative aspect-[16/10]">
              <Image
                src={imageSrc}
                alt={title}
                width={1280}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/85 whitespace-pre-line text-base sm:text-lg leading-relaxed pt-4 border-t border-border/40">
            {longDescription}
          </div>

          {project.link && (
            <div className="pt-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 gap-2 cursor-pointer shadow-md"
              >
                <a href={project.link} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> {t("Visit project", "Открыть проект")}
                </a>
              </Button>
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
