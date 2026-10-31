# Mobile-First Ergonomics & Telegram Mini App Verification Matrix

**Document Reference:** `docs/telegram/VERIFICATION-MATRIX.md`  
**Phase:** 05 — Mobile-First Ergonomics & Telegram Mini App  
**Status:** Verification Ready  

This matrix defines the deterministic multi-device acceptance criteria for Aliaksandr Bullo's engineering portfolio across standard mobile web browsers, desktop displays, and the native Telegram Mini App (TMA) runtime.

---

## 1. Mobile Web Browser Ergonomics Matrix

Verified across simulated and physical viewports: `320px` (iPhone SE 1st gen), `375px` (iPhone 13 mini / SE 3), `390px` (iPhone 14/15/16), and `430px` (iPhone 14/15/16 Pro Max / Android flagships).

| Check ID | Verification Area | Target Specification | Pass Criteria |
|---|---|---|---|
| **MOB-V01** | Horizontal Overflow | Zero horizontal page scrolling (`scrollWidth <= innerWidth`) | In DevTools Console: `document.documentElement.scrollWidth <= window.innerWidth` evaluates to `true` at `320px`, `375px`, and `430px`. |
| **MOB-V02** | Touch Target Sizing | Minimum `44x44px` interactive hit area | `SiteHeader` links, `LanguageSwitcher`, `ThemeThumbwheel`, filter tabs, CTA buttons, and zoom triggers meet or exceed `44x44px` via direct sizing or `after:absolute` hit pads. |
| **MOB-V03** | Touch Spacing | Minimum `8px` spacing between adjacent interactive elements | No accidental double-taps between `LanguageSwitcher` and `ThemeThumbwheel` (`gap-2` = 8px). |
| **MOB-V04** | Section Navigation | Smart 2-Tier Header (`MobileSectionNav`) | On downward scroll (`delta > 24px`, `scrollY > 120px`), nav smoothly collapses (`-translate-y-full`). On upward scroll (`delta < -8px`) or top (`scrollY <= 80px`), nav smoothly reveals. |
| **MOB-V05** | Deep Link Clearance | Anchor scroll clearance | Tapping `#projects` or `#experience` scrolls element top edge to `6rem` below the viewport top, preventing header overlap (`scroll-margin-top: 6rem`). |
| **MOB-V06** | Sticky CTA Bar | `MobileBottomCta` trigger | Hidden in Hero viewport (`scrollY <= 400px`); smoothly slides in (`translate-y-0`) when scrolling through stack/projects. Respects `env(safe-area-inset-bottom)`. |
| **MOB-V07** | Hero Ergonomics | 2x2 Metric Grid + Single Image Node | On `< 1024px`, Hero metrics render in a 2x2 grid. Engineering portrait renders a single uncropped `HardwareImage` node (`Image_1.png` with WebP candidate fallback). Zero duplicated network requests. |
| **MOB-V08** | Comic Chronicle | Vertical Panel Extraction | On `< 640px`, panel numbers (`01..04`) and milestone dates extract to an uppercase header strip. Tapping panel opens full-fidelity `ChronicleZoomModal` via lazy Radix Dialog. |
| **MOB-V09** | Career Disclosure | Progressive Item Disclosure | In `ExperienceItem` on `< 768px`, items 0 and 1 are visible with "More details" / "Подробнее" toggle. Items 2+ remain in SSR DOM (`hidden md:flex`), guaranteeing 100% crawlability for Googlebot. |
| **MOB-V10** | Typography Scale | Constructivist type scale at 320px | Hero headline scales down to `text-3xl` (`1.875rem`) without awkward word breaks. Section headings fit on a single line at `320px`. |
| **MOB-V11** | Text Accessibility | 200% Font Zoom (WCAG 1.4.4) | With browser text zoom at 200%, text wraps cleanly without overlapping adjacent containers or truncating critical specification numbers. |
| **MOB-V12** | Motion Preference | `prefers-reduced-motion: reduce` | Typewriter animations complete instantly (0ms delay), thumbwheel spring physics snap directly to resting position, smooth scroll disables. |
| **MOB-V13** | Zero Overhead | Standard Web Visitor Isolation | In browser DevTools Network tab on standard web (`http://localhost:3000` or production), search for `telegram-web-app.js`: **0 bytes transferred, 0 script tags injected**. |

