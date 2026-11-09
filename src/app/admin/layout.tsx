import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/widgets/admin-layout";
import { getSupabaseServerClient } from "@/shared/api/supabase/server";

export const metadata: Metadata = {
  title: "Admin Panel | Aliaksandr Bullo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleRow) {
    redirect("/");
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
