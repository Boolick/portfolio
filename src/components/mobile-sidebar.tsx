import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Mail,
  Linkedin, 
  Send,
  Download,
  FolderKanban,
  Github
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData } from '@/data/resume-data';
import { Button } from './ui/button';
import { cn } from '@/shared/styles/utils';
import { SOCIAL_LINKS, EXTERNAL_LINK_ATTRS, CONTACT } from '@/shared/constants/social-links';

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
    { icon: GraduationCap, label: 'Education', sectionId: 'education' }
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
    handleScroll(); 
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
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#0a192f] flex flex-col items-center py-4 z-40 print:hidden border-r border-white/5">
      {/* Top Actions: Language & Socials */}
      <div className="flex flex-col gap-2 mb-4 w-full items-center">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLocale}
          className="text-[#fca311] hover:bg-[#fca311]/10 font-bold"
          title={locale === 'en' ? 'Switch to Russian' : 'Switch to English'}
        >
          {locale.toUpperCase()}
        </Button>

        {/* Separator */}
        <div className="w-8 h-px bg-white/10 my-1" />
      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-2 overflow-y-auto w-full px-1 scrollbar-hide">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSection === item.sectionId;          
          return (
            <Button
              key={item.sectionId}
              variant="ghost"
              size="icon"
              onClick={() => scrollToSection(item.sectionId)}
              className={cn(
                "transition-all duration-200",
                isActive 
                  ? 'text-[#fca311] bg-[#fca311]/20 hover:bg-[#fca311]/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
              title={item.label}
            >
              <Icon size={20} />
            </Button>
            
          );
        })}
      </nav>
            {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-2" />

        {/* Social Links */}
        <div className="flex flex-col gap-2">
           {/* GitHub - Placeholder as it's not in data yet, but requested */}
           <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-slate-400 hover:text-[#fca311] hover:bg-white/5"
          >
            <a
              href={SOCIAL_LINKS.GITHUB}
              {...EXTERNAL_LINK_ATTRS}
              title="GitHub"
            >
              <Github size={20} />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-slate-400 hover:text-[#fca311] hover:bg-white/5"
          >
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              {...EXTERNAL_LINK_ATTRS}
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-slate-400 hover:text-[#fca311] hover:bg-white/5"
          >
            <a
              href={SOCIAL_LINKS.TELEGRAM}
              {...EXTERNAL_LINK_ATTRS}
              title="Telegram"
            >
              <Send size={20} />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-slate-400 hover:text-[#fca311] hover:bg-white/5"
          >
            <a
              href={CONTACT.EMAIL}
              {...EXTERNAL_LINK_ATTRS}
              title="Email"
            >
              <Mail size={20} />
            </a>
          </Button>
        </div>

        {/* Download PDF */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrint}
          className="text-slate-400 hover:text-[#fca311] hover:bg-white/5"
          title="Download PDF"
        >
          <Download size={20} />
        </Button>
      </div>

      {/* Spacer to push everything to top */}
      <div className="flex-1" />

    </aside>
  );
}
