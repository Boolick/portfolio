import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/api/supabase/server";
import { mapBackendError } from "@/shared/lib/errors";
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
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Email and password are required.",
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServerClient();

    // Server-side authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: mapBackendError(error, 401) },
        { status: 401 }
      );
    }

    // Role Verification: check admin role
    const { data: roleRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleRow) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Access denied. Administrator privileges required.",
            status: 403,
          },
        },
        { status: 403 }
      );
    }

    // TOKEN CONCEALMENT (Golden Case):
    // Tokens are written exclusively to HttpOnly cookies by getSupabaseServerClient.
    // The response body contains ONLY sanitized user payload — zero token leakage to DevTools/JS!
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: "admin",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: mapBackendError(err, 500) },
      { status: 500 }
    );
  }
}
