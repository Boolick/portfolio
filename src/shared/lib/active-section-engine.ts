export interface HomeSectionMeta {
  id: string;
  en: string;
  ru: string;
  tmaCore: boolean;
}

export const HOME_SECTIONS: readonly HomeSectionMeta[] = [
  { id: "projects", en: "Projects", ru: "Проекты", tmaCore: true },
  { id: "approach", en: "Approach", ru: "Подход", tmaCore: true },
  { id: "experience", en: "Experience", ru: "Опыт", tmaCore: true },
  { id: "contact", en: "Contact", ru: "Контакты", tmaCore: true },
] as const;

export interface SectionMeasurement {
  id: string;
  top: number;
}

export interface ActiveSectionParams {
  viewportHeight: number;
  scrollY: number;
  docHeight: number;
  headerHeight: number;
}

/**
 * Pure coordinate-based scroll-spy resolver.
 * Uses section top coordinates relative to a reading focal line below the sticky header,
 * making detection independent of individual section heights (which vary from 425px to 4541px on mobile).
 */
export function resolveActiveSectionId(
  measurements: readonly SectionMeasurement[],
  params: ActiveSectionParams
): string {
  if (measurements.length === 0) return "";

  const { viewportHeight, scrollY, docHeight, headerHeight } = params;

  if (
    docHeight > 0 &&
    viewportHeight > 0 &&
    scrollY + viewportHeight >= docHeight - 24
  ) {
    return measurements[measurements.length - 1].id;
  }

  const anchorY = Math.max(
    headerHeight + 24,
    Math.min(
      headerHeight + Math.round(viewportHeight * 0.22),
      Math.round(viewportHeight * 0.45)
    )
  );

  let activeId = measurements[0].id;
  for (const sec of measurements) {
    if (sec.top <= anchorY) {
      activeId = sec.id;
    } else {
      break;
    }
  }

  return activeId;
}
