'use client';

import { motion, animate } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Languages,
  Linkedin, 
  Github, 
  Send,
  Download,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData } from '@/data/resume-data';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  sectionId: string;
}

export function MobileSidebar() {
  const { locale, toggleLocale } = useLanguage();
  const data = resumeData[locale];

  const navItems: NavItem[] = [
    { icon: <User size={20} />, label: 'About', sectionId: 'about' },
    { icon: <Code size={20} />, label: 'Skills', sectionId: 'skills' },
    { icon: <Briefcase size={20} />, label: 'Experience', sectionId: 'experience' },
    { icon: <GraduationCap size={20} />, label: 'Education', sectionId: 'education' },
    { icon: <Languages size={20} />, label: 'Languages', sectionId: 'languages' },
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-14 bg-[#0a192f] flex flex-col items-center py-4 z-40 print:hidden">
      {/* Logo/Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-lg bg-[#fca311] flex items-center justify-center text-[#0a192f] font-serif font-bold text-sm mb-6"
      >
        AB
      </motion.div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item, idx) => (
          <motion.button
            key={item.sectionId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => scrollToSection(item.sectionId)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            title={item.label}
            aria-label={item.label}
          >
            {item.icon}
          </motion.button>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-6 h-px bg-white/20 my-3" />

      {/* Social Links */}
      <div className="flex flex-col items-center gap-1">
        <a
          href={`https://${data.contacts.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] transition-all duration-200 text-xs font-bold"
          title="LinkedIn"
        >
          LI
        </a>
        <a
          href={`https://${data.contacts.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] transition-all duration-200 text-xs font-bold"
          title="GitHub"
        >
          GH
        </a>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/20 my-3" />

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-1 mb-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLocale}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] hover:bg-white/10 transition-all duration-200 text-xs font-bold"
          title={locale === 'en' ? 'Switch to Russian' : 'Switch to English'}
        >
          {locale.toUpperCase()}
        </button>

        {/* Download PDF */}
        <button
          onClick={handlePrint}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] hover:bg-white/10 transition-all duration-200"
          title="Download PDF"
        >
          <Download size={18} />
        </button>
      </div>
    </aside>
  );
}
