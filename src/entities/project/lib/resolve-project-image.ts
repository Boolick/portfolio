/**
 * Resolves an ordered list of candidate URLs for a project cover image.
 * Prefers .webp with seamless fallback to .png.
 */
export function resolveProjectImageCandidates(
  slug: string,
  imageUrl?: string | null
): string[] {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
    return [imageUrl];
  }

  if (imageUrl && imageUrl.startsWith("/")) {
    if (imageUrl.endsWith(".webp")) {
      return [imageUrl, imageUrl.replace(/\.webp$/i, ".png")];
    }
    if (imageUrl.endsWith(".png")) {
      return [imageUrl.replace(/\.png$/i, ".webp"), imageUrl];
    }
    return [imageUrl];
  }

  return [`/projects/${slug}.webp`, `/projects/${slug}.png`];
}

export function resolveProjectImage(slug: string, imageUrl?: string | null): string {
  const candidates = resolveProjectImageCandidates(slug, imageUrl);
  return candidates[0];
}
