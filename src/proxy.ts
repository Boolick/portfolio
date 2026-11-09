import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // 1) Synchronize to request.cookies so downstream Server Components / RSC receive fresh session
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // Re-create the next response with updated request cookies
        response = NextResponse.next({
          request,
        });
        // 2) Synchronize to response.cookies so the browser receives updated HttpOnly cookies
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: options?.path ?? "/",
          })
        );
      },
    },
  });

  // Calling getUser() validates session and automatically triggers setAll() if token refreshed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Helper to redirect with all accumulated cookies preserved (including refreshed tokens)
  const redirectWithCookies = (destination: string) => {
    const redirectResponse = NextResponse.redirect(new URL(destination, request.url), 307);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  };

  // 1. Unauthenticated trying to access /admin -> immediate server redirect before RSC render (307)
  if (isProtected && !user) {
    return redirectWithCookies("/login");
  }

  // 2. Authenticated user accessing /admin -> verify admin role
  if (isProtected && user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return redirectWithCookies("/");
    }
  }

  // 3. Authenticated admin accessing /login -> redirect to /admin (307)
  if (isLoginPage && user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleRow) {
      return redirectWithCookies("/admin");
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
