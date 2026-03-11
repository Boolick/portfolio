'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings, ProjectItem } from '@/data/resume-data';
import { SectionBadge } from './ui/section-badge';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  size?: 'large' | 'small' | 'wide';
}

function ProjectCard({ project, index, size = 'small' }: ProjectCardProps) {
  const isLarge = size === 'large';
  const isWide = size === 'wide';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className={`
        group relative block rounded-2xl overflow-hidden 
        bg-[var(--color-primary)]
        border border-white/10 hover:border-[var(--color-accent)]/50 
        shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/10
        hover:scale-[1.02] hover:translate-y-[-2px]
        transition-all duration-300 print:hidden
        ${isLarge ? 'row-span-2' : ''}
        ${isWide ? 'md:col-span-2' : ''}
      `}
    >
      {/* Background preview image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10 group-hover:from-black/100 group-hover:via-black/90 group-hover:to-black/70 transition-all duration-300" />
      
      {/* Accent glow on hover */}
      <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/5 transition-colors duration-300 z-[11]" />
      
      {/* Content */}
      <div className={`relative z-20 h-full flex flex-col justify-end ${isLarge ? 'p-6' : 'p-4'}`}>
        <a 
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 cursor-pointer outline-none rounded-sm group/link w-full pb-1"
          aria-label={`View project: ${project.title}`}
        >
          <h4 className={`font-bold text-white group-hover/link:text-[var(--color-accent)] transition-colors drop-shadow-lg ${isLarge ? 'text-xl' : 'text-base'}`}>
            {project.title}
          </h4>
          <ArrowUpRight 
            className="text-white/50 group-hover/link:text-[var(--color-accent)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200 shrink-0 drop-shadow-lg" 
            size={isLarge ? 20 : 16} 
          />
        </a>
        
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-2">
          <div className="overflow-hidden">
            <p className={`text-gray-300 drop-shadow-md ${isLarge ? 'text-sm' : 'text-xs'}`}>
              {project.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tags.slice(0, isLarge ? 4 : 3).map((tag) => (
                <span
                  key={tag}
                  className="
                    px-2 py-0.5 text-xs bg-black/40 text-gray-200 rounded-full backdrop-blur-sm
                    border border-white/5
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Print-friendly version - simple list without images
function ProjectCardPrint({ project }: { project: ProjectItem }) {
  return (
    <div className="hidden print:block mb-3 pl-4 border-l-2 border-[var(--color-accent)]">
      <h4 className="font-bold text-[var(--color-primary)] text-sm mb-1">
        {project.title}
      </h4>
      <p className="text-gray-600 text-xs mb-2">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { locale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  return (
    <motion.section
      id="desktop-projects"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="mb-10 scroll-mt-6 print:mb-4 print:break-before-avoid"
    >
      <SectionBadge delay={0.3}>
        {ui.projects}
      </SectionBadge>
      
      {/* Bento Grid - 2 large + 2 small */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[160px] print:hidden">
        {data.projects.slice(0, 4).map((project, idx) => {
          let cardSize: 'small' | 'large' | 'wide' = 'small';
          if (idx === 0) cardSize = 'large';
          if (idx === 3) cardSize = 'wide';
          
          return (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={idx}
              size={cardSize}
            />
          );
        })}
      </div>

      {/* Print version - simple list */}
      <div className="hidden print:block">
        {data.projects.map((project) => (
          <ProjectCardPrint key={project.id} project={project} />
        ))}
      </div>
    </motion.section>
  );
}
