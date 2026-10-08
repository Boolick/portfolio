"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import type { Project } from "../model/types";
import { resolveProjectImage } from "../lib/resolve-project-image";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { lang, t } = useLanguage();
  const title = pickLocale(project, "title", lang);
  const description = pickLocale(project, "description", lang);
  const imageSrc = resolveProjectImage(project.slug, project.image_url);

  return (
    <article className="bento-card group overflow-hidden flex flex-col h-full">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              width={1280}
              height={800}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-mono">
              {project.slug}
            </div>
          )}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
          {project.link && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 cursor-pointer">
              <a href={project.link} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                {t("Live", "Сайт")}
              </a>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost" className="gap-1.5 cursor-pointer">
            <Link href={`/projects/${project.slug}`}>
              {t("Details", "Подробнее")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
