# Design System: Technical Manual & Hardware Console

Спецификация дизайн-системы портфолио (Teenage Engineering EP-133 / Braun Дитера Рамса / 19" Eurorack / Архитектурные чертежи + комикс «Анатомия сбоя»).

---

## 1. Философия и Визуальный Код

* **Явная архитектура вместо невидимой магии:** каждый блок — это аппаратный модуль шасси с четкой механической рамкой `1px` (`border-border`), приборной шапкой (`.chassis-header`) и угловыми калибровочными прицелами (`+`).
* **Семиотика приборной панели:** все метаданные, статусы, индексы и координаты набираются моноширинным шрифтом в `UPPERCASE` со скобками и разделителями: `[ SPEC // SECTION 01 ]`, `[ MOD_01 ]`, `SYS // READY`.
* **Острая геометрия (`0px`):** полный отказ от скругленных углов (`--radius: 0px`), размытых теней и градиентов. Глубина передается через утопленные колодцы (`.recessed-well`) и жесткие смещенные тени (`--shadow-tactile: 2px 2px 0px`).

---

## 2. Семантические Цветовые Токены (`src/app/globals.css`)

| Токен CSS | Класс Tailwind v4 | Light (`Paper Manual / EP-133`) | Dark (`Matte Hardware Rack`) | Назначение |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `#F4F0E8` | `#0E0F12` | Фон холста с точечной инженерной сеткой `24x24px` |
| `--foreground` | `text-foreground` | `#121212` | `#E6E6E6` | Основной контрастный текст |
| `--card` | `bg-card` | `#FFFFFF` | `#15171C` | Поверхность модулей шасси |
| `--card-foreground` | `text-card-foreground` | `#121212` | `#E6E6E6` | Текст внутри модулей |
| `--muted` | `bg-muted` | `#EBE5D8` | `#0E0F12` | Утопленные области (`.recessed-well`), шапки и рельсы |
| `--muted-foreground` | `text-muted-foreground` | `#666660` | `#8B909A` | Вторичная телеметрия, подписи, координаты |
| `--primary` | `bg-primary`, `text-primary` | `#FF5C00` | `#FF5C00` | **Signal Orange** — главный акцент и триггер |
| `--primary-foreground` | `text-primary-foreground` | `#FFFFFF` | `#0E0F12` | Текст на сигнальном оранжевом фоне |
| `--secondary` | `bg-secondary` | `#F4F0E8` | `#1F232B` | Вторичные регистры и плашки стека |
| `--secondary-foreground` | `text-secondary-foreground` | `#121212` | `#E6E6E6` | Текст на вторичных плашках |
| `--status-ok` | `text-status-ok`, `bg-status-ok`, `border-status-ok` | `#059669` | `#10B981` | **Terminal Green** — номинальный режим (`200 OK`, `ONLINE`) |
| `--destructive` | `text-destructive`, `bg-destructive`, `border-destructive` | `#DC2626` | `#EF4444` | **Alert Red** — сбои, дедлоки, ошибки `HTTP 429` |
| `--border` | `border-border` | `#1A1A1A` | `#2D3139` | Жесткие механические рамки `1px` и `2px` |
| `--terminal` | `bg-terminal` | `#0E0F12` | `#0E0F12` | Консольный блок `I/O BUS TERMINAL` |
| `--terminal-foreground` | `text-terminal-foreground` | `#E6E6E6` | `#E6E6E6` | Текст внутри `I/O BUS TERMINAL` |

---

## 3. Типографика

* **Заголовки и основной текст (`--font-sans`):** `Space Grotesk` (400, 500, 600, 700), плотный трекинг `-0.02em`.
* **Телеметрия и технические метки (`--font-mono`):** `JetBrains Mono` (400, 500, 600, 700).

---

## 4. Атомарные Аппаратные Утилиты (`@layer utilities`)

* `.chassis-module` — базовый блок шасси (`bg-card text-card-foreground border border-border rounded-none relative`).
* `.chassis-module-double` — усиленный рэковый модуль (`bg-card text-card-foreground border-2 border-border rounded-none relative`).
* `.chassis-header` — верхняя приборная шина модуля (`border-b border-border bg-muted px-4 py-2.5 flex flex-wrap items-center justify-between font-mono text-xs`).
* `.chassis-footer` — нижняя контактная рельса модуля (`border-t border-border bg-muted px-4 py-1.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground`).
* `.recessed-well` — утопленный информационный колодец (`bg-muted border border-border p-3 font-mono`).
* `.tactile-btn` — физический отклик при нажатии (`active:translate-x-[1px] active:translate-y-[1px]`).
* `.rack-bolt` — крепежный винт `10x10px` со шлицем под углом `35°`.
* `.crosshair-corners` — угловые калибровочные кресты `+`.
* `.ruler-x` — миллиметровая шкала калибровки.
