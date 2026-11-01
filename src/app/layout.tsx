import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/features/language-switcher";
import { ThemeProvider } from "@/features/theme-toggle";
import { AuthProvider } from "@/features/auth";
import { TelegramProvider, TelegramShell } from "@/features/telegram";
import { Toaster } from "@/shared/ui";
import { ConsoleEasterEgg } from "@/features/easter-egg";
import { RefTracker } from "@/features/analytics";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://resumeportfoliocv.netlify.app"
  ),
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
      className={`${manrope.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;if(d){r.classList.add("dark");r.style.setProperty("--theme-mix","100%");r.style.setProperty("--wheel-pos","1");r.style.setProperty("--wheel-offset","88px");r.style.colorScheme="dark";}else{r.classList.remove("dark");r.style.setProperty("--theme-mix","0%");r.style.setProperty("--wheel-pos","0");r.style.setProperty("--wheel-offset","0px");r.style.colorScheme="light";}var l=localStorage.getItem("lang");if(l!=="ru"&&l!=="en"){l=(navigator.language||"").toLowerCase().indexOf("ru")===0?"ru":"en";}r.lang=l;}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=window.location.hash;var s=window.location.search;var q=new URLSearchParams(s);var isTg=h.indexOf("tgWebAppData")!==-1||q.get("platform")==="tg"||q.has("tgWebAppStartParam")||sessionStorage.getItem("tma")==="1";if(isTg){document.documentElement.setAttribute("data-tma","1");sessionStorage.setItem("tma","1");var scr=document.createElement("script");scr.src="https://telegram.org/js/telegram-web-app.js";scr.async=true;scr.onload=function(){window.dispatchEvent(new Event("tma-sdk-loaded"));};document.head.appendChild(scr);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased m-0 p-0 font-sans bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-foreground">
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TelegramProvider>
                <ConsoleEasterEgg />
                <RefTracker />
                <TelegramShell />
                {children}
                <Toaster />
              </TelegramProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
