export type Locale = 'en' | 'ru';

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  stack: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  contacts: {
    email: string;
    linkedin: string;
    github: string;
    telegram: string;
    location: string;
  };
  summary: string;
  experience: ExperienceItem[];
  skills: SkillCategory[];
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  languages: {
    name: string;
    level: string;
  }[];
}

const resumeDataEN: ResumeData = {
  name: "Alexander Bullo",
  title: "Senior Frontend Developer | Team Lead",
  contacts: {
    email: "your-email@domain.com",
    linkedin: "linkedin.com/in/yourprofile",
    github: "github.com/yourprofile",
    telegram: "@yourhandle",
    location: "Remote / Worldwide",
  },
  summary: `Frontend Developer with 2+ years of hands-on experience building production React/Next.js applications, backed by 11 years of engineering and process optimization background that brings mature leadership, structured thinking, and a results-driven approach to software development.

Currently leading development of a Telegram Mini App with real-time features, notification systems, and database integrations. Previously served as Team Lead at Tower Empire, managing a team of 5 developers and architecting WebSocket-based multiplayer game systems.`,
  experience: [
    {
      title: "Lead Frontend Developer",
      company: "Telegram Mini App Platform",
      location: "Remote",
      period: "2024 – Present",
      description: [
        "Architected real-time notification system using Supabase and Next.js API routes, enabling push notifications with scheduled delivery",
        "Implemented WebSocket-based features for live updates and interactive user experiences within Telegram Mini App",
        "Built responsive React interfaces with Tailwind CSS and Feature-Sliced Design architecture across 30+ components",
        "Integrated Supabase for database operations, authentication, and serverless functions",
        "Solved cross-platform compatibility issues (iOS video uploads, Telegram WebApp quirks)",
      ],
      stack: ["React", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Telegram Mini Apps SDK", "Tailwind CSS"],
    },
    {
      title: "Team Lead / Senior Frontend Developer",
      company: "Tower Empire",
      location: "Remote",
      period: "2023 – 2024",
      description: [
        "Managed a team of 5 developers, conducting code reviews, sprint planning, and technical mentorship",
        "Architected WebSocket communication layer for real-time multiplayer game state synchronization",
        "Implemented RTK Query for efficient server state management, reducing redundant API calls",
        "Built complex game UI components with React and TypeScript handling intricate state transitions",
        "Established development workflows including Git strategies, PR reviews, and deployment pipelines",
      ],
      stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "WebSocket", "Styled Components"],
    },
    {
      title: "Lead Engineer / Technologist",
      company: "Engineering Industry",
      location: "Belarus",
      period: "2011 – 2022",
      description: [
        "Led engineering teams and managed technical projects from planning to delivery",
        "Optimized processes and implemented systematic improvements",
        "Developed structured problem-solving approach now applied to software architecture",
        "Built leadership and communication skills through cross-functional collaboration",
      ],
      stack: [],
    },
  ],
  skills: [
    {
      name: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "RTK Query", "Zustand", "Tailwind CSS"],
    },
    {
      name: "Real-time & State",
      skills: ["WebSocket", "RTK Query", "Redux", "React Query", "Event-driven Architecture"],
    },
    {
      name: "Backend (working knowledge)",
      skills: ["Supabase", "PostgreSQL", "Next.js API Routes", "REST API"],
    },
    {
      name: "Telegram Ecosystem",
      skills: ["Telegram Mini Apps", "Telegram Bot API", "WebApp Authentication"],
    },
    {
      name: "Tools & DevOps",
      skills: ["Git", "GitHub", "Docker", "Vercel", "Figma"],
    },
  ],
  education: {
    degree: "Bachelor of Engineering",
    institution: "Technical University",
    year: "2011",
  },
  languages: [
    { name: "English", level: "Professional working proficiency" },
    { name: "Russian", level: "Native" },
    { name: "Belarusian", level: "Native" },
  ],
};

