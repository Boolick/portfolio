import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";
import { getProjects } from "@/entities/project/server";

export const revalidate = 3600; // обновлять раз в час

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  };

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [home, ...projectEntries];
}
