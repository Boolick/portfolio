-- ====================================================================
-- SUPABASE SCHEMA & INITIAL SEED FOR ALIAKSANDR BULLO PORTFOLIO
-- Generated for Next.js 16 + Supabase Admin Portfolio
-- ====================================================================

-- 1. EXTENSIONS & ROLES ENUM
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "user_roles select self or admin" ON public.user_roles;
CREATE POLICY "user_roles select self or admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "user_roles admin manage" ON public.user_roles;
CREATE POLICY "user_roles admin manage" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to automatically grant 'admin' role to bulloalexander77@gmail.com upon registration
CREATE OR REPLACE FUNCTION public.handle_admin_role_on_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.email = 'bulloalexander77@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_admin_on_signup ON auth.users;
CREATE TRIGGER trg_assign_admin_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_role_on_signup();

-- If user already exists in auth.users, assign admin role immediately
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'bulloalexander77@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- 4. PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  summary_en TEXT NOT NULL DEFAULT '',
  summary_ru TEXT NOT NULL DEFAULT '',
  why_me_en TEXT NOT NULL DEFAULT '',
  why_me_ru TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telegram TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  location_en TEXT NOT NULL DEFAULT '',
  location_ru TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile public read" ON public.profile;
CREATE POLICY "profile public read" ON public.profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "profile admin write" ON public.profile;
CREATE POLICY "profile admin write" ON public.profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_profile_upd ON public.profile;
CREATE TRIGGER trg_profile_upd BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  long_description_en TEXT NOT NULL DEFAULT '',
  long_description_ru TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects public read published" ON public.projects;
