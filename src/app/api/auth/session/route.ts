import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/api/supabase/server";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null, isAdmin: false });
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      isAdmin: !!roleRow,
    });
  } catch {
    return NextResponse.json({ user: null, isAdmin: false });
  }
}
