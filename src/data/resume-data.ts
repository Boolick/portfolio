export type Locale = "en" | "ru";

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  stack: string[];
  isCommercial?: boolean;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  contacts: {
    email: string;
    linkedin: string;
    telegram: string;
    location: string;
  };
  summary: string;
  whyMe?: string; // "Why am I the best?" - competitive advantage section
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: {
    degree: string;
    institution: string;
    year: string;
    additional?: string[];
  };
  languages: {
    name: string;
    level: string;
  }[];
}

const resumeDataEN: ResumeData = {
  name: "Alexander Bullo",
  title: "Frontend Developer · React · Next.js · TypeScript",
  contacts: {
    email: "bullo.aliaksandr@gmail.com",
    linkedin: "linkedin.com/in/aliaksandr-bullo",
    telegram: "@boolodev",
    location: "Remote | Open to relocation",
  },
  summary: `Frontend Developer with 3+ years of experience in the React ecosystem. Specializing in SPA/SSR applications, real-time functionality, and Telegram Mini Apps. Currently developing two commercial projects with proven production results.`,
  whyMe: `Before transitioning to frontend development, I spent 11 years as a Production Engineer working with complex industrial systems. This background gives me a unique advantage: systematic thinking, attention to critical details, and experience managing high-stakes production environments where failures have real consequences. I bring engineering discipline to software development — not just writing code, but building reliable systems.`,
  experience: [
    {
      title: "Frontend Developer",
      company: "DEXSA / IPU (Telegram Mini App)",
      location: "Remote",
      period: "August 2025 – Present",
      description: [
        "Built frontend architecture for Telegram Mini App with native-like performance",
        "Developed 30+ UI components following Feature-Sliced Design",
        "Created notification pipeline: Supabase → Next.js API → Telegram Bot (98% delivery, <3s latency)",
        "Resolved iOS WebView-specific issues (video upload, navigation, safe area)",
        "Integrating Telegram Stars payment system for monetization",
      ],
      stack: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "TanStack Query",
        "Supabase",
      ],
      isCommercial: true,
    },
    {
      title: "Frontend Developer",
      company: "Tower Empire (WebSocket Multiplayer)",
      location: "Remote",
      period: "September 2024 – Present",
      description: [
        "Migrated entire codebase from JavaScript to TypeScript — reduced production bugs by 40%",
        "Designed WebSocket architecture: state sync, reconnect logic, disconnect handling",
        "Developed second game 'Hire for Fun' — full cycle from architecture to deployment",
        "Optimized API calls via RTK Query: eliminated duplication, improved caching",
        "Participated in code reviews and onboarding new developers",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "RTK Query",
        "WebSocket",
        "Bootstrap 5",
      ],
      isCommercial: true,
    },
    {
      title: "Frontend Developer",
      company: "Freelance & Contract Software Engineering",
      location: "Remote",
      period: "2022 – 2024",
      description: [
        "Delivered 10+ web solutions for small businesses and private clients",
        "Specialized in landing pages, SPAs with authentication, and API integration",
        "Implemented modern practices: Feature-Sliced Design, Git-flow workflows, CI/CD pipelines",
      ],
      stack: ["JavaScript", "React", "Redux", "HTML5", "CSS3/SCSS"],
      isCommercial: false,
    },
  ],
  skills: [
    {
      name: "Core",
      skills: ["React", "Next.js 14/15", "TypeScript", "TailwindCSS"],
    },
    {
      name: "State & Real-time",
      skills: ["Redux Toolkit", "TanStack Query", "WebSocket", "Zustand"],
    },
    {
      name: "Backend & Telegram",
      skills: ["REST API", "Supabase", "TG Mini Apps", "aiogram"],
    },
    {
      name: "Tools",
      skills: ["Git", "Docker", "Vercel", "Figma"],
    },
  ],
  projects: [
    {
      id: "ipu-app",
      title: "IPU App",
      description:
        "Social platform as Telegram Mini App with real-time notifications, gamification, and monetization via Telegram Stars",
      image: "/projects/placeholder-1.svg",
      link: "#",
      tags: ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire",
      description:
        "Browser-based multiplayer card games with real-time WebSocket synchronization",
      image: "/projects/placeholder-2.svg",
      link: "#",
      tags: ["React", "TypeScript", "WebSocket", "RTK Query"],
    },
    {
      id: "portfolio",
      title: "Portfolio",
      description:
        "This resume/portfolio site with Bento Grid layout, bilingual support, and PDF export",
      image: "/projects/placeholder-3.svg",
      link: "#",
      tags: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS"],
    },
    {
      id: "rs-school",
      title: "RS School Projects",
      description:
        "10+ training projects: from landing pages to SPA with API integration and authorization",
      image: "/projects/placeholder-4.svg",
      link: "#",
      tags: ["JavaScript", "React", "Redux", "HTML5"],
    },
  ],
  education: {
    degree: "Higher Technical Education",
    institution: "Belarusian State Technological University (BSTU)",
    year: "2011",
    additional: [
      "RS School — JavaScript/Frontend (Stage 1-2) · 2023–2024",
      "SkyPro — Frontend Developer · 2022–2023",
    ],
  },
  languages: [
    { name: "English", level: "B2 (documentation, correspondence, calls)" },
    { name: "Russian", level: "Native" },
    { name: "Belarusian", level: "Native" },
  ],
};

