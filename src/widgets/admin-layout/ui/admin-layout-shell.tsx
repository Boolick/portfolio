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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest bg-background">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse inline-block" />
          VERIFYING_ADMIN_SESSION...
        </span>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="chassis-module p-8 max-w-md w-full border border-destructive/50">
          <div className="chassis-header -mx-8 -mt-8 mb-6 px-4 py-2 flex items-center justify-between border-b border-destructive/30 bg-destructive/10 text-destructive font-mono text-[10px] uppercase tracking-widest">
            <span>SEC_ALERT // ERR_403</span>
            <span>[ RESTRICTED ]</span>
          </div>
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-bold font-mono uppercase tracking-tight mb-2">ACCESS_DENIED</h1>
          <p className="text-muted-foreground font-mono text-xs mb-6">
            THIS AREA IS RESTRICTED TO CERTIFIED OPERATORS ONLY. PLEASE AUTHENTICATE.
          </p>
          <Button asChild className="tactile-btn font-mono text-xs uppercase tracking-wider w-full">
            <Link href="/login">RETURN TO LOGIN</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.href === pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30 font-mono">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary" />
            <span className="font-bold text-sm tracking-wider uppercase">SYS_CONSOLE // ADMIN</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">
              / [{currentTab?.label.toUpperCase() ?? "DASHBOARD"}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer font-mono text-xs uppercase tracking-wider rounded-none">
              <Link href="/">
                <Home className="h-3.5 w-3.5" /> SITE
              </Link>
            </Button>
            <Button
              onClick={() => void signOut().then(() => router.push("/"))}
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 font-mono text-xs uppercase tracking-wider rounded-none border-destructive/40"
            >
              <LogOut className="h-3.5 w-3.5" /> DISCONNECT
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1 font-mono">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b border-border/50 mb-2">
            CONTROL_BUS // NAV
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
