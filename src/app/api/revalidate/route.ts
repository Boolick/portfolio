import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  const path = searchParams.get("path") || "/";
  revalidatePath(path);
  revalidatePath("/projects/[slug]", "page");

  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
