import { resumeData } from '@/data/resume-data';

export function JsonLdSchema() {
  const data = resumeData.en;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.title,
    email: `mailto:${data.contacts.email}`,
    url: `https://${data.contacts.linkedin}`,
    sameAs: [
      `https://${data.contacts.linkedin}`,
      `https://t.me/${data.contacts.telegram.replace('@', '')}`,
    ],
    knowsAbout: data.skills.flatMap((cat) => cat.skills),
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: data.education.institution,
    },
    worksFor: {
      '@type': 'Organization',
      name: data.experience[0]?.company || '',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
