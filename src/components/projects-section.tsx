'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings, ProjectItem } from '@/data/resume-data';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  size?: 'large' | 'small';
}

function ProjectCard({ project, index, size = 'small' }: ProjectCardProps) {
  const isLarge = size === 'large';
  
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className={`group relative block rounded-2xl overflow-hidden 
                  bg-gradient-to-br from-[#0a192f] to-slate-800 
                  border border-white/10 hover:border-[#fca311]/50 
                  shadow-lg hover:shadow-2xl hover:scale-[1.02]
                  transition-all duration-300 print:hidden
                  ${isLarge ? 'row-span-2' : ''}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-[#fca311]/0 group-hover:bg-[#fca311]/5 transition-colors duration-300 z-0" />
      
      {/* Project initials background */}
      <div className={`absolute inset-0 flex items-center justify-center ${isLarge ? 'text-8xl' : 'text-5xl'}`}>
        <span className="font-bold text-white/5 group-hover:text-[#fca311]/10 transition-colors duration-300">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
      </div>
      
      {/* Content */}
      <div className={`relative z-20 h-full flex flex-col justify-end ${isLarge ? 'p-6' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-bold text-white group-hover:text-[#fca311] transition-colors ${isLarge ? 'text-xl' : 'text-base'}`}>
            {project.title}
          </h4>
          <ArrowUpRight 
            className="text-white/50 group-hover:text-[#fca311] transition-colors shrink-0" 
            size={isLarge ? 20 : 16} 
          />
        </div>
        
        <p className={`text-gray-400 mt-2 line-clamp-2 ${isLarge ? 'text-sm' : 'text-xs'}`}>
          {project.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.slice(0, isLarge ? 4 : 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-white/10 text-gray-300 rounded-full 
                         group-hover:bg-[#fca311]/20 group-hover:text-[#fca311] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

// Print-friendly version - simple list without images
function ProjectCardPrint({ project }: { project: ProjectItem }) {
  return (
    <div className="hidden print:block mb-3 pl-4 border-l-2 border-[#fca311]">
      <h4 className="font-bold text-[#0a192f] text-sm mb-1">
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
      <div className="flex items-center mb-8 print:mb-3">
        <div className="bg-[#fca311] text-[#0a192f] px-6 py-2 rounded-r-full -ml-6 md:-ml-10 lg:-ml-12 font-bold text-base shadow-sm section-badge print:ml-0 print:rounded-none print:px-3 print:py-1">
          {ui.projects}
        </div>
      </div>
      
      {/* Bento Grid - 2 large + 2 small */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[140px] print:hidden">
        {data.projects.slice(0, 4).map((project, idx) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={idx}
            size={idx === 0 ? 'large' : 'small'}
          />
        ))}
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
