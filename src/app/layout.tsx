import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { resumeData } from "@/data/resume-data";
import { ConsoleEasterEgg } from "@/components/console-easter-egg";
import { RefTracker } from "@/components/analytics/ref-tracker";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Use English data as the default for metadata
const defaultData = resumeData.en;

export const metadata: Metadata = {
  title: `${defaultData.name} | ${defaultData.title}`,
  description: defaultData.summary,
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "WebSocket",
    "Telegram Mini Apps",
    "React Ecosystem",
    "SPA",
    "SSR",
  ],
  authors: [{ name: defaultData.name }],
  openGraph: {
    title: `${defaultData.name} | ${defaultData.title.split("·")[0].trim()}`,
    description: defaultData.summary,
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
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
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="antialiased m-0 p-0 font-sans">
        <LanguageProvider>
          <ConsoleEasterEgg />
          <RefTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
