"use client";

import { useEffect } from "react";

/**
 * ConsoleEasterEgg - Displays a clean Constructivist engineering summary in DevTools console.
 */
export function ConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const asciiArt = `
%c
   █████╗ ██████╗ 
  ██╔══██╗██╔══██╗
  ███████║██████╔╝
  ██╔══██║██╔══██╗
  ██║  ██║██████╔╝
  ╚═╝  ╚═╝╚═════╝ 
  
  Aliaksandr Bullo
  Senior Fullstack Software Engineer
`;

    const styles = {
      logo: "color: #FF5C00; font-weight: bold; font-size: 14px; font-family: monospace;",
      header:
        "color: #0E0F12; background: #FF5C00; padding: 6px 14px; font-family: monospace; font-size: 13px; font-weight: bold;",
      body: "color: #8A909A; font-family: monospace; font-size: 12px; line-height: 1.6;",
      accent: "color: #FF5C00; font-family: monospace; font-weight: bold; font-size: 12px;",
      link: "color: #10B981; font-family: monospace; font-size: 12px;",
    };

    console.log(asciiArt, styles.logo);
    console.log("%cALIAKSANDR BULLO // ENGINEERING BLUEPRINT", styles.header);
    console.log(
      `%cENGINEERING STACK & ARCHITECTURE:
%c• Next.js 16 (App Router) + React 19 + TypeScript
• Node.js & NestJS Microservices
• PostgreSQL & Redis State Management
• Tailwind CSS v4 + Constructivist Blueprint Design System
• Feature-Sliced Design (FSD v2.1)
• Zero-Flash Bilingual (EN/RU) Typography Engine

%cCONTACT & CHANNELS:
%cEmail:    bulloalexander77@gmail.com
Telegram: @AlexanderBullo
GitHub:   github.com/boolick

%c"Any fool can write code that a computer can understand. 
Good programmers write code that humans can understand."
— Martin Fowler`,
      styles.body,
      styles.accent,
      styles.body,
      styles.link,
      styles.body
    );
  }, []);

  return null;
}
