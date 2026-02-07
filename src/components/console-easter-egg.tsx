"use client";

import { useEffect } from "react";

/**
 * ConsoleEasterEgg - Displays a styled message in browser DevTools console
 * Easter egg for curious developers who open F12
 */
export function ConsoleEasterEgg() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // ASCII Art Logo
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
      logo: "color: #fca311; font-weight: bold; font-size: 14px; font-family: monospace;",
      greeting:
        "color: #0a192f; background: #fca311; padding: 8px 16px; border-radius: 4px; font-size: 16px; font-weight: bold;",
      message: "color: #64748b; font-size: 13px; line-height: 1.6;",
      highlight: "color: #fca311; font-weight: bold; font-size: 13px;",
      link: "color: #3b82f6; font-size: 13px; text-decoration: underline;",
    };

    // Clear console for clean presentation (optional)
    // console.clear();

    // Log ASCII Art
    console.log(asciiArt, styles.logo);

    // Greeting
    console.log("%c👋 Hey there, curious developer!", styles.greeting);

    // Main message
    console.log(
      `%cI see you like to peek under the hood — I respect that! 🔧

%cThis portfolio was built with:
%c• Next.js 16 + TypeScript
• TailwindCSS + Framer Motion  
• Feature-Sliced Design architecture
• Full bilingual support (EN/RU)
• Print-optimized PDF export

%cInterested in working together?
%c📧 bullo.aliaksandr@gmail.com
💬 @boolodev (Telegram)
🐙 github.com/BooLOO

%c"Any fool can write code that a computer can understand. 
Good programmers write code that humans can understand."
— Martin Fowler`,
      styles.message,
      styles.message,
      styles.highlight,
      styles.message,
      styles.link,
      styles.message,
    );

    // Fun warning for recruiters
    console.log(
      "%c%s",
      "color: #22c55e; font-size: 12px; font-style: italic;",
      "\n✨ P.S. If you're a recruiter who found this — bonus points for thoroughness!",
    );
  }, []);

  // This component renders nothing
  return null;
}
