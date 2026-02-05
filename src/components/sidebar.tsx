'use client';
import { animate } from 'framer-motion';

import { motion } from 'framer-motion';
import { MapPin, Mail, Globe, Briefcase, GraduationCap, User, Code2, FolderKanban, Linkedin, Send } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings } from '@/data/resume-data';

export function Sidebar() {
  const { locale, toggleLocale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  const navItems = [
    { id: 'desktop-about', label: locale === 'en' ? 'About Me' : 'Обо мне', icon: User },
    { id: 'desktop-skills', label: locale === 'en' ? 'Skills' : 'Навыки', icon: Code2 },
    { id: 'desktop-experience', label: locale === 'en' ? 'Experience' : 'Опыт', icon: Briefcase },
    { id: 'desktop-projects', label: ui.projects, icon: FolderKanban },
    { id: 'desktop-education', label: locale === 'en' ? 'Education' : 'Образование', icon: GraduationCap },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 24; // scroll-mt-6 equivalent
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const targetY = elementPosition - offset;

      animate(window.scrollY, targetY, {
        type: 'tween',
        ease: 'easeInOut',
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
    <aside className="w-full md:w-[280px] md:fixed md:left-0 md:top-0 md:h-screen flex-shrink-0 bg-[#0a192f] text-white p-6 md:py-8 md:px-6 flex flex-col gap-6 overflow-hidden">
      {/* Language Toggle - AT TOP RIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-end print:hidden"
      >
        <button
          onClick={toggleLocale}
          className="px-4 py-2 bg-[#fca311] text-[#0a192f] rounded-full font-bold text-sm hover:bg-[#fca311]/90 transition-all shadow-lg"
        >
          {locale === 'en' ? 'RU' : 'EN'}
        </button>
      </motion.div>

      {/* Contact - with Lucide icons */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-[#fca311] border-b border-white/10 pb-2">
          {ui.contact}
        </h3>
        <ul className="space-y-3 text-sm font-light text-slate-200">
          <motion.li variants={itemVariants} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-[#fca311]" />
            </div>
            <div>
              <span className="block">{data.contacts.location}</span>
            </div>
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-[#fca311]" />
            </div>
            <a href={`mailto:${data.contacts.email}`} className="hover:text-[#fca311] transition-colors">
              {data.contacts.email}
            </a>
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-[#fca311]" />
            </div>
            <a 
              href={`https://${data.contacts.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fca311] transition-colors"
            >
              LinkedIn
            </a>
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-[#fca311]" />
            </div>
            <a 
              href={`https://t.me/${data.contacts.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fca311] transition-colors"
            >
              {data.contacts.telegram}
            </a>
          </motion.li>
        </ul>
      </motion.div>

      {/* Navigation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 print:hidden"
      >
        <h3 className="text-lg font-bold text-[#fca311] border-b border-white/10 pb-2">
          {locale === 'en' ? 'Navigate' : 'Навигация'}
        </h3>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <button
                onClick={() => {
                  scrollToSection(item.id);
                  console.log(item.id);
                }}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
                  <item.icon size={14} className="text-[#fca311]" />
                </div>
                {item.label}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Social Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-[#fca311] border-b border-white/10 pb-2">
          {locale === 'en' ? 'Links' : 'Ссылки'}
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.a
            variants={itemVariants}
            href={`https://${data.contacts.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-[#fca311]/20 flex items-center justify-center text-[#fca311] hover:bg-[#fca311] hover:text-[#0a192f] transition-all duration-200"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </motion.a>
          <motion.a
            variants={itemVariants}
            href={`https://t.me/${data.contacts.telegram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-[#fca311]/20 flex items-center justify-center text-[#fca311] hover:bg-[#fca311] hover:text-[#0a192f] transition-all duration-200"
            title="Telegram"
          >
            <Send size={18} />
          </motion.a>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 print-spacer" />
    </aside>
  );
}
