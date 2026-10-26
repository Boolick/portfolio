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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-wider bg-background">
        <span>Loading session...</span>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="border border-border bg-card p-8 max-w-md w-full">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-bold font-sans tracking-[-0.02em] mb-2">Access Denied</h1>
          <p className="text-muted-foreground font-mono text-xs mb-6">
            This area is restricted to the site administrator.
          </p>
          <Button asChild className="tactile-btn font-mono text-xs uppercase tracking-wider w-full">
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.href === pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-30 font-mono">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-sans font-bold text-sm tracking-[-0.02em]">Admin Panel</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">
              · {currentTab?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer font-mono text-xs uppercase tracking-wider rounded-none">
              <Link href="/">
                <Home className="h-3.5 w-3.5" /> Site
              </Link>
            </Button>
            <Button
              onClick={() => void signOut().then(() => router.push("/"))}
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 font-mono text-xs uppercase tracking-wider rounded-none border-destructive/40"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1 font-mono">
          <div className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border mb-2">
            Sections
          </div>
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider transition-colors rounded-none border-l-2",
                  active
                    ? "border-primary bg-muted text-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "")} />
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
