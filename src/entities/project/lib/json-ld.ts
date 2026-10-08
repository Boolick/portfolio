import type { Project } from "../model/types";

export function generateProjectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title_en,
    description: project.description_en,
    applicationCategory: "WebApplication",
    url: project.link || undefined,
    keywords: project.tags.join(", "),
  };
}
