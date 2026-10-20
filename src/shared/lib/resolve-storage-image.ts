const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "project-images";

export interface StorageImageSources {
  primarySrc: string;
  fallbackSrc: string;
}

/**
 * Resolves a dynamic Supabase Storage URL (from bucket project-images)
 * with a local fallback to /images/${fileName}.
 */
export function resolveStorageImage(fileName: string): StorageImageSources {
  const cleanName = fileName.replace(/^\/?(images\/)?/, "");
  const fallbackSrc = `/images/${cleanName}`;

  if (!SUPABASE_URL) {
    return { primarySrc: fallbackSrc, fallbackSrc };
  }

  const baseUrl = SUPABASE_URL.replace(/\/$/, "");
  const primarySrc = `${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${cleanName}`;

  return { primarySrc, fallbackSrc };
}
