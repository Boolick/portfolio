"use client";

import { useEffect } from "react";

/**
 * ConsoleEasterEgg - Displays a styled message in browser DevTools console
 * Easter egg for curious developers who open F12
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
  
  Alexander Bullo
  Frontend Developer
`;

    const styles = {
      logo: "color: #FF5C00; font-weight: bold; font-size: 14px; font-family: monospace;",
      greeting:
        "color: #0E0F12; background: #FF5C00; padding: 6px 14px; font-family: monospace; font-size: 14px; font-weight: bold;",
      message: "color: #8A909A; font-family: monospace; font-size: 12px; line-height: 1.6;",
      highlight: "color: #FF5C00; font-family: monospace; font-weight: bold; font-size: 12px;",
      link: "color: #10B981; font-family: monospace; font-size: 12px; text-decoration: underline;",
    };

    console.log(asciiArt, styles.logo);
    console.log("%c[ SYS_BOOT ] ALEXANDER BULLO // HARDWARE CONSOLE SPEC_01", styles.greeting);
    console.log(
      `%cI/O DIAGNOSTICS: Operator inspecting DevTools terminal. 🔧

%cARCHITECTURE SPECIFICATIONS:
%c• Next.js 16 + React 19 + TypeScript
• TailwindCSS v4 @theme inline + Custom Hardware Modules  
• Feature-Sliced Design (FSD v2.1)
• Supabase Storage (S3 S-bucket) + Dynamic Fallback
• Teenage Engineering EP-133 & Eurorack 19" Design System
• Bilingual EN/RU with real-time toggle
• Print-optimized CV Datasheet export

%cCOMMUNICATION CHANNELS:
%c📧 bulloalexander77@gmail.com
💬 @AlexanderBullo (Telegram)
🐙 github.com/boolick

%c"Any fool can write code that a computer can understand. 
Good programmers write code that humans can understand."
— Martin Fowler`,
      styles.message,
      styles.message,
      styles.highlight,
      styles.message,
      styles.link,
      styles.message
    );

    console.log(
      "%c%s",
      "color: #10B981; font-family: monospace; font-size: 12px;",
      "\n● CALIBRATION MATRIX STABLE: All test pins nominal."
    );
  }, []);

  return null;
}
