import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexander Bullo | Senior Frontend Developer & Team Lead",
  description:
    "Senior Frontend Developer with expertise in React, Next.js, TypeScript, and real-time systems. Team Lead experienced in managing developers and building scalable web applications.",
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Team Lead",
    "WebSocket",
    "Telegram Mini Apps",
  ],
  authors: [{ name: "Alexander Bullo" }],
  openGraph: {
    title: "Alexander Bullo | Senior Frontend Developer",
    description:
      "Senior Frontend Developer with 2+ years of hands-on experience and 11 years of engineering leadership background.",
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased m-0 p-0">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
