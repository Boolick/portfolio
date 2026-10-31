const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "project-images";

export interface StorageImageSources {
  primarySrc: string;
  fallbackSrc: string;
}

/**
 * Resolves an ordered list of fallback candidate URLs for a storage/local image.
 * Order: [Supabase WebP, Local WebP, Supabase PNG, Local PNG]
 */
export function resolveStorageImageCandidates(fileName: string): string[] {
  const cleanName = fileName.replace(/^\/?(images\/)?/, "");
  const base = cleanName.replace(/\.(png|webp|jpg|jpeg)$/i, "");

  const webpName = `${base}.webp`;
  const pngName = `${base}.png`;

  const localWebp = `/images/${webpName}`;
  const localPng = `/images/${pngName}`;

  const candidates: string[] = [];

  if (SUPABASE_URL) {
    const baseUrl = SUPABASE_URL.replace(/\/$/, "");
    candidates.push(`${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${webpName}`);
  }
  candidates.push(localWebp);

  if (SUPABASE_URL) {
    const baseUrl = SUPABASE_URL.replace(/\/$/, "");
    candidates.push(`${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${pngName}`);
  }
  candidates.push(localPng);

  return Array.from(new Set(candidates));
}

/**
 * Resolves a dynamic Supabase Storage URL (from bucket project-images)
 * with a local fallback to /images/${fileName}.
 */
export function resolveStorageImage(fileName: string): StorageImageSources {
  const candidates = resolveStorageImageCandidates(fileName);
  return {
    primarySrc: candidates[0],
    fallbackSrc: candidates[candidates.length - 1],
  };
}
