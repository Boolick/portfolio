'use client';

import { Languages, Download, Mail, Linkedin, Github, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings } from '@/data/resume-data';

export function Header() {
  const { locale, toggleLocale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8 print:mb-4"
    >
      {/* Controls - hidden on print */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          aria-label="Toggle language"
        >
          <Languages size={18} />
          {locale.toUpperCase()}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Download size={18} />
          {ui.downloadPdf}
        </button>
      </div>

      {/* Name & Title */}
      <div className="text-center mb-6 print:text-left print:mb-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 print:text-3xl">
          {data.name}
        </h1>
        <p className="text-xl text-slate-600 print:text-lg">
          {data.title}
        </p>
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 print:justify-start print:gap-3 print:text-xs">
        <a
          href={`mailto:${data.contacts.email}`}
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
        >
          <Mail size={16} className="print:w-3 print:h-3" />
          {data.contacts.email}
        </a>
        <a
          href={`https://${data.contacts.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
        >
          <Linkedin size={16} className="print:w-3 print:h-3" />
          {data.contacts.linkedin}
        </a>
        <a
          href={`https://${data.contacts.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
        >
          <Github size={16} className="print:w-3 print:h-3" />
          {data.contacts.github}
        </a>
        <a
          href={`https://t.me/${data.contacts.telegram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
        >
          <MessageCircle size={16} className="print:w-3 print:h-3" />
          {data.contacts.telegram}
        </a>
        <span className="flex items-center gap-1.5">
          <MapPin size={16} className="print:w-3 print:h-3" />
          {data.contacts.location}
        </span>
      </div>
    </motion.header>
  );
}
