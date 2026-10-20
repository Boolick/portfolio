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

  const modIndex = String(index).padStart(2, "0");
  const slotStart = (index - 1) * 16 + 1;
  const slotEnd = index * 16;

  return (
    <article className="chassis-module-double relative overflow-hidden flex flex-col">
      {/* 1. TOP MODULE RAIL WITH BOLTS & METADATA */}
      <div className="chassis-header bg-muted">
        <div className="flex items-center gap-3">
          <div className="rack-bolt" />
          <span className="px-2 py-0.5 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-bold text-[11px] tracking-wider">
            [ MOD_{modIndex} ]
          </span>
          <h3 className="font-sans font-bold text-sm sm:text-base text-foreground uppercase tracking-tight">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-status-ok text-status-ok text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-status-ok" />
            STATUS: PRODUCTION
          </span>
          <div className="rack-bolt" />
        </div>
      </div>

      {/* 2. MAIN MODULE BODY */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Project Image Viewport & Description */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
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
                className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
                {project.slug}
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-foreground/90 text-background text-[9px] font-mono px-1.5 py-0.5">
              SLOT_{modIndex} {"//"} VIEWPORT
            </div>
          </Link>

          <div>
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
              {t("ENGINEERING SPECIFICATION & CHALLENGE:", "ИНЖЕНЕРНЫЙ ВЫЗОВ & РЕШЕНИЕ:")}
            </span>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right: Technical Specification Panel */}
        <div className="lg:col-span-5 recessed-well flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-1 text-[11px] font-mono text-primary font-bold">
              <span>MODULE_SPECIFICATION // {modIndex}</span>
              <span className="text-muted-foreground text-[10px]">ID: 0x{project.slug.slice(0, 4)}</span>
            </div>

            {/* Stack Tags Registers */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                {t("SYSTEM REGISTERS / STACK:", "СИСТЕМНЫЕ РЕГИСТРЫ / СТЕК:")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase px-2 py-0.5 border border-border bg-card text-foreground font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Actuators */}
          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-mono text-[10px] font-bold uppercase"
              >
                <span>{t("LIVE DEMO", "ДЕМО-САЙТ")}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-mono text-[10px] text-muted-foreground">
                INTERNAL SERVICE
              </span>
            )}

            <Link
              href={`/projects/${project.slug}`}
              className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground font-mono text-[10px] font-bold uppercase hover:border-primary"
            >
              <span>{t("TECH DOSSIER", "ДОСЬЕ")}</span>
              <ArrowRight className="h-3 w-3 text-primary" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM RACK RAIL WITH PIN METADATA */}
      <div className="chassis-footer">
        <span>SLOT_PINS: [{String(slotStart).padStart(2, "0")}-{String(slotEnd).padStart(2, "0")}] CONNECTED</span>
        <span>BUS_SYNC: 100% // POWER_DRAW: NOMINAL</span>
      </div>
    </article>
  );
}
