"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  FileText,
  Briefcase,
  Wrench,
  GraduationCap,
  Home,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { cn } from "@/shared/lib";

const tabs = [
  { href: "/admin", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FileText },
  { href: "/admin/experiences", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/education", label: "Education & Languages", icon: GraduationCap },
] as const;

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [session, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono text-sm">
        Verifying admin session…
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mb-3" />
        <h1 className="text-xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          This area is restricted to administrators. Please sign in with an admin account.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.href === pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight">Admin</span>
            <span className="text-muted-foreground font-mono text-xs">
              / {currentTab?.label.toLowerCase() ?? "dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
              <Link href="/">
                <Home className="h-4 w-4" /> Site
              </Link>
            </Button>
            <Button
              onClick={() => void signOut().then(() => router.push("/"))}
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium",
                  active
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "")} />
                {tab.label}
              </Link>
            );
          })}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
