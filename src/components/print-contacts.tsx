"use client";

import { Mail, Linkedin, Send, Github, MapPin } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { resumeData } from "@/data/resume-data";
import { SOCIAL_LINKS, CONTACT } from "@/shared/constants/social-links";

/**
 * PrintContacts - Contact information block visible only in print/PDF
 * Displays email, LinkedIn, Telegram, GitHub, and location as text links with icons
 */
export function PrintContacts() {
  const { locale } = useLanguage();
  const data = resumeData[locale];

  return (
    <div className="hidden print:block text-xs space-y-1.5">
      {/* Location */}
      <div className="flex items-center gap-2">
        <MapPin size={12} className="text-[var(--color-accent)] shrink-0" />
        <span>{data.contacts.location}</span>
      </div>
      {/* Email */}
      <div className="flex items-center gap-2">
        <Mail size={12} className="text-[var(--color-accent)] shrink-0" />
        <a href={CONTACT.MAILTO[locale]}>{data.contacts.email}</a>
      </div>
      {/* LinkedIn */}
      <div className="flex items-center gap-2">
        <Linkedin size={12} className="text-[var(--color-accent)] shrink-0" />
        <a href={SOCIAL_LINKS.LINKEDIN}>{SOCIAL_LINKS.LINKEDIN_HANDLE}</a>
      </div>
      {/* Telegram */}
      <div className="flex items-center gap-2">
        <Send size={12} className="text-[var(--color-accent)] shrink-0" />
        <a href={SOCIAL_LINKS.TELEGRAM}>{SOCIAL_LINKS.TELEGRAM_HANDLE}</a>
      </div>
      {/* GitHub */}
      <div className="flex items-center gap-2">
        <Github size={12} className="text-[var(--color-accent)] shrink-0" />
        <a href={SOCIAL_LINKS.GITHUB}>{SOCIAL_LINKS.GITHUB_HANDLE}</a>
      </div>
    </div>
  );
}
