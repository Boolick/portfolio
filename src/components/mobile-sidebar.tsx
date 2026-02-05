'use client';

import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Languages,
  Linkedin, 
  Send,
  Download,
  FolderKanban
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData } from '@/data/resume-data';

interface NavItem {
  icon: React.ElementType;
  label: string;
  sectionId: string;
}

export function MobileSidebar() {
  const { locale, toggleLocale } = useLanguage();
  const data = resumeData[locale];
  const [activeSection, setActiveSection] = useState<string>('about');

  const navItems: NavItem[] = [
    { icon: User, label: 'About', sectionId: 'about' },
    { icon: Code, label: 'Skills', sectionId: 'skills' },
    { icon: Briefcase, label: 'Experience', sectionId: 'experience' },
    { icon: FolderKanban, label: 'Projects', sectionId: 'projects' },
    { icon: GraduationCap, label: 'Education', sectionId: 'education' },
    { icon: Languages, label: 'Languages', sectionId: 'languages' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.sectionId,
        element: document.getElementById(item.sectionId)
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 24;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const targetY = elementPosition - offset;

      animate(window.scrollY, targetY, {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.8,
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
      
      setActiveSection(sectionId);
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
        className="w-10 h-10 rounded-lg bg-[#fca311] flex items-center justify-center text-[#0a192f] font-bold text-sm mb-6"
      >
        AB
      </motion.div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSection === item.sectionId;
          
          return (
            <motion.button
              key={item.sectionId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => scrollToSection(item.sectionId)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? 'text-[#fca311] bg-[#fca311]/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={20} />
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-6 h-px bg-white/20 my-3" />

      {/* Social Links */}
      <div className="flex flex-col items-center gap-1">
        <a
          href={`https://${data.contacts.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] hover:bg-white/10 transition-all duration-200"
          title="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a
          href={`https://t.me/${data.contacts.telegram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#fca311] hover:bg-white/10 transition-all duration-200"
          title="Telegram"
        >
          <Send size={18} />
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
