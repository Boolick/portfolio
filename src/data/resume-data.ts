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
  longDescription?: string;
  outcomes?: string;
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
  title: "Fullstack Product Engineer (React, Next.js, TypeScript, Node.js)",
  contacts: {
    email: CONTACT.EMAIL.en,
    linkedin: SOCIAL_LINKS.LINKEDIN,
    telegram: SOCIAL_LINKS.TELEGRAM,
    location: CONTACT.LOCATION,
  },
  statusBadge: {
    location: "Hanoi, Vietnam (UTC+7) · Remote",
    format: "Full-time / B2B Contract",
    availability: "Open to offers",
  },
  summary: `I design and ship end-to-end web platforms, B2B services, and Telegram Mini Apps — from responsive interfaces to resilient backends, payment flows, and production deployment.`,
  whyMe: `I approach software as a dependable engineering system: a product must load fast, protect transactions and data on unstable networks, and scale cleanly as the business grows. Combining commercial fullstack engineering with an industrial operations leadership background, I bridge clean code architecture with real business economics.`,
  whyMeIntro: `Fullstack Product Engineer combining modern TypeScript web architecture with an industrial operations background.`,
  whyMePoints: [
    {
      icon: "01",
      title: "Systems Architecture",
      text: "Design modular client architectures (FSD), enforce strict typing contracts, and build automated CI/CD pipelines.",
    },
    {
      icon: "02",
      title: "Performance & Reliability",
      text: "Optimize Largest Contentful Paint (LCP < 1.8s) and engineer sub-100ms real-time sync with resilient offline recovery.",
    },
    {
      icon: "03",
      title: "Product Execution",
      text: "Transform business workflows into digital products: Telegram Stars checkout, headless CMS integration, and automated ops.",
    },
    {
      icon: "04",
      title: "AI-Accelerated Delivery",
      text: "Apply AI-assisted workflows (Claude Code, Cursor, MCP) for rapid decomposition, comprehensive testing, and edge-case verification.",
    },
  ],
  experience: [
    {
      title: "Fullstack & Product Engineer (Contract)",
      company: "DKMline — B2B E-commerce Platform",
      location: "Remote",
      period: "Apr 2026 — Present",
      description: [
        "Designed the PostgreSQL schema, Payload CMS access model, and Next.js Server Actions with end-to-end Zod contract validation.",
        "Implemented SSR and Redis catalog caching strategies alongside media optimization and technical SEO (Schema.org, dynamic metadata).",
        "Containerized the stack with Docker Compose on a Linux VPS and integrated automated order webhooks via Telegram Bot API.",
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
      title: "Fullstack / Frontend Engineer (React / Next.js)",
      company: "DEXSA — Telegram Mini App & Social Platform",
      location: "Remote",
      period: "Jun 2025 — Apr 2026",
      description: [
        "Architected a modular Feature-Sliced Design (FSD) frontend, isolating TanStack Query server cache from Zustand UI state.",
        "Co-designed REST API contracts and built backend endpoints plus a timezone-aware notification scheduler (SQL, pg_cron).",
        "Unit-tested critical payment and state transitions and resolved iOS/Android Telegram WebView layout and media constraints.",
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
        "Standardized strict TypeScript contracts across REST and WebSocket layers and established code review quality standards.",
        "Engineered the client real-time transport (message queuing, exponential backoff, session recovery) and normalized state caching.",
        "Built Vite bundle optimization and CI/CD quality gates in GitHub Actions and GitLab CI with Vitest and Playwright E2E tests.",
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
      ],
      isCommercial: true,
    },
    {
      title: "Head of Manufacturing Operations / Director",
      company: "Full-Cycle Manufacturing Enterprise",
      location: "Minsk",
      period: "2011 — 2022",
      description: [
        "Directed end-to-end manufacturing operations and engineering teams across capacity planning, process discipline, and CNC automation.",
        "Built quality-control pipelines and unit-economics tracking (+180% output efficiency) — forming a lasting foundation for systems engineering in software.",
      ],
      stack: ["Process Engineering", "Quality Systems", "Automation", "Unit Economics"],
      isCommercial: false,
    },
  ],
  skills: [
    {
      name: "Frontend & UI Architecture",
      skills: [
        "React 19",
        "Next.js 14-16 (App Router)",
        "TypeScript (Strict)",
        "Tailwind CSS v4",
        "Feature-Sliced Design (FSD)",
        "SSR / SSG / ISR",
        "Radix UI",
      ],
    },
    {
      name: "Backend, Data & Real-Time",
      skills: [
        "Node.js",
        "NestJS",
        "FastAPI (Python)",
        "PostgreSQL",
        "Redis",
        "WebSockets",
        "Supabase (Realtime & RLS)",
        "TanStack Query",
        "Zustand",
        "Zod",
      ],
    },
    {
      name: "DevOps, Quality & Testing",
      skills: [
        "Docker & Compose",
        "GitHub Actions",
        "GitLab CI",
        "Nginx",
        "Linux VPS",
        "Playwright (E2E)",
        "Vitest / Jest",
        "Core Web Vitals",
      ],
    },
    {
      name: "Product Integrations & AI Workflow",
      skills: [
        "Telegram Mini Apps SDK",
        "Telegram Stars & Bot API",
        "Payload CMS",
        "Technical SEO",
        "Claude Code & Cursor",
        "MCP Tooling",
      ],
    },
  ],
  projects: [
    {
      id: "dkmline",
      title: "DKMline — Industrial Packaging B2B Platform",
      description:
        "Transformed a packaging manufacturer's wholesale intake from manual inquiries into a full-cycle digital platform. Engineered a fast server-rendered catalog, a self-service CMS for managers, and instant order routing straight to Telegram.",
      longDescription: `## Business Challenge
An industrial packaging manufacturer needed to replace manual phone-and-messenger order intake with a fast, searchable B2B catalog while giving sales managers full autonomy over product listings without developer intervention.

## Architecture & Key Decisions
Architected and deployed an end-to-end platform on Next.js App Router (SSR, Server Actions) backed by Payload CMS 3 and PostgreSQL. Enforced strict client-server payload validation with Zod, added a Redis caching layer to shield the database during traffic spikes, containerized the stack with Docker Compose on a VPS, and automated real-time order alerts via the Telegram Bot API.

## Measurable Impact
Cut catalog Largest Contentful Paint (LCP) from 2.8s to 1.8s, shipped full technical SEO infrastructure (Schema.org, dynamic sitemaps), and turned offline inquiries into a trackable digital order pipeline.`,
      outcomes: "1.8s catalog LCP · Automated B2B order funnel · Reduced DB load via Redis caching",
      image: "/projects/dkmline.png",
      link: "https://dkmline.netlify.app/",
      tags: ["Next.js 16", "React", "TypeScript", "PostgreSQL", "Redis", "Payload CMS 3", "Docker", "Zod"],
    },
    {
      id: "dexsa",
      title: "DEXSA — Social Platform & Telegram Mini App",
      description:
        "Built the client architecture and payment pipeline for a mobile social app inside Telegram. Shipped a resilient Telegram Stars checkout resistant to network drops, live feed synchronization without page reloads, and native-grade WebView ergonomics on iOS and Android.",
      longDescription: `## Business Challenge
A fast-growing social product inside Telegram needed a native-feeling mobile interface capable of instant multi-user feed updates and rock-solid in-app monetization over flaky mobile connections.

## Architecture & Key Decisions
Structured the frontend with Feature-Sliced Design (FSD), cleanly separating server cache (TanStack Query) from UI state (Zustand) with list virtualization. Engineered an end-to-end Telegram Stars checkout flow featuring explicit transaction states, retry policies, and strict Zod validation. Integrated Supabase Realtime with optimistic updates and built a timezone-aware backend notification scheduler (SQL, pg_cron, Telegram Bot API).

## Measurable Impact
Eliminated checkout stalls and duplicate charges, achieved zero-reload real-time feed updates, and delivered smooth iOS/Android WebView ergonomics across safe areas, virtual keyboards, and streaming video.`,
      outcomes: "Zero-drop payment flow · Real-time state sync · Native mobile WebView UX",
      image: "/projects/dexsa.png",
      link: "https://t.me/ipu_promise_bot",
      tags: ["Next.js", "React", "TypeScript", "FSD", "TanStack Query", "Zustand", "Supabase Realtime", "Telegram API", "Zod"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire — Real-Time Multiplayer Web Platform",
      description:
        "Owned frontend architecture and runtime reliability under peak multiplayer concurrency. Led a seamless legacy JavaScript-to-TypeScript migration, engineered a sub-100ms WebSocket synchronization layer with automatic session recovery, and automated CI/CD quality gates.",
      longDescription: `## Business Challenge
An active multiplayer web platform needed to curb production regressions during feature rollouts, eliminate state desynchronization on brief network drops, and speed up release delivery.

## Architecture & Key Decisions
Led an incremental migration from legacy JavaScript to strict TypeScript with unified contracts across REST and WebSocket payloads. Engineered a custom WebSocket transport layer from scratch (event protocol, heartbeats, exponential-backoff reconnects, and session recovery). Normalized client caching with RTK Query and Zustand, optimized Vite bundle splitting, and built GitHub Actions / GitLab CI pipelines gated by Vitest and Playwright E2E suites.

## Measurable Impact
Reduced production regression bugs by 40%, maintained sub-100ms state synchronization under peak load, and established fast, predictable deployments.`,
      outcomes: "-40% production regressions · Sub-100ms WebSocket sync · Automated CI/CD & E2E gates",
      image: "/projects/tower-empire.png",
      link: "https://tower-empire.ru/",
      tags: ["React", "TypeScript", "WebSocket", "Redux Toolkit", "RTK Query", "Zustand", "Vite", "Playwright", "CI/CD"],
    },
    {
      id: "portfolio",
      title: "Custom Engineering Showcase, Telegram Mini App & CMS",
      description:
        "The platform you are viewing is engineered on Next.js 16 App Router, React 19, and Tailwind CSS v4 — featuring fast server rendering, native Telegram Mini App ergonomics, and a role-protected Supabase CMS with On-demand ISR.",
      longDescription: `## Business Challenge
Create a cohesive personal engineering showcase that communicates discipline, high-load fullstack capability, and design fidelity to recruiters, engineering leads, and business clients alike.

## Architecture & Key Decisions
Engineered with Next.js 16 App Router, React 19, and Tailwind CSS v4 without heavy runtime dependencies. Implemented dual-locale rendering (EN/RU), an authenticated Supabase management portal with Row-Level Security, On-demand ISR cache revalidation, and integrated Telegram visitor analytics.

## Measurable Impact
100% Google Lighthouse score capability, zero runtime hydration layout shifts, and full dynamic CMS control.`,
      outcomes: "Next.js 16 App Router · Supabase RLS CMS · Telegram Mini App",
      image: "/projects/portfolio.png",
      link: "https://resumeportfoliocv.netlify.app/",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Telegram Mini App"],
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
      level: "B2 (Working proficiency, technical documentation, code review)",
    },
    {
      name: "Belarusian",
      level: "Native",
    },
  ],
};

const resumeDataRU: ResumeData = {
  name: "Александр Булло",
  title: "Fullstack Product Engineer (React, Next.js, TypeScript, Node.js)",
  contacts: {
    email: CONTACT.EMAIL.ru,
    linkedin: SOCIAL_LINKS.LINKEDIN,
    telegram: SOCIAL_LINKS.TELEGRAM,
    location: CONTACT.LOCATION_RU,
  },
  statusBadge: {
    location: "Ханой, Вьетнам (UTC+7) · Удалённо",
    format: "Full-time / Проектный контракт",
    availability: "Открыт к предложениям",
  },
  summary: `Проектирую и запускаю веб-платформы, B2B-сервисы и Telegram Mini Apps полного цикла — от быстрого интерфейса до надёжного бэкенда, платежей и выкладки в продакшн.`,
  whyMe: `Отношусь к разработке как к созданию надёжной инженерной системы: продукт должен быстро загружаться, не терять данные и деньги при сбоях сети и спокойно масштабироваться с ростом бизнеса. Сочетаю коммерческую fullstack-разработку с многолетним опытом управления реальным производством — одинаково хорошо понимаю и архитектуру кода, и экономику продукта.`,
  whyMeIntro: `Fullstack Product Engineer, сочетающий современную веб-разработку на TypeScript с опытом руководства реальным производством.`,
  whyMePoints: [
    {
      icon: "01",
      title: "Архитектурный подход",
      text: "Проектирование масштабируемой клиентской архитектуры (FSD), строгая типизация и прозрачный CI/CD.",
    },
    {
      icon: "02",
      title: "Фокус на надёжности",
      text: "Ускорение загрузки (LCP < 1.8s) и проектирование real-time коммуникаций (WebSockets / Supabase) с защитой от сбоев.",
    },
    {
      icon: "03",
      title: "Продуктовый фокус",
      text: "Перевод офлайн-процессов в цифровые воронки, интеграция Telegram Stars и работа с Headless CMS.",
    },
    {
      icon: "04",
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
        "Спроектировал схему БД в PostgreSQL, ролевую модель Payload CMS и серверные мутации Next.js со сквозной валидацией контрактов на Zod.",
        "Выстроил стратегию серверного рендеринга и Redis-кэширования каталога, оптимизировал медиа-пайплайн и техническое SEO (Schema.org, метаданные).",
        "Контейнеризировал приложение (Docker Compose), настроил продакшн-окружение на VPS и интегрировал вебхук-уведомления в Telegram Bot API.",
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
      title: "Fullstack / Frontend Engineer (React / Next.js)",
      company: "DEXSA — Telegram Mini App & Social Platform",
      location: "Удалённо",
      period: "Июнь 2025 — Апрель 2026",
      description: [
        "Заложил модульную клиентскую архитектуру по Feature-Sliced Design (FSD), изолировав серверный кэш (TanStack Query) от UI-состояния (Zustand).",
        "Совместно с бэкендом спроектировал REST-контракты, написал серверные эндпоинты и планировщик уведомлений по часовым поясам (SQL, pg_cron).",
        "Покрыл критичную платёжную и бизнес-логику unit-тестами, обеспечил адаптацию под ограничения мобильных WebView на iOS и Android.",
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
        "Стандартизировал типизацию кодовой базы (TypeScript strict mode, общие схемы событий API и WebSockets) и проводил регулярное code review.",
        "Разработал клиентский транспорт реального времени (очередь сообщений, экспоненциальный backoff, восстановление сессии) и нормализованный слой кэширования.",
        "Настроил сборочный конвейер (Vite code-splitting) и автоматические проверки качества в GitHub Actions / GitLab CI (линтеры, Vitest, Playwright E2E).",
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
      ],
      isCommercial: true,
    },
    {
      title: "Начальник производства / Директор",
      company: "Промышленное производство полного цикла",
      location: "Минск",
      period: "2011 — 2022",
      description: [
        "Руководил полным производственным циклом и инженерной командой: планирование загрузки, технологическая дисциплина, внедрение автоматизации и ЧПУ.",
        "Выстроил сквозной контроль качества и расчёт себестоимости продукции, повысив эффективность выпуска на 180% — управленческий фундамент системной работы в IT.",
      ],
      stack: ["Инженерные процессы", "Контроль качества", "Автоматизация", "Юнит-экономика"],
      isCommercial: false,
    },
  ],
  skills: [
    {
      name: "Frontend и архитектура UI",
      skills: [
        "React 19",
        "Next.js 14–16 (App Router)",
        "TypeScript (Strict)",
        "Tailwind CSS v4",
        "Feature-Sliced Design (FSD)",
        "SSR / SSG / ISR",
        "Radix UI",
      ],
    },
    {
      name: "Бэкенд, БД и Real-Time",
      skills: [
        "Node.js",
        "NestJS",
        "FastAPI (Python)",
        "PostgreSQL",
        "Redis",
        "WebSockets",
        "Supabase (Realtime & RLS)",
        "TanStack Query",
        "Zustand",
        "Zod",
      ],
    },
    {
      name: "Инфраструктура и автотесты",
      skills: [
        "Docker & Compose",
        "GitHub Actions",
        "GitLab CI",
        "Nginx",
        "Linux VPS",
        "Playwright (E2E)",
        "Vitest / Jest",
        "Core Web Vitals",
      ],
    },
    {
      name: "Продуктовые интеграции и AI",
      skills: [
        "Telegram Mini Apps SDK",
        "Telegram Stars & Bot API",
        "Payload CMS",
        "Technical SEO",
        "Claude Code & Cursor",
        "MCP Tooling",
      ],
    },
  ],
  projects: [
    {
      id: "dkmline",
      title: "DKMline — B2B-платформа промышленной упаковки",
      description:
        "Перевёл оптовые продажи производителя из ручного приёма заявок в цифровую платформу полного цикла. Спроектировал быстрый каталог с серверным рендерингом, удобную панель управления товарами для менеджеров и мгновенную доставку заказов напрямую в Telegram.",
      longDescription: `## Задача бизнеса
Производителю промышленной упаковки требовалось уйти от обработки заявок вручную по звонкам и мессенджерам, дать оптовым клиентам быстрый онлайн-каталог с актуальными характеристиками и позволить менеджерам обновлять ассортимент без участия разработчика.

## Архитектура и ключевые решения
Спроектировал и развернул платформу полного цикла на Next.js App Router (SSR, Server Actions) в связке с Payload CMS 3 и реляционной схемой в PostgreSQL. Внедрил строгую валидацию входящих данных через Zod на границе клиента и сервера, настроил кэширование каталога в Redis для защиты базы при пиковых обращениях, упаковал инфраструктуру в Docker Compose на VPS и подключил мгновенные уведомления о новых заказах через Telegram Bot API.

## Измеримый итог
Скорость загрузки ключевых страниц (LCP) снижена с 2.8 с до 1.8 с, настроена полная SEO-индексация (Schema.org, динамический sitemap), а приём оптовых заявок переведён в прозрачную цифровую воронку без потерь обращений.`,
      outcomes: "Загрузка каталога за 1.8 с · Автоматизация B2B-заказов · Снижение нагрузки на БД через Redis",
      image: "/projects/dkmline.png",
      link: "https://dkmline.netlify.app/",
      tags: ["Next.js 16", "React", "TypeScript", "PostgreSQL", "Redis", "Payload CMS 3", "Docker", "Zod"],
    },
    {
      id: "dexsa",
      title: "DEXSA — Социальная платформа и Telegram Mini App",
      description:
        "Разработал клиентскую архитектуру и платёжный контур для мобильного приложения внутри Telegram. Реализовал безошибочную оплату через Telegram Stars с защитой от обрывов связи, живое обновление лент без перезагрузки экрана и нативную адаптацию под iOS и Android.",
      longDescription: `## Задача бизнеса
Быстрорастущему социальному сервису внутри Telegram требовался отзывчивый мобильный интерфейс, который ощущается как нативное приложение, мгновенно отображает действия других пользователей и безопасно проводит встроенные платежи даже на нестабильном мобильном интернете.

## Архитектура и ключевые решения
Выстроил модульную архитектуру на базе Feature-Sliced Design (FSD), разделив серверный кэш (TanStack Query) и локальное состояние интерфейса (Zustand), добавил виртуализацию длинных списков. Спроектировал полный цикл оплаты через Telegram Stars с контролем состояний транзакции, ретраями и строгой Zod-валидацией вебхуков. Подключил Supabase Realtime с оптимистичными обновлениями и написал на бэкенде сервис уведомлений с учётом часовых поясов пользователей (SQL, pg_cron).

## Измеримый итог
Исключены зависания и повторные списания на этапе оплаты, ленты событий обновляются мгновенно без перезагрузок, а интерфейс стабильно работает в Telegram WebView с учётом системных отступов (safe-area), экранной клавиатуры и потокового видео.`,
      outcomes: "Безопасный приём платежей без дублей · Синхронизация в реальном времени · Нативный мобильный UX",
      image: "/projects/dexsa.png",
      link: "https://t.me/ipu_promise_bot",
      tags: ["Next.js", "React", "TypeScript", "FSD", "TanStack Query", "Zustand", "Supabase Realtime", "Telegram API", "Zod"],
    },
    {
      id: "tower-empire",
      title: "Tower Empire — Мультиплеерная веб-платформа реального времени",
      description:
        "Отвечал за архитектуру фронтенда и стабильность продукта под высокой пиковой нагрузкой. Провёл бесшовный перевод старой кодовой базы на строгую типизацию, с нуля спроектировал слой мгновенной синхронизации событий с автовосстановлением сессии и выстроил автоматический конвейер проверки релизов.",
      longDescription: `## Задача бизнеса
Живой мультиплеерной платформе требовалось остановить рост регрессионных ошибок при выпуске обновлений, убрать рассинхронизацию игрового состояния при кратковременных разрывах связи и ускорить доставку новых функций в продакшн.

## Архитектура и ключевые решения
Возглавил поэтапную миграцию легаси-кода с JavaScript на строгий TypeScript с едиными контрактами для REST API и сокет-событий. Разработал с нуля отказоустойчивый WebSocket-слой (протокол событий, heartbeat-проверки, автоматический реконнект с экспоненциальным backoff и бесшовное восстановление сессии). Нормализовал клиентский кэш на RTK Query и Zustand, настроил code-splitting в Vite и внедрил CI/CD (GitHub Actions, GitLab CI) с автотестами на Vitest и Playwright.

## Измеримый итог
Количество регрессионных багов в продакшне снизилось на 40%, задержка синхронизации удерживается в пределах 100 мс на пике онлайна, а выпуск релизов стал быстрым и предсказуемым.`,
      outcomes: "-40% багов в продакшне · Синхронизация событий < 100 мс · Автоматизированный CI/CD и E2E-тесты",
      image: "/projects/tower-empire.png",
      link: "https://tower-empire.ru/",
      tags: ["React", "TypeScript", "WebSocket", "Redux Toolkit", "RTK Query", "Zustand", "Vite", "Playwright", "CI/CD"],
    },
    {
      id: "portfolio",
      title: "Собственная инженерная витрина, Telegram Mini App и CMS",
      description:
        "Сайт, на котором вы находитесь, спроектирован как отказоустойчивое приложение на Next.js 16 App Router, React 19 и Tailwind CSS v4: мгновенный серверный рендеринг, нативная работа внутри Telegram Mini App и защищённая ролевая админ-панель на базе Supabase (RLS + On-demand ISR).",
      longDescription: `## Задача бизнеса
Создать цельную персональную платформу, которая подтверждает инженерную культуру, дисциплину и качество реализации для рекрутеров, техлидов и прямых клиентов бизнеса.

## Архитектура и ключевые решения
Построено на Next.js 16 App Router, React 19 и Tailwind CSS v4 без тяжёлых сторонних библиотек. Поддерживает двуязычность (RU/EN), авторизацию и управление через Supabase с Row-Level Security, On-demand ISR ревалидацию кэша и встроенную аналитику посетителей через Telegram.

## Измеримый итог
Высокая скорость загрузки (100% Core Web Vitals), нулевой сдвиг макета при гидратации и полный контроль над контентом через динамическую админ-панель.`,
      outcomes: "Next.js 16 App Router · Supabase RLS CMS · Telegram Mini App",
      image: "/projects/portfolio.png",
      link: "https://resumeportfoliocv.netlify.app/",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Telegram Mini App"],
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

export const uiStrings = {
  en: {
    downloadPdf: "Download CV (PDF)",
    whyMe: "Why Me?",
    skills: "Skills",
    techStack: "Tech Stack",
    experience: "Work Experience",
    projects: "Featured Projects",
    education: "Education",
    educationHigher: "Higher Education",
    additionalEducation: "Professional Development & Courses",
    languages: "Languages",
    aboutMe: "About Me",
    summary: "Summary",
    contacts: "Contacts",
  },
  ru: {
    downloadPdf: "Скачать резюме (PDF)",
    whyMe: "Почему именно я?",
    skills: "Навыки",
    techStack: "Технологии",
    experience: "Опыт работы",
    projects: "Проекты",
    education: "Образование",
    educationHigher: "Высшее образование",
    additionalEducation: "Курсы и повышение квалификации",
    languages: "Языки",
    aboutMe: "Обо мне",
    summary: "О себе",
    contacts: "Контакты",
  },
};
