import type { Metadata } from "next";
import { AdminLayoutShell } from "@/widgets/admin-layout";

export const metadata: Metadata = {
  title: "Admin Panel | Alexander Bullo",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
