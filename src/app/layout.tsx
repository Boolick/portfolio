import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/features/language-switcher";
import { ThemeProvider } from "@/features/theme-toggle";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/shared/ui";
import { ConsoleEasterEgg } from "@/features/easter-egg";
import { RefTracker } from "@/features/analytics";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;if(d){r.classList.add("dark");r.style.setProperty("--theme-mix","100%");r.style.setProperty("--wheel-pos","1");r.style.setProperty("--wheel-offset","88px");r.style.colorScheme="dark";}else{r.classList.remove("dark");r.style.setProperty("--theme-mix","0%");r.style.setProperty("--wheel-pos","0");r.style.setProperty("--wheel-offset","0px");r.style.colorScheme="light";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased m-0 p-0 font-sans bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-foreground">
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