const resumeDataRU: ResumeData = {
  name: "Александр Булло",
  title: "Senior Frontend Developer | Team Lead",
  contacts: {
    email: "your-email@domain.com",
    linkedin: "linkedin.com/in/yourprofile",
    github: "github.com/yourprofile",
    telegram: "@yourhandle",
    location: "Удалённо / Весь мир",
  },
  summary: `Frontend-разработчик с 2+ годами практического опыта создания production-приложений на React/Next.js, подкреплённый 11 годами инженерного и технологического опыта, который обеспечивает зрелый подход к лидерству, структурное мышление и ориентацию на результат.

Сейчас руковожу разработкой Telegram Mini App с real-time функциями, системой уведомлений и интеграцией баз данных. Ранее работал Team Lead в Tower Empire, управляя командой из 5 разработчиков и проектируя WebSocket-системы для мультиплеерных игр.`,
  experience: [
    {
      title: "Lead Frontend Developer",
      company: "Платформа Telegram Mini App",
      location: "Удалённо",
      period: "2024 – настоящее время",
      description: [
        "Спроектировал систему уведомлений на Supabase и Next.js API routes с запланированной доставкой",
        "Реализовал WebSocket-функционал для live-обновлений в Telegram Mini App",
        "Построил адаптивные React-интерфейсы с Tailwind CSS и архитектурой Feature-Sliced Design (30+ компонентов)",
        "Интегрировал Supabase для работы с БД, аутентификации и serverless-функций",
        "Решил кросс-платформенные проблемы (загрузка iOS-видео, особенности Telegram WebApp)",
      ],
      stack: ["React", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Telegram Mini Apps SDK", "Tailwind CSS"],
    },
    {
      title: "Team Lead / Senior Frontend Developer",
      company: "Tower Empire",
      location: "Удалённо",
      period: "2023 – 2024",
      description: [
        "Управлял командой из 5 разработчиков: код-ревью, планирование спринтов, техническое менторство",
        "Спроектировал WebSocket-коммуникацию для синхронизации игрового состояния в реальном времени",
        "Внедрил RTK Query для эффективного управления серверным состоянием",
        "Разработал игровые UI-компоненты на React и TypeScript со сложными переходами состояний",
        "Выстроил процессы разработки: Git-стратегии, PR-ревью, пайплайны деплоя",
      ],
      stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "WebSocket", "Styled Components"],
    },
    {
      title: "Ведущий инженер / Технолог",
      company: "Инженерная отрасль",
      location: "Беларусь",
      period: "2011 – 2022",
      description: [
        "Руководил инженерными командами и управлял техническими проектами полного цикла",
        "Оптимизировал процессы и внедрял системные улучшения",
        "Развил структурный подход к решению проблем, который теперь применяю в архитектуре ПО",
        "Приобрёл навыки лидерства и коммуникации через кросс-функциональное сотрудничество",
      ],
      stack: [],
    },
  ],
  skills: [
    {
      name: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "RTK Query", "Zustand", "Tailwind CSS"],
    },
    {
      name: "Real-time и State",
      skills: ["WebSocket", "RTK Query", "Redux", "React Query", "Event-driven Architecture"],
    },
    {
      name: "Backend (рабочий уровень)",
      skills: ["Supabase", "PostgreSQL", "Next.js API Routes", "REST API"],
    },
    {
      name: "Telegram-экосистема",
      skills: ["Telegram Mini Apps", "Telegram Bot API", "WebApp Authentication"],
    },
    {
      name: "Инструменты и DevOps",
      skills: ["Git", "GitHub", "Docker", "Vercel", "Figma"],
    },
  ],
  education: {
    degree: "Инженерная специальность",
    institution: "Технический университет",
    year: "2011",
  },
  languages: [
    { name: "Английский", level: "Professional working proficiency" },
    { name: "Русский", level: "Родной" },
    { name: "Белорусский", level: "Родной" },
  ],
};

export const resumeData: Record<Locale, ResumeData> = {
  en: resumeDataEN,
  ru: resumeDataRU,
};

export const uiStrings: Record<Locale, {
  downloadPdf: string;
  experience: string;
  skills: string;
  education: string;
  languages: string;
  contact: string;
}> = {
  en: {
    downloadPdf: "Download PDF",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    contact: "Contact",
  },
  ru: {
    downloadPdf: "Скачать PDF",
    experience: "Опыт работы",
    skills: "Навыки",
    education: "Образование",
    languages: "Языки",
    contact: "Контакты",
  },
};
