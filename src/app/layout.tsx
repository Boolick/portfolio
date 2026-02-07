import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";

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

export const metadata: Metadata = {
  title: "Alexander Bullo | Middle Frontend Developer · React · Next.js",
  description:
    "Frontend Developer with 3+ years in the React ecosystem. Specializing in SPA/SSR applications, real-time WebSocket systems, and Telegram Mini Apps.",
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
  authors: [{ name: "Alexander Bullo" }],
  openGraph: {
    title: "Alexander Bullo | Middle Frontend Developer",
    description:
      "Frontend Developer with 3+ years of experience building production applications with React, Next.js, TypeScript, and real-time systems.",
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="antialiased m-0 p-0 font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
