import { SOCIAL_LINKS, CONTACT } from "@/shared/constants/social-links";

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

export interface StatusBadge {
  location: string;
  format: string;
  availability: string;
}

export interface WhyMePoint {
  icon: string;
  title: string;
  text: string;
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
  statusBadge: StatusBadge;
  summary: string;
  whyMe?: string;
  whyMeIntro?: string;
  whyMePoints?: WhyMePoint[];
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
  name: "Aliaksandr Bullo",
  title: "Fullstack Developer (Node.js, NestJS, React, TypeScript)",
  contacts: {
    email: CONTACT.EMAIL.en,
    linkedin: SOCIAL_LINKS.LINKEDIN,
    telegram: SOCIAL_LINKS.TELEGRAM,
    location: CONTACT.LOCATION,
  },
  statusBadge: {
    location: "Hanoi, Vietnam (UTC+7)",
    format: "Remote · Full-time / B2B Contract",
    availability: "Open to offers",
  },
  summary: `Fullstack engineer focused on React, Next.js and TypeScript, with hands-on Node.js/NestJS/PostgreSQL backend experience. 11-year industrial engineering leadership background bringing systems discipline, scalable FSD architecture, and fault-tolerant real-time UX.`,
  whyMe: `My approach extends far beyond building visual components. With an 11-year industrial engineering background, I architect web applications as mission-critical systems: designing scalable FSD architecture, strict type contracts, reliable server-side data models, and automated CI/CD pipelines.`,
  whyMeIntro: `Fullstack Developer with an 11-year technical background. I don't just build interfaces — I approach web applications as complex engineering systems.`,
  whyMePoints: [
    {
      icon: "🛠",
      title: "Architectural Approach",
      text: "Design scalable client-side architecture (FSD), enforce strict typing, and build transparent CI/CD processes.",
    },
    {
      icon: "⚡",
      title: "Performance Focus",
      text: "Accelerate interface loading (LCP < 1.8s) and design real-time communications (WebSockets / Supabase Realtime) with near-zero latency.",
    },
    {
      icon: "📈",
      title: "Business-Oriented",
      text: "Transform business workflows into digital products, integrating Telegram Stars payments and headless CMS platforms.",
    },
    {
      icon: "🤖",
      title: "AI-Assisted Delivery",
      text: "Utilize AI workflows (Claude Code, Cursor, Codex) to accelerate feature implementation, write comprehensive tests, and debug edge cases.",
    },
  ],
  experience: [
    {
      title: "Fullstack & Product Engineer (Contract)",
      company: "DKMline — B2B E-commerce Platform",
      location: "Remote",
      period: "Apr 2026 — Present",
      description: [
        "Built the platform on Next.js App Router (SSR, Server Actions) with Payload CMS and PostgreSQL; data validation with Zod.",
        "Cut LCP from 2.8s to 1.8s via image optimization, lazy loading and server rendering; shipped SEO infrastructure (sitemap, robots, Schema.org).",
        "Configured Redis caching for catalog data to reduce database load; containerized the stack with Docker Compose and deployed to a VPS.",
        "Replaced offline order intake with a digital funnel and Telegram Bot API notifications.",
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Payload CMS",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Zod",
      ],
      isCommercial: true,
    },
    {
      title: "Fullstack / Frontend Developer (React / Next.js)",
      company: "DEXSA — Telegram Mini App & Social Platform",
      location: "Remote",
      period: "Jun 2025 — Apr 2026",
      description: [
        "Built the client architecture on React and FSD: isolated modules, server cache (TanStack Query) separated from UI state (Zustand); list and table virtualization.",
        "Implemented the Telegram Stars checkout flow: transaction states, external API confirmations, retries, strict Zod payload validation.",
        "Integrated Supabase Realtime (optimistic updates, infinite queries, retry logic) so the UI updates without reloads.",
        "Co-designed API contracts with the backend team; wrote backend endpoints and a timezone-aware notification service (SQL, pg_cron, Telegram Bot API).",
        "Adapted the UI to Telegram WebViews on iOS and Android (safe areas, on-screen keyboard, streaming video); unit-tested critical business logic.",
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "TanStack Query",
        "Zustand",
        "FSD",
        "Zod",
        "NestJS / FastAPI",
        "PostgreSQL (Supabase)",
        "Telegram Bot API",
      ],
      isCommercial: true,
    },
    {
      title: "Core Frontend Engineer / Architecture Owner",
      company: "Tower Empire — Real-Time Multiplayer Web Platform",
      location: "Remote",
      period: "May 2023 — Jun 2025",
      description: [
        "Led legacy migration from JavaScript to TypeScript with unified types for API and WebSocket payloads; production regression bugs dropped by 40%.",
        "Designed the WebSocket layer from scratch: event protocol, automatic reconnect with exponential backoff, heartbeats, session recovery; latency under 100ms at peak load.",
        "Set up the data layer with Redux Toolkit, RTK Query and Zustand: normalized cache, optimistic updates, no duplicate requests.",
        "Built CI/CD (GitHub Actions, GitLab CI): linting, builds, Vitest and Playwright E2E on critical flows; faster Vite builds via code splitting and dynamic imports.",
      ],
      stack: [
        "React",
        "TypeScript",
        "WebSockets",
        "Redux Toolkit",
        "RTK Query",
        "Zustand",
        "Vite",
        "Vitest",
        "Playwright",
        "GitHub Actions",
        "GitLab CI",
        "Nginx",
      ],
      isCommercial: true,
    },
  ],
  skills: [
    {
      name: "Frontend Core",
      skills: ["React 18/19", "Next.js 14-16", "TypeScript", "JavaScript ES6+", "Vite", "Server Actions", "SSR/SSG/ISR"],
    },
    {
      name: "UI & Styling",
      skills: ["Tailwind CSS v4", "Radix UI", "Framer Motion", "SCSS", "Design Systems", "Responsive Layouts"],
    },
    {
      name: "State & Data",
      skills: ["TanStack Query", "Redux Toolkit / RTK Query", "Zustand", "WebSockets", "Supabase Realtime", "Zod"],
    },
    {
      name: "Node.js & Backend",
      skills: ["Node.js", "NestJS", "FastAPI (Python)", "PostgreSQL", "Redis", "REST APIs", "SQL"],
    },
    {
      name: "Architecture & Quality",
      skills: ["Feature-Sliced Design (FSD)", "SOLID", "Code Review", "Git Flow", "Core Web Vitals (LCP)"],
    },
    {
      name: "DevOps & Tooling",
      skills: ["Docker", "Docker Compose", "GitHub Actions", "GitLab CI", "Nginx", "VPS", "Vercel"],
    },
    {
      name: "Testing",
      skills: ["Playwright (E2E)", "Vitest", "Jest", "React Testing Library"],
    },
    {
      name: "AI & Productivity",
      skills: ["Claude Code", "Cursor", "MCP Tools", "Task Decomposition", "Test Generation"],
    },
  ],
  projects: [
    {
      id: "dkmline",
      title: "DKMline",
      description:
        "B2B E-commerce & industrial packaging platform: Next.js 16 App Router, Payload CMS 3, PostgreSQL, Redis, LCP reduced from 2.8s to 1.8s.",
      image: "/projects/dkmline.png",
      link: "https://dkmline.netlify.app/",
      tags: ["Next.js 16", "React", "TypeScript", "PostgreSQL", "Redis", "Payload CMS 3", "Docker"],
    },
    {
      id: "dexsa",
      title: "DEXSA · Telegram Mini App",
      description:
        "Fast-growing Telegram Mini App startup: payment workflows with Telegram Stars, Supabase Realtime data sync, and resilient mobile UI.",
      image: "/projects/dexsa.png",
      link: "https://t.me/ipu_promise_bot",
      tags: ["Next.js", "React", "TypeScript", "TanStack Query", "Zustand", "Supabase Realtime"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire",
      description:
        "Real-time multiplayer gaming platform: sub-100ms WebSocket synchronization, complete migration to strict TypeScript, automated CI/CD.",
      image: "/projects/tower-empire.png",
      link: "https://tower-empire.ru/",
      tags: ["React", "TypeScript", "WebSocket", "Redux Toolkit", "RTK Query", "Zustand"],
    },
    {
      id: "portfolio",
      title: "Bento Portfolio & CV",
      description:
        "Bilingual portfolio and CMS dashboard built on Next.js 16 App Router, React 19, Tailwind CSS v4, Supabase RLS, and Framer Motion.",
      image: "/projects/portfolio.png",
      link: "https://resumeportfoliocv.netlify.app/",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase"],
    },
  ],
  education: {
    degree: "Higher Technical / Engineering Degree (Process Engineer)",
    institution: "Belarusian State Technological University (BSTU), Minsk",
    year: "2006 — 2011",
    additional: [
      "RS School — JavaScript/Frontend (Stage 1-2-3): strict merit-based ecosystem, TypeScript, React, complex Git workflows",
      "SkyPro — Frontend Developer: comprehensive training in modern core frontend, component architecture",
    ],
  },
  languages: [
    {
      name: "Russian",
      level: "Native / C2",
    },
    {
      name: "English",
      level: "B2 (Working proficiency, documentation, code review)",
    },
    {
      name: "Belarusian",
      level: "Native",
    },
  ],
};

const resumeDataRU: ResumeData = {
  name: "Александр Булло",
  title: "Fullstack Developer · React / Next.js / Node.js / AI",
  contacts: {
    email: CONTACT.EMAIL.ru,
    linkedin: SOCIAL_LINKS.LINKEDIN,
    telegram: SOCIAL_LINKS.TELEGRAM,
    location: CONTACT.LOCATION_RU,
  },
  statusBadge: {
    location: "Ханой, Вьетнам (UTC+7)",
    format: "Удалённо · Full-time / Контракт",
    availability: "Открыт к предложениям",
  },
  summary: `Fullstack-разработчик (React, Next.js, Node.js, TypeScript) с продуктовым подходом: проектирую и довожу веб-приложения и Telegram Mini Apps от архитектуры до деплоя в прод. FSD, SSR/SSG, real-time WebSockets/Supabase, Docker, Redis, CI/CD. 11 лет руководил инженерными процессами на производстве.`,
  whyMe: `Мой подход выходит далеко за рамки вёрстки компонентов. Опираясь на 11-летний опыт руководства инженерными процессами, я подхожу к веб-приложениям как к надёжным системам: масштабируемая архитектура FSD, строгая типизация, предсказуемый бэкенд и автоматизация релизов.`,
  whyMeIntro: `Fullstack-разработчик с 11-летним инженерным бэкграундом. Я подхожу к разработке веб-приложений как к созданию надёжных инженерных систем.`,
  whyMePoints: [
    {
      icon: "🛠",
      title: "Архитектурный подход",
      text: "Проектирование масштабируемой клиентской архитектуры (FSD), строгая типизация и прозрачный CI/CD.",
    },
    {
      icon: "⚡",
      title: "Фокус на производительности",
      text: "Ускорение загрузки (LCP < 1.8s) и проектирование real-time коммуникаций (WebSockets / Supabase) с минимальной задержкой.",
    },
    {
      icon: "📈",
      title: "Продуктовый фокус",
      text: "Перевод офлайн-процессов в цифровые воронки, интеграция Telegram Stars и работа с Headless CMS.",
    },
    {
      icon: "🤖",
      title: "AI-ускорение разработки",
      text: "Ежедневное применение Claude Code, Cursor и MCP для быстрой декомпозиции, написания тестов и отладки.",
    },
  ],
  experience: [
    {
      title: "Fullstack & Product Engineer (проектная работа)",
      company: "DKMline — B2B E-commerce Platform",
      location: "Удалённо",
      period: "Апрель 2026 — настоящее время",
      description: [
        "Разработал платформу на Next.js App Router (SSR, Server Actions) с Payload CMS и PostgreSQL; валидация данных через Zod.",
        "Снизил LCP с 2.8s до 1.8s: оптимизация изображений, lazy loading, серверный рендеринг; SEO-инфраструктура (sitemap, robots, Schema.org).",
        "Настроил Redis-кэширование каталога, снизив нагрузку на БД; контейнеризировал окружение (Docker Compose) и развернул на VPS.",
        "Перевёл офлайн-приём заказов в цифровую воронку с уведомлениями через Telegram Bot API.",
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Payload CMS",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Zod",
      ],
      isCommercial: true,
    },
    {
      title: "Fullstack / Frontend Developer (React / Next.js)",
      company: "DEXSA — Telegram Mini App & Social Platform",
      location: "Удалённо",
      period: "Июнь 2025 — Апрель 2026",
      description: [
        "Построил клиентскую архитектуру на React и FSD: изолированные модули, серверный кэш (TanStack Query) отдельно от UI-стейта (Zustand); виртуализация больших списков и таблиц.",
        "Реализовал checkout-flow для Telegram Stars: состояния транзакций, подтверждения от внешнего API, ретраи, строгая валидация через Zod.",
        "Подключил Supabase Realtime (optimistic updates, infinite queries, retry-логика) — интерфейс обновляется без перезагрузок.",
        "Совместно с бэкенд-командой согласовывал контракты API и писал backend-эндпоинты и сервис уведомлений с учётом часовых поясов (SQL, pg_cron, Telegram Bot API).",
        "Адаптировал интерфейс под WebView Telegram на iOS и Android: safe-area, экранная клавиатура, потоковое видео; покрыл unit-тестами критичную бизнес-логику.",
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "TanStack Query",
        "Zustand",
        "FSD",
        "Zod",
        "NestJS / FastAPI",
        "PostgreSQL (Supabase)",
        "Telegram Bot API",
      ],
      isCommercial: true,
    },
    {
      title: "Core Frontend Engineer / Architecture Owner",
      company: "Tower Empire — Real-Time Multiplayer Web Platform",
      location: "Удалённо",
      period: "Май 2023 — Июнь 2025",
      description: [
        "Провёл миграцию легаси-кодовой базы с JavaScript на TypeScript: единые типы для API и WebSocket-сообщений; число регрессионных багов в продакшене снизилось на 40%.",
        "Разработал WebSocket-слой с нуля: протокол событий, автоматический реконнект с backoff, heartbeats, восстановление сессий; задержка <100ms при пиковой нагрузке.",
        "Настроил слой данных с Redux Toolkit, RTK Query и Zustand: нормализованный кэш, оптимистичные обновления, отсутствие дублирующих запросов.",
        "Построил CI/CD (GitHub Actions, GitLab CI): линтинг, сборка, Vitest и Playwright E2E на критичных сценариях; оптимизация сборки Vite через code splitting.",
      ],
      stack: [
        "React",
        "TypeScript",
        "WebSockets",
        "Redux Toolkit",
        "RTK Query",
        "Zustand",
        "Vite",
        "Vitest",
        "Playwright",
        "GitHub Actions",
        "GitLab CI",
        "Nginx",
      ],
      isCommercial: true,
    },
  ],
  skills: [
    {
      name: "Frontend",
      skills: ["React 18/19", "Next.js 14-16", "TypeScript", "JavaScript ES6+", "Vite", "Server Actions", "SSR/SSG/ISR"],
    },
    {
      name: "UI и стили",
      skills: ["Tailwind CSS v4", "Radix UI", "Framer Motion", "SCSS", "Дизайн-системы", "Адаптивная вёрстка"],
    },
    {
      name: "Состояние и данные",
      skills: ["TanStack Query", "Redux Toolkit / RTK Query", "Zustand", "WebSockets", "Supabase Realtime", "Zod"],
    },
    {
      name: "Node.js и бэкенд",
      skills: ["Node.js", "NestJS", "FastAPI (Python)", "PostgreSQL", "Redis", "REST APIs", "SQL"],
    },
    {
      name: "Архитектура",
      skills: ["Feature-Sliced Design (FSD)", "SOLID", "Code Review", "Git Flow", "Core Web Vitals (LCP)"],
    },
    {
      name: "CI/CD и инфраструктура",
      skills: ["Docker", "Docker Compose", "GitHub Actions", "GitLab CI", "Nginx", "VPS", "Vercel"],
    },
    {
      name: "Тестирование",
      skills: ["Playwright (E2E)", "Vitest", "Jest", "React Testing Library"],
    },
    {
      name: "AI-инструменты",
      skills: ["Claude Code", "Cursor", "MCP", "Декомпозиция задач", "Генерация тестов"],
    },
  ],
  projects: [
    {
      id: "dkmline",
      title: "DKMline",
      description:
        "B2B-платформа и каталог для производителя промышленной упаковки: Next.js 16, Payload CMS 3, PostgreSQL, Redis, снижение LCP с 2.8s до 1.8s.",
      image: "/projects/dkmline.png",
      link: "https://dkmline.netlify.app/",
      tags: ["Next.js 16", "React", "TypeScript", "PostgreSQL", "Redis", "Payload CMS 3", "Docker"],
    },
    {
      id: "dexsa",
      title: "DEXSA · Telegram Mini App",
      description:
        "Telegram Mini App и социальная платформа: интеграция платежей Telegram Stars, Supabase Realtime синхронизация и оптимизированный мобильный UI.",
      image: "/projects/dexsa.png",
      link: "https://t.me/ipu_promise_bot",
      tags: ["Next.js", "React", "TypeScript", "TanStack Query", "Zustand", "Supabase Realtime"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire",
      description:
        "Игровая мультиплеерная веб-платформа реального времени: WebSocket-синхронизация <100ms, полная миграция на TypeScript, CI/CD.",
      image: "/projects/tower-empire.png",
      link: "https://tower-empire.ru/",
      tags: ["React", "TypeScript", "WebSocket", "Redux Toolkit", "RTK Query", "Zustand"],
    },
    {
      id: "portfolio",
      title: "Bento Портфолио & Резюме",
      description:
        "Двуязычное портфолио с CMS-админкой на базе Next.js 16 App Router, React 19, Tailwind CSS v4, Supabase RLS и Framer Motion.",
      image: "/projects/portfolio.png",
      link: "https://resumeportfoliocv.netlify.app/",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase"],
    },
  ],
  education: {
    degree: "Высшее техническое образование (Инженер-технолог)",
    institution: "Белорусский государственный технологический университет (БГТУ), Минск",
    year: "2006 — 2011",
    additional: [
      "RS School — JavaScript/Frontend (Stage 1-2-3): интенсивная программа, TypeScript, React, Git workflows, peer reviews",
      "SkyPro — Frontend Developer: углублённая подготовка по современному стеку frontend, архитектуре компонентов",
    ],
  },
  languages: [
    {
      name: "Русский",
      level: "Родной / C2",
    },
    {
      name: "Английский",
      level: "B2 (Рабочий уровень: документация, переписка, code review)",
    },
    {
      name: "Белорусский",
      level: "Родной",
    },
  ],
};

export const resumeData = {
  en: resumeDataEN,
  ru: resumeDataRU,
};
