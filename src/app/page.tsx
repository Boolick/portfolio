import type { Metadata } from "next";
import { HomePageView } from "@/views/home";
import { getProfile } from "@/entities/profile/server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.name_en || "Aliaksandr Bullo";
  const title = profile.title_en || "Fullstack Developer (Node.js, NestJS, React, TypeScript)";
  const summary =
    profile.summary_en ||
    "Fullstack Software Engineer focused on React, Next.js, TypeScript and Node.js. 11-year industrial engineering leadership background, scalable FSD architecture, and fault-tolerant real-time UX.";

  return {
    title: `${name} | ${title}`,
    description: summary,
    openGraph: {
      title: `${name} | ${title}`,
      description: summary,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${title}`,
      description: summary,
    },
  };
}

export default async function HomePage() {
  return <HomePageView />;
}
