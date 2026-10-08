import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/features/language-switcher";
import { ThemeProvider } from "@/features/theme-toggle";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/shared/ui";
import { ConsoleEasterEgg } from "@/features/easter-egg";
import { RefTracker } from "@/features/analytics";

export const metadata: Metadata = {
  title: "Aliaksandr Bullo | Fullstack Developer (Node.js, NestJS, React, TypeScript)",
  description:
    "Fullstack Software Engineer focused on React, Next.js, TypeScript and Node.js with an 11-year technical engineering background. Scalable FSD architecture, strict type safety, and real-time systems.",
  keywords: [
    "Fullstack Developer",
    "Node.js Developer",
    "NestJS Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "Docker",
    "WebSocket",
    "Supabase",
    "Telegram Mini Apps",
  ],
  authors: [{ name: "Aliaksandr Bullo" }],
  openGraph: {
    title: "Aliaksandr Bullo | Fullstack Developer",
    description:
      "Fullstack Software Engineer (React, Next.js, Node.js, NestJS, TypeScript). Scalable client-side architecture and robust server-side logic.",
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased m-0 p-0 font-sans bg-background text-foreground min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ConsoleEasterEgg />
              <RefTracker />
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
