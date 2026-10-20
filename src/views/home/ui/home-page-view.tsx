import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { HardwareConsole } from "@/widgets/hardware-console";
import { getProfile } from "@/entities/profile/server";
import { getProjects } from "@/entities/project/server";
import { getExperiences } from "@/entities/experience/server";
import { getSkillCategories } from "@/entities/skill/server";
import { getEducation } from "@/entities/education/server";
import { getLanguages } from "@/entities/language/server";
import { generatePersonJsonLd } from "@/entities/profile/lib/json-ld";

export async function HomePageView() {
  const [profile, projects, experiences, skills, education, languages] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getExperiences(),
      getSkillCategories(),
      getEducation(),
      getLanguages(),
    ]);

  const jsonLd = generatePersonJsonLd(profile);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 flex-1 w-full">
        <HardwareConsole
          profile={profile}
          projects={projects}
          experiences={experiences}
          skills={skills}
          education={education}
          languages={languages}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
