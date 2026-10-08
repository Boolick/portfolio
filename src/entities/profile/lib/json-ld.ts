import type { Profile } from "../model/types";

export function generatePersonJsonLd(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name_en || "Alexander Bullo",
    jobTitle: profile.title_en || "Frontend Developer",
    description: profile.summary_en,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: [profile.telegram, profile.linkedin].filter(Boolean),
  };
}
