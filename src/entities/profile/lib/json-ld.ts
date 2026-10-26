import type { Profile } from "../model/types";

export function generatePersonJsonLd(profile: Profile) {
  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name_en || "Aliaksandr Bullo",
    jobTitle: profile.title_en || "Fullstack Software Engineer",
    url: "https://resumeportfoliocv.netlify.app/",
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "WebSockets",
      "Telegram Mini Apps",
    ],
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Engineering services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fault-tolerant web systems",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Telegram Mini App development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "B2B platforms & catalogs",
          },
        },
      ],
    },
  };

  if (profile.summary_en) {
    person.description = profile.summary_en;
  }
  if (profile.email) {
    person.email = `mailto:${profile.email}`;
  }

  const sameAs = [profile.telegram, profile.linkedin].filter(Boolean);
  if (sameAs.length > 0) {
    person.sameAs = sameAs;
  }

  return person;
}

export function generateProfilePageJsonLd(profile: Profile) {
  const person = generatePersonJsonLd(profile);
  const { "@context": _ctx, ...personWithoutContext } = person;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: "https://resumeportfoliocv.netlify.app/",
    mainEntity: personWithoutContext,
  };
}