const resumeDataRU: ResumeData = {
  name: "Александр Булло",
  title: "Frontend Developer · React · Next.js · TypeScript",
  contacts: {
    email: "bullo.aliaksandr@gmail.com",
    linkedin: "linkedin.com/in/aliaksandr-bullo",
    telegram: "@boolodev",
    location: "Удалённо | Готов к релокации",
  },
  summary: `Frontend-разработчик с 3+ годами опыта в React-экосистеме. Специализируюсь на SPA/SSR-приложениях, real-time функционале и Telegram Mini Apps. Сейчас развиваю два коммерческих проекта с подтверждёнными результатами.`,
  whyMe: `До перехода во frontend я 11 лет работал инженером-технологом на производстве сложных промышленных систем. Этот опыт даёт мне уникальное преимущество: системное мышление, внимание к критическим деталям и опыт управления средами, где ошибки имеют реальные последствия. Я привношу инженерную дисциплину в разработку — не просто пишу код, а строю надёжные системы.`,
  experience: [
    {
      title: "Frontend Developer",
      company: "DEXSA / IPU (Telegram Mini App)",
      location: "Удалённо",
      period: "Август 2025 — по настоящее время",
      description: [
        "Разработал архитектуру фронтенда для Telegram Mini App с нативной производительностью",
        "Реализовал 30+ UI-компонентов по Feature-Sliced Design",
        "Создал систему уведомлений: Supabase → Next.js API → Telegram Bot (доставка 98%, latency <3 сек)",
        "Решаю специфичные баги iOS WebView (video upload, navigation, safe area)",
        "Интегрирую платёжную систему Telegram Stars для монетизации",
      ],
      stack: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "TanStack Query",
        "Supabase",
      ],
      isCommercial: true,
    },
    {
      title: "Frontend Developer",
      company: "Tower Empire (WebSocket Multiplayer)",
      location: "Удалённо",
      period: "Сентябрь 2024 — по настоящее время",
      description: [
        "Провёл полную миграцию codebase с JavaScript на TypeScript — снизил количество багов на 40%",
        "Спроектировал WebSocket-архитектуру: синхронизация состояния, reconnect-логика, обработка disconnect",
        "Разработал вторую игру «Найм по фану» — полный цикл от архитектуры до деплоя",
        "Оптимизировал запросы через RTK Query: устранил дублирование, улучшил кеширование",
        "Участвовал в код-ревью и онбординге новых разработчиков",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "RTK Query",
        "WebSocket",
        "Bootstrap 5",
      ],
      isCommercial: true,
    },
    {
      title: "Frontend Developer",
      company: "Фриланс и контрактная разработка",
      location: "Удалённо",
      period: "2022 — 2024",
      description: [
        "Реализовал 10+ веб-решений для малого бизнеса и частных клиентов",
        "Специализация: лендинги, SPA с авторизацией и интеграцией с API",
        "Внедрил современные практики: Feature-Sliced Design, Git-flow, CI/CD",
      ],
      stack: ["JavaScript", "React", "Redux", "HTML5", "CSS3/SCSS"],
      isCommercial: false,
    },
  ],
  skills: [
    {
      name: "Core",
      skills: [
        "JavaScript",
        "React",
        "Next.js 14/15",
        "TypeScript",
        "TailwindCSS",
      ],
    },
    {
      name: "State & Real-time",
      skills: ["Redux Toolkit", "TanStack Query", "WebSocket", "Zustand"],
    },
    {
      name: "Backend & Telegram",
      skills: ["REST API", "Supabase", "TG Mini Apps", "aiogram"],
    },
    {
      name: "Инструменты",
      skills: ["Git", "Docker", "Figma"],
    },
  ],
  projects: [
    {
      id: "ipu-app",
      title: "IPU App",
      description:
        "Социальная платформа TG Mini App с real-time уведомлениями и монетизацией через Telegram Stars",
      image: "/projects/placeholder-1.svg",
      link: "#",
      tags: ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire",
      description:
        "Браузерные мультиплеерные карточные игры с WebSocket-синхронизацией",
      image: "/projects/placeholder-2.svg",
      link: "#",
      tags: ["React", "TypeScript", "WebSocket", "RTK Query"],
    },
    {
      id: "portfolio",
      title: "Портфолио",
      description:
        "Этот сайт-резюме с Bento Grid, двуязычностью и экспортом в PDF",
      image: "/projects/placeholder-3.svg",
      link: "#",
      tags: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS"],
    },
    {
      id: "rs-school",
      title: "RS School Проекты",
      description:
        "10+ учебных проектов: от лендингов до SPA с API и авторизацией",
      image: "/projects/placeholder-4.svg",
      link: "#",
      tags: ["JavaScript", "React", "Redux", "HTML5"],
    },
  ],
  education: {
    degree: "Высшее техническое образование",
    institution:
      "Белорусский государственный технологический университет (БГТУ)",
    year: "2011",
    additional: [
      "RS School — JavaScript/Frontend (Stage 1-2) · 2023–2024",
      "SkyPro — Frontend-разработчик · 2022–2023",
    ],
  },
  languages: [
    { name: "Английский", level: "B2 (документация, переписка, созвоны)" },
    { name: "Русский", level: "Родной" },
    { name: "Беларуская", level: "Родной" },
  ],
};

export const resumeData: Record<Locale, ResumeData> = {
  en: resumeDataEN,
  ru: resumeDataRU,
};

export const uiStrings: Record<
  Locale,
  {
    downloadPdf: string;
    experience: string;
    commercialExperience: string;
    projectExperience: string;
    skills: string;
    education: string;
    languages: string;
    contact: string;
    projects: string;
    additionalEducation: string;
    aboutMe: string;
    whyMe: string;
  }
> = {
  en: {
    downloadPdf: "Download PDF",
    experience: "Experience",
    commercialExperience: "Commercial Experience",
    projectExperience: "Project Experience",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    contact: "Contact",
    projects: "Projects",
    additionalEducation: "Professional Development",
    aboutMe: "About Me",
    whyMe: "Why Me?",
  },
  ru: {
    downloadPdf: "Скачать PDF",
    experience: "Опыт работы",
    commercialExperience: "Коммерческий опыт",
    projectExperience: "Проектный опыт",
    skills: "Навыки",
    education: "Образование",
    languages: "Языки",
    contact: "Контакты",
    projects: "Проекты",
    additionalEducation: "Профессиональное развитие",
    aboutMe: "О себе",
    whyMe: "Почему я?",
  },
};