---

## 2. Desktop Regression Matrix (1280px / 1440px / 1920px)

Ensures mobile-first changes introduced zero regressions for widescreen engineering reviewers.

| Check ID | Verification Area | Target Specification | Pass Criteria |
|---|---|---|---|
| **DSK-V01** | Hero Grid Layout | Asymmetric 8 + 4 column grid | Terminal console occupies 8 columns, interactive hardware console occupies 4 columns. |
| **DSK-V02** | Comic Grid Layout | 1-2-1-2 Constructivist chronicle | Panels 1 and 4 span full width; panels 2/3 and 5/6 render side-by-side. Zoom triggers hidden on `sm+`. |
| **DSK-V03** | Career Summary | Multi-column table view | Complete career chronology table renders with Role, Company, Period, Domain, and Core Stack columns visible simultaneously. |
| **DSK-V04** | Desktop Header | Unified Swiss navigation bar | Brand logo on left, Projects/Experience/Contact text links in center, LanguageSwitcher + ThemeThumbwheel on right. |
| **DSK-V05** | Desktop Footer | Full diagnostic engineering readout | Commit hash, environment, status, system uptime, and direct CV links visible. |

---

## 3. Telegram Mini App (TMA) Native Matrix

Tested across iOS (iPhone), Android, Telegram Desktop (macOS/Windows/Linux), and Telegram Web (K/A).

| Check ID | Verification Area | Target Specification | Pass Criteria |
|---|---|---|---|
| **TMA-V01** | Zero-Flash Scoping | Instant `.web-only` suppression | In `<head>`, inline detection immediately sets `html[data-tma="1"]`. Standard `SiteHeader`, `SiteFooter`, and `MobileBottomCta` are hidden before first contentful paint. |
| **TMA-V02** | Native Utility Bar | Deduplicated Header (`TelegramShell`) | Header **never** duplicates "Aliaksandr Bullo" (already present in native client window). Displays interactive live `01 / SECTION` or `CASE / SLUG` in `tabular-nums` + Language Switcher + Theme Thumbwheel. Tapping location scrolls to top. |
| **TMA-V03** | Chrome Color Sync | `TelegramThemeSync` | Background hex (`#0e0f12` Dark, `#f4f0e8` Light) pushes to `setHeaderColor`, `setBackgroundColor`, and `setBottomBarColor` (API 7.10+). No mismatched white/black letterboxing bars. |
| **TMA-V04** | Locale Auto-Init | Telegram `language_code` detection | When opening bot for the first time without prior `lang_manual` choice, `ru/be/uk/kk` user accounts auto-load Russian UI; all others auto-load English UI. Manual switch persists to `lang_manual=1`. |
| **TMA-V05** | Haptic Detents | Native `HapticFeedback` bridge | Rotating `ThemeThumbwheel` triggers `tmaHaptics.selection()` on discrete detent boundaries; crossing Light/Dark threshold triggers `tmaHaptics.impact("medium")`. |
| **TMA-V06** | Native BackButton | Modal and History Stack Awareness | 1. If `ChronicleZoomModal` is open, native BackButton closes modal first without route change.<br>2. If returning from `/projects/[slug]` with in-app history, native BackButton calls `router.back()`, preserving exact scroll position on `#projects`.<br>3. If entered directly via deep link (`startapp=case_dkmline`), native BackButton calls `router.replace("/")`. |
| **TMA-V07** | Deep Linking | Session-guarded `parseStartParam` | Launching `https://t.me/<bot>/<app>?startapp=case_dkmline` opens `/projects/dkmline` directly. Launching `startapp=section_experience` scrolls smoothly to `#experience`. Execution occurs once per session. |
| **TMA-V08** | Native MainButton | Industrial `#ff5c00` on `#0e0f12` | Bottom `MainButton` is Signal Orange with Dark Charcoal text (`6.21:1` AA contrast), zero emojis, and `has_shine_effect: false`. Copy adapts contextually between "Order a similar project" and "Message in Telegram". Prefills direct `https://t.me/AlexanderBullo?text=...`. |
| **TMA-V09** | Native SecondaryButton | PDF CV Download via `downloadFile` | Displayed in `left` position on API 7.10+ as "CV PDF" / "Резюме PDF". Tapping downloads localized PDF natively via Telegram API 8.0+ `downloadFile` or opens in browser. |
| **TMA-V10** | Viral Sharing | `ShareCaseButton` | Tapping "Forward case to Tech Lead" on `/projects/[slug]` triggers `openTelegramLink("https://t.me/share/url?url=...&text=...")` with prefilled `startapp=case_<slug>` link. |
| **TMA-V11** | Safe Area Clearance | iPhone Home Indicator & Notch | TMA content respects `--tg-content-safe-area-inset-top` and `--tg-safe-area-inset-bottom` / `env(safe-area-inset-bottom)`. Bottom utility clearance prevents content overlap. |

