import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/api/supabase/server";
import { verifyCsrfOrigin } from "@/shared/lib/csrf";

export async function POST(req: Request) {
  // CSRF Protection: Route Handlers lack automatic Origin validation
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Cross-site request forgery validation failed.",
          status: 403,
        },
      },
      { status: 403 }
    );
  }

  try {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
