export function resolveProjectImage(slug: string, imageUrl?: string | null): string {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl && imageUrl.startsWith("/")) return imageUrl;
  return `/projects/${slug}.png`;
}