---

## 4. Telegram Bot & Webhook Funnel Matrix

Tested against `/api/telegram/webhook` and Telegram Bot API.

| Check ID | Verification Area | Target Specification | Pass Criteria |
|---|---|---|---|
| **BOT-V01** | `/start` Command | Interactive welcome card | Returns bilingual welcome card with bio, InlineKeyboardMarkup pointing to Mini App, and persistent Menu Button configured to launch Mini App. |
| **BOT-V02** | `/projects` Command | Showcase cards with deep links | Returns message with inline buttons for DKM-Line, DEXSA, Tower Empire, and Portfolio, each launching TMA with `?startapp=case_<slug>`. |
| **BOT-V03** | `/cv` Command | Native PDF Document delivery | Uses Telegram `sendDocument` to attach `cv_en.pdf` or `resume_ru.pdf` with localized captions. |
| **BOT-V04** | `/contact` Command | Direct contact info | Returns verified contact card (GitHub, LinkedIn, Email, Telegram). |
| **BOT-V05** | Inline Queries | `@bot <query>` sharing | Typing `@bullo_dev_bot dkm` in any chat renders inline result articles with thumbnails and direct deep link buttons. |
| **BOT-V06** | Lead Forwarding | Free-text recruiter messages | Any plain text message sent to the bot is forwarded to the owner's `TELEGRAM_CHAT_ID` with sender profile info and a direct `tg://user?id=` reply link. |
| **BOT-V07** | Security & Auth | Webhook `secret_token` validation | Requests to `POST /api/telegram/webhook` without `X-Telegram-Bot-Api-Secret-Token` header matching `TELEGRAM_WEBHOOK_SECRET` are rejected with `401 Unauthorized`. |
| **BOT-V08** | Conversion Telemetry | HMAC `verifyTelegramInitData` | Requests to `POST /api/telegram/visit` are cryptographically verified against `TELEGRAM_BOT_TOKEN`. Valid events (`view`, `download_cv`, `share_case`, `cta_click`) send formatted HTML alert to owner. Forged signatures rejected with `401`. |

---

## 5. Webhook Management CLI Commands

```bash
# 1. Inspect current webhook status
node --env-file=.env.local scripts/set-webhook.mjs info

# 2. Register webhook with Telegram Bot API
node --env-file=.env.local scripts/set-webhook.mjs set

# 3. Delete webhook (for polling development)
node --env-file=.env.local scripts/set-webhook.mjs delete
```
