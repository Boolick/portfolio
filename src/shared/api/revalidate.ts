"use server";

import { revalidatePath } from "next/cache";

/**
 * Server action to revalidate static pages on-demand after admin updates.
 */
export async function revalidatePortfolio(path?: string) {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/", "page");
      revalidatePath("/projects/[slug]", "page");
    }
    return { success: true };
  } catch (error) {
    console.error("Revalidation error:", error);
    return { success: false, error: String(error) };
  }
}
