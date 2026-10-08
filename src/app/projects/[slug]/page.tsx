import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/views/project-detail";
import { getProjects, getProjectBySlug } from "@/entities/project/server";
import { generateProjectJsonLd } from "@/entities/project/lib/json-ld";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

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

  return {
    title: `${project.title_en} | Alexander Bullo`,
    description: project.description_en,
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
