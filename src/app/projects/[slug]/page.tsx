import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/views/project-detail";
import { getProjects, getProjectBySlug } from "@/entities/project/server";
import { generateProjectJsonLd } from "@/entities/project/lib/json-ld";

export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

const PROJECT_SEO_KEYWORDS: Record<string, string[]> = {
  dexsa: [
    "Telegram Mini App development",
    "React Telegram Mini App",
    "Telegram Stars payments",
    "Разработка Telegram Mini App на React",
  ],
  dkmline: [
    "B2B catalog on Next.js",
    "B2B e-commerce development",
    "B2B каталог на Next.js",
  ],
  "tower-empire": [
    "WebSocket realtime game",
    "Node.js realtime backend",
    "Fullstack инженер",
  ],
  portfolio: [
    "Next.js portfolio",
    "Fullstack engineer",
    "Fullstack инженер",
  ],
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const customKeywords = PROJECT_SEO_KEYWORDS[slug] ?? [];
  const keywords = Array.from(new Set([...project.tags, ...customKeywords]));

  return {
    title: `${project.title_en} | Aliaksandr Bullo`,
    description: project.description_en,
    keywords,
    openGraph: {
      title: project.title_en,
      description: project.description_en,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title_en,
      description: project.description_en,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = generateProjectJsonLd(project);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailView project={project} />
    </>
  );
}
