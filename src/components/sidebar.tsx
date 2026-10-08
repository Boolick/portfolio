"use client";
import { animate } from "framer-motion";

import { motion } from "framer-motion";
import {
  Mail,
  Briefcase,
  GraduationCap,
  User,
  Code2,
  FolderKanban,
  Linkedin,
  Send,
  Github,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { uiStrings } from "@/data/resume-data";
import {
  SOCIAL_LINKS,
  EXTERNAL_LINK_ATTRS,
  CONTACT,
} from "@/shared/constants/social-links";
import { PrintContacts } from "./print-contacts";

export function Sidebar() {
  const { locale, toggleLocale } = useLanguage();
  const ui = uiStrings[locale];

  const navItems = [
    {
      id: "desktop-about",
      label: locale === "en" ? "About Me" : "Обо мне",
      icon: User,
    },
    { id: "desktop-whyme", label: ui.whyMe, icon: Sparkles },
    {
      id: "desktop-skills",
      label: locale === "en" ? "Skills" : "Навыки",
      icon: Code2,
    },
    {
      id: "desktop-experience",
      label: locale === "en" ? "Experience" : "Опыт",
      icon: Briefcase,
    },
    { id: "desktop-projects", label: ui.projects, icon: FolderKanban },
    {
      id: "desktop-education",
      label: locale === "en" ? "Education" : "Образование",
      icon: GraduationCap,
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 24; // scroll-mt-6 equivalent
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const targetY = elementPosition - offset;

      animate(window.scrollY, targetY, {
        type: "tween",
        ease: "easeInOut",
        duration: 0.8,
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <aside className="w-full md:w-[280px] md:fixed md:left-0 md:top-0 md:h-screen flex-shrink-0 bg-[var(--color-sidebar)] text-white p-6 md:py-6 md:px-4 lg:px-6 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
      {/* Language Toggle - AT TOP RIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row items-end lg:items-center justify-end gap-2 print:hidden"
      >
        {/* Social Links */}
        <div className="flex items-center gap-2">
          <a
            href={SOCIAL_LINKS.GITHUB}
            {...EXTERNAL_LINK_ATTRS}
            className="
              w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 
              flex items-center justify-center text-[var(--color-accent)] 
              hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] 
              transition-all duration-200
            "
            title="GitHub"
            aria-label="GitHub profile"
          >
            <Github size={16} />
          </a>
          <a
            href={SOCIAL_LINKS.LINKEDIN}
            {...EXTERNAL_LINK_ATTRS}
            className="
              w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 
              flex items-center justify-center text-[var(--color-accent)] 
              hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] 
              transition-all duration-200
            "
            title="LinkedIn"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={SOCIAL_LINKS.TELEGRAM}
            {...EXTERNAL_LINK_ATTRS}
            className="
              w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 
              flex items-center justify-center text-[var(--color-accent)] 
              hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] 
              transition-all duration-200
            "
            title="Telegram"
            aria-label="Telegram contact"
          >
            <Send size={16} />
          </a>
          <a
            href={CONTACT.MAILTO[locale]}
            className="
              w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 
              flex items-center justify-center text-[var(--color-accent)] 
              hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] 
              transition-all duration-200
            "
            title="Email"
            aria-label="Send email"
          >
            <Mail size={16} />
          </a>
        </div>

        <div className="hidden lg:block w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={toggleLocale}
          className="
            px-3 py-1.5 
            bg-[var(--color-accent)] text-[var(--color-on-accent)] 
            rounded-md font-bold text-xs 
            hover:bg-[var(--color-accent-hover)] hover:scale-105
            transition-all duration-200 
            shadow-sm hover:shadow-[var(--shadow-accent)]
          "
          aria-label="Toggle language"
        >
          {locale === "en" ? "RU" : "EN"}
        </button>
      </motion.div>

      {/* Print-Only Contacts */}
      <PrintContacts />

      {/* Navigation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 print:hidden"
      >
        <h3 className="text-lg font-bold text-[var(--color-accent)] border-b border-white/10 pb-2">
          {locale === "en" ? "Navigate" : "Навигация"}
        </h3>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <button
                onClick={() => {
                  scrollToSection(item.id);
                }}
                className="
                  flex items-center gap-3 w-full text-left 
                  px-3 py-2 text-sm text-slate-200 
                  hover:text-white hover:bg-white/10 
                  rounded-lg transition-all duration-200
                  group
                "
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
                  <item.icon size={14} className="text-[var(--color-accent)]" />
                </div>
                {item.label}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 print-spacer" />
    </aside>
  );
}