CREATE POLICY "projects public read published" ON public.projects FOR SELECT
  USING (published = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "projects admin write" ON public.projects;
CREATE POLICY "projects admin write" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_projects_upd ON public.projects;
CREATE TRIGGER trg_projects_upd BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  location_en TEXT NOT NULL DEFAULT '',
  location_ru TEXT NOT NULL DEFAULT '',
  period_en TEXT NOT NULL DEFAULT '',
  period_ru TEXT NOT NULL DEFAULT '',
  description_en TEXT[] NOT NULL DEFAULT '{}',
  description_ru TEXT[] NOT NULL DEFAULT '{}',
  stack TEXT[] NOT NULL DEFAULT '{}',
  is_commercial BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experiences public read" ON public.experiences;
CREATE POLICY "experiences public read" ON public.experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "experiences admin write" ON public.experiences;
CREATE POLICY "experiences admin write" ON public.experiences FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_experiences_upd ON public.experiences;
CREATE TRIGGER trg_experiences_upd BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. SKILL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "skills public read" ON public.skill_categories;
CREATE POLICY "skills public read" ON public.skill_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "skills admin write" ON public.skill_categories;
CREATE POLICY "skills admin write" ON public.skill_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_skills_upd ON public.skill_categories;
CREATE TRIGGER trg_skills_upd BEFORE UPDATE ON public.skill_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree_en TEXT NOT NULL DEFAULT '',
  degree_ru TEXT NOT NULL DEFAULT '',
  institution_en TEXT NOT NULL DEFAULT '',
  institution_ru TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  additional_en TEXT[] NOT NULL DEFAULT '{}',
  additional_ru TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "education public read" ON public.education;
CREATE POLICY "education public read" ON public.education FOR SELECT USING (true);

DROP POLICY IF EXISTS "education admin write" ON public.education;
CREATE POLICY "education admin write" ON public.education FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_education_upd ON public.education;
CREATE TRIGGER trg_education_upd BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 9. LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  level_en TEXT NOT NULL DEFAULT '',
  level_ru TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "languages public read" ON public.languages;
CREATE POLICY "languages public read" ON public.languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "languages admin write" ON public.languages;
CREATE POLICY "languages admin write" ON public.languages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_languages_upd ON public.languages;
CREATE TRIGGER trg_languages_upd BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. STORAGE BUCKET (PROJECT-IMAGES)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "project-images public read" ON storage.objects;
CREATE POLICY "project-images public read" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "project-images admin upload" ON storage.objects;
CREATE POLICY "project-images admin upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "project-images admin update" ON storage.objects;
CREATE POLICY "project-images admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "project-images admin delete" ON storage.objects;
CREATE POLICY "project-images admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));

-- ====================================================================
-- INITIAL DATA SEED (LATEST 2026 FULLSTACK CV CONTENT)
-- ====================================================================

-- 11. PROFILE SEED
DELETE FROM public.profile;
INSERT INTO public.profile (
  name_en, name_ru,
  title_en, title_ru,
  summary_en, summary_ru,
  why_me_en, why_me_ru,
  email, telegram, linkedin,
  location_en, location_ru
) VALUES (
  'Aliaksandr Bullo',
  'Александр Булло',
  'Fullstack Developer (Node.js, NestJS, React, TypeScript)',
  'Fullstack Developer · React / Next.js / Node.js / AI',
  'Fullstack engineer focused on React, Next.js and TypeScript, with hands-on Node.js/NestJS/PostgreSQL backend experience. 11-year industrial engineering leadership background bringing systems discipline, scalable FSD architecture, and fault-tolerant real-time UX.',
  'Fullstack-разработчик (React, Next.js, Node.js, TypeScript) с продуктовым подходом: проектирую и довожу веб-приложения и Telegram Mini Apps от архитектуры до деплоя в прод. FSD, SSR/SSG, real-time WebSockets/Supabase, Docker, Redis, CI/CD. 11 лет руководил инженерными процессами на производстве.',
  'My approach extends far beyond building visual components. With an 11-year industrial engineering background, I architect web applications as mission-critical systems: designing scalable FSD architecture, strict type contracts, reliable server-side data models, and automated CI/CD pipelines.',
  'Мой подход выходит далеко за рамки вёрстки компонентов. Опираясь на 11-летний опыт руководства инженерными процессами, я подхожу к веб-приложениям как к надёжным системам: масштабируемая архитектура FSD, строгая типизация, предсказуемый бэкенд и автоматизация релизов.',
  'bulloalexander77@gmail.com',
  'https://t.me/AlexanderBullo',
  'https://linkedin.com/in/alexander-bullo',
  'Hanoi, Vietnam (UTC+7) · Remote',
  'Ханой, Вьетнам (UTC+7) · Удалённо'
);

-- 12. PROJECTS SEED
DELETE FROM public.projects;
INSERT INTO public.projects (
  slug, title_en, title_ru,
  description_en, description_ru,
  long_description_en, long_description_ru,
  link, image_url, tags, sort_order, published
) VALUES
(
  'dkmline',
  'DKMline',
  'DKMline',
  'B2B E-commerce & industrial packaging platform: Next.js 16 App Router, Payload CMS 3, PostgreSQL, Redis, LCP reduced from 2.8s to 1.8s.',
  'B2B-платформа и каталог для производителя промышленной упаковки: Next.js 16, Payload CMS 3, PostgreSQL, Redis, снижение LCP с 2.8s до 1.8s.',
  'Full-lifecycle development of a high-performance commercial B2B platform: designed relational PostgreSQL schemas, integrated Payload CMS 3, built Server Actions with strict Zod validation, configured Redis caching, and automated digital orders via Telegram Bot API.',
  'Разработка коммерческой B2B-платформы полного цикла: проектирование реляционной схемы PostgreSQL, интеграция Payload CMS 3, Server Actions со строгой Zod-валидацией, Redis-кэширование и автоматизация заказов через Telegram Bot API.',
  'https://dkmline.netlify.app/',
  '/projects/dkmline.png',
  ARRAY['Next.js 16', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Payload CMS 3', 'Docker', 'Zod'],
  0,
  true
),
(
  'dexsa',
  'DEXSA · Telegram Mini App',
  'DEXSA · Telegram Mini App',
  'Fast-growing Telegram Mini App startup: payment workflows with Telegram Stars, Supabase Realtime data sync, and resilient mobile UI.',
  'Telegram Mini App и социальная платформа: интеграция платежей Telegram Stars, Supabase Realtime синхронизация и оптимизированный мобильный UI.',
  'Architected frontend with React and FSD, implemented end-to-end checkout flow for Telegram Stars with strict Zod contracts, integrated Supabase Realtime subscriptions with optimistic updates, co-designed REST endpoints with backend team, and adapted interfaces for Telegram WebView.',
  'Клиентская архитектура на React и FSD, checkout-flow для Telegram Stars со строгой валидацией через Zod, интеграция Supabase Realtime (оптимистичные апдейты, infinite queries), совместное проектирование API контрактов и адаптация под WebView Telegram.',
  'https://t.me/ipu_promise_bot',
  '/projects/dexsa.png',
  ARRAY['Next.js', 'React', 'TypeScript', 'TanStack Query', 'Zustand', 'Supabase Realtime', 'Telegram Bot API', 'Zod'],
  1,
  true
),
(
  'tower-empire',
  'Tower Empire',
  'Tower Empire',
  'Real-time multiplayer gaming platform: sub-100ms WebSocket synchronization, complete migration to strict TypeScript, automated CI/CD.',
  'Игровая мультиплеерная веб-платформа реального времени: WebSocket-синхронизация <100ms, полная миграция на TypeScript, CI/CD.',
  'Led legacy migration from JavaScript to strict TypeScript reducing production bugs by 40%. Engineered custom WebSocket communication layer with auto-reconnection and exponential backoff. Configured caching and optimistic updates via RTK Query and Zustand.',
  'Миграция легаси-кодовой базы с JS на TypeScript (число багов снизилось на 40%). Разработка WebSocket-протокола с автоматическим реконнектом и heartbeat. Нормализованный кэш и оптимистичные обновления через RTK Query и Zustand.',
  'https://tower-empire.ru/',
  '/projects/tower-empire.png',
  ARRAY['React', 'TypeScript', 'WebSocket', 'Redux Toolkit', 'RTK Query', 'Zustand', 'Vite', 'Playwright'],
  2,
  true
),
(
  'portfolio',
  'Bento Portfolio & CV',
  'Bento Портфолио & Резюме',
  'Bilingual portfolio and CMS dashboard built on Next.js 16 App Router, React 19, Tailwind CSS v4, Supabase RLS, and Framer Motion.',
  'Двуязычное портфолио с CMS-админкой на базе Next.js 16 App Router, React 19, Tailwind CSS v4, Supabase RLS и Framer Motion.',
  'Production-ready personal platform featuring server-side rendering, dynamic Supabase PostgreSQL integration, secure role-based admin panel, on-demand ISR cache revalidation, Telegram visitor tracker, and responsive PDF exports.',
  'Полноценная персональная платформа: серверный рендеринг (RSC), интеграция с Supabase PostgreSQL, защищённая ролью админка, On-demand ISR ревалидация кэша, трекер визитов в Telegram и экспорт PDF резюме.',
  'https://resumeportfoliocv.netlify.app/',
  '/projects/portfolio.png',
  ARRAY['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Supabase', 'Framer Motion'],
  3,
  true
);

-- 13. EXPERIENCES SEED
DELETE FROM public.experiences;
INSERT INTO public.experiences (
  title_en, title_ru,
  company, location_en, location_ru,
  period_en, period_ru,
  description_en, description_ru,
  stack, is_commercial, sort_order
) VALUES
(
  'Fullstack & Product Engineer (Contract)',
  'Fullstack & Product Engineer (проектная работа)',
  'DKMline — B2B E-commerce Platform',
  'Remote', 'Удалённо',
  'Apr 2026 — Present', 'Апрель 2026 — настоящее время',
  ARRAY[
    'Built the platform on Next.js App Router (SSR, Server Actions) with Payload CMS and PostgreSQL; data validation with Zod.',
    'Cut LCP from 2.8s to 1.8s via image optimization, lazy loading and server rendering; shipped SEO infrastructure (sitemap, robots, Schema.org).',
    'Configured Redis caching for catalog data to reduce database load; containerized the stack with Docker Compose and deployed to a VPS.',
    'Replaced offline order intake with a digital funnel and Telegram Bot API notifications.'
  ],
  ARRAY[
    'Разработал платформу на Next.js App Router (SSR, Server Actions) с Payload CMS и PostgreSQL; валидация данных через Zod.',
    'Снизил LCP с 2.8s до 1.8s: оптимизация изображений, lazy loading, серверный рендеринг; SEO-инфраструктура (sitemap, robots, Schema.org).',
    'Настроил Redis-кэширование каталога, снизив нагрузку на БД; контейнеризировал окружение (Docker Compose) и развернул на VPS.',
    'Перевёл офлайн-приём заказов в цифровую воронку с уведомлениями через Telegram Bot API.'
  ],
  ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Payload CMS', 'PostgreSQL', 'Redis', 'Docker', 'Zod'],
  true,
  0
),
(
  'Fullstack / Frontend Developer (React / Next.js)',
  'Fullstack / Frontend Developer (React / Next.js)',
  'DEXSA — Telegram Mini App & Social Platform',
  'Remote', 'Удалённо',
  'Jun 2025 — Apr 2026', 'Июнь 2025 — Апрель 2026',
  ARRAY[
    'Built the client architecture on React and FSD: isolated modules, server cache (TanStack Query) separated from UI state (Zustand); list and table virtualization.',
    'Implemented the Telegram Stars checkout flow: transaction states, external API confirmations, retries, strict Zod payload validation.',
    'Integrated Supabase Realtime (optimistic updates, infinite queries, retry logic) so the UI updates without reloads.',
    'Co-designed API contracts with the backend team; wrote backend endpoints and a timezone-aware notification service (SQL, pg_cron, Telegram Bot API).',
    'Adapted the UI to Telegram WebViews on iOS and Android (safe areas, on-screen keyboard, streaming video); unit-tested critical business logic.'
  ],
  ARRAY[
    'Построил клиентскую архитектуру на React и FSD: изолированные модули, серверный кэш (TanStack Query) отдельно от UI-стейта (Zustand); виртуализация больших списков и таблиц.',
    'Реализовал checkout-flow для Telegram Stars: состояния транзакций, подтверждения от внешнего API, ретраи, строгая валидация через Zod.',
    'Подключил Supabase Realtime (optimistic updates, infinite queries, retry-логика) — интерфейс обновляется без перезагрузок.',
    'Совместно с бэкенд-командой согласовывал контракты API и писал backend-эндпоинты и сервис уведомлений с учётом часовых поясов (SQL, pg_cron, Telegram Bot API).',
    'Адаптировал интерфейс под WebView Telegram на iOS и Android: safe-area, экранная клавиатура, потоковое видео; покрыл unit-тестами критичную бизнес-логику.'
  ],
  ARRAY['Next.js', 'React', 'TypeScript', 'TanStack Query', 'Zustand', 'FSD', 'Zod', 'NestJS / FastAPI', 'PostgreSQL (Supabase)', 'Telegram Bot API'],
  true,
  1
),
(
  'Core Frontend Engineer / Architecture Owner',
  'Core Frontend Engineer / Architecture Owner',
  'Tower Empire — Real-Time Multiplayer Web Platform',
  'Remote', 'Удалённо',
  'May 2023 — Jun 2025', 'Май 2023 — Июнь 2025',
  ARRAY[
    'Led legacy migration from JavaScript to TypeScript with unified types for API and WebSocket payloads; production regression bugs dropped by 40%.',
    'Designed the WebSocket layer from scratch: event protocol, automatic reconnect with exponential backoff, heartbeats, session recovery; latency under 100ms at peak load.',
    'Set up the data layer with Redux Toolkit, RTK Query and Zustand: normalized cache, optimistic updates, no duplicate requests.',
    'Built CI/CD (GitHub Actions, GitLab CI): linting, builds, Vitest and Playwright E2E on critical flows; faster Vite builds via code splitting and dynamic imports.'
  ],
  ARRAY[
    'Провёл миграцию легаси-кодовой базы с JavaScript на TypeScript: единые типы для API и WebSocket-сообщений; число регрессионных багов в продакшене снизилось на 40%.',
    'Разработал WebSocket-слой с нуля: протокол событий, автоматический реконнект с backoff, heartbeats, восстановление сессий; задержка <100ms при пиковой нагрузке.',
    'Настроил слой данных с Redux Toolkit, RTK Query и Zustand: нормализованный кэш, оптимистичные обновления, отсутствие дублирующих запросов.',
    'Построил CI/CD (GitHub Actions, GitLab CI): линтинг, сборка, Vitest и Playwright E2E на критичных сценариях; оптимизация сборки Vite через code splitting.'
  ],
  ARRAY['React', 'TypeScript', 'WebSockets', 'Redux Toolkit', 'RTK Query', 'Zustand', 'Vite', 'Vitest', 'Playwright', 'GitHub Actions', 'GitLab CI', 'Nginx'],
  true,
  2
);

-- 14. SKILL CATEGORIES SEED
DELETE FROM public.skill_categories;
INSERT INTO public.skill_categories (name_en, name_ru, skills, sort_order)
VALUES
(
  'Frontend Core',
  'Frontend',
  ARRAY['React 18/19', 'Next.js 14-16 (App Router)', 'TypeScript', 'JavaScript ES6+', 'Vite', 'Server Actions', 'SSR/SSG/ISR'],
  0
),
(
  'UI & Styling',
  'UI и стили',
  ARRAY['Tailwind CSS v4', 'Radix UI', 'Framer Motion', 'SCSS', 'Design Systems', 'Responsive & Mobile Layouts'],
  1
),
(
  'State & Data',
  'Состояние и данные',
  ARRAY['TanStack Query', 'Redux Toolkit / RTK Query', 'Zustand', 'WebSockets', 'Supabase Realtime', 'Zod validation'],
  2
),
(
  'Node.js & Backend',
  'Node.js и бэкенд',
  ARRAY['Node.js', 'NestJS', 'FastAPI (Python)', 'PostgreSQL', 'Redis (caching)', 'REST APIs', 'SQL'],
  3
),
(
  'Architecture & Quality',
  'Архитектура',
  ARRAY['Feature-Sliced Design (FSD)', 'Modular Architecture', 'SOLID', 'Code Review', 'Git Flow', 'Core Web Vitals (LCP)'],
  4
),
(
  'DevOps & Tooling',
  'CI/CD и инфраструктура',
  ARRAY['Docker', 'Docker Compose', 'GitHub Actions', 'GitLab CI', 'Nginx', 'VPS deployment', 'Vercel / Netlify'],
  5
),
(
  'Testing',
  'Тестирование',
  ARRAY['Playwright (E2E)', 'Vitest', 'Jest', 'React Testing Library'],
  6
),
(
  'AI & Productivity',
  'AI-инструменты',
  ARRAY['Claude Code', 'Cursor', 'MCP Tools', 'Task Decomposition', 'Test Generation'],
  7
);

-- 15. EDUCATION SEED
DELETE FROM public.education;
INSERT INTO public.education (
  degree_en, degree_ru,
  institution_en, institution_ru,
  year,
  additional_en, additional_ru
) VALUES (
  'Higher Technical / Engineering Degree (Process Engineer)',
  'Высшее техническое образование (Инженер-технолог)',
  'Belarusian State Technological University (BSTU), Minsk',
  'Белорусский государственный технологический университет (БГТУ), Минск',
  '2006 — 2011',
  ARRAY[
    'RS School — JavaScript/Frontend (Stage 1-2-3): strict merit-based ecosystem, TypeScript, React, complex Git workflows, peer reviews',
    'SkyPro — Frontend Developer: comprehensive training in modern core frontend, component architecture, semantic web'
  ],
  ARRAY[
    'RS School — JavaScript/Frontend (Stage 1-2-3): интенсивная программа, TypeScript, React, Git workflows, peer-to-peer ревью',
    'SkyPro — Frontend Developer: углублённая подготовка по современному стеку frontend, архитектуре компонентов и семантике'
  ]
);

-- 16. LANGUAGES SEED
DELETE FROM public.languages;
INSERT INTO public.languages (name_en, name_ru, level_en, level_ru, sort_order)
VALUES
(
  'Russian', 'Русский',
  'Native / C2', 'Родной / C2',
  0
),
(
  'English', 'Английский',
  'B2 (Working proficiency, technical documentation, code reviews)', 'B2 (Рабочий уровень: документация, переписка, code review)',
  1
),
(
  'Belarusian', 'Белорусский',
  'Native', 'Родной',
  2
);

-- ====================================================================
-- SUCCESS MESSAGE
-- ====================================================================
SELECT 'Schema and seed successfully applied! Administrator assigned to bulloalexander77@gmail.com' as result;
