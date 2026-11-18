import type { Project } from "../model/types";
import { SITE_URL } from "@/shared/config/site";

export function generateProjectJsonLd(project: Project) {
  const pageUrl = `${SITE_URL}/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#project`,
    name: project.title_en,
    description: project.description_en,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    sameAs: project.link ? [project.link] : undefined,
    keywords: project.tags.join(", "),
    author: { "@id": `${SITE_URL}/#person` },
  };
}
