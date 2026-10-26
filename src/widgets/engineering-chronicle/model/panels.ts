export interface ChronicleBoxCoords {
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface ChroniclePanelData {
  num: "01" | "02" | "03" | "04" | "05" | "06";
  fileName: string;
  variant: "wide" | "tall" | "square";
  aspectRatioClass: string;
  box: ChronicleBoxCoords;
  delayMs: number;
  objectPosition?: string;
  title: {
    en: string;
    ru: string;
  };
  punchline: {
    en: string;
    ru: string;
  };
  caption: {
    en: string;
    ru: string;
  };
}

export const CHRONICLE_PANELS: readonly ChroniclePanelData[] = [
  {
    num: "01",
    fileName: "Image_2.png",
    variant: "wide",
    aspectRatioClass: "aspect-[1376/768]",
    box: {
      top: "7.4%",
      left: "3.2%",
      width: "93.6%",
      height: "18.6%",
    },
    delayMs: 0,
    title: {
      en: "Unstructured Prototyping",
      ru: "Прототипирование без архитектуры",
    },
    punchline: {
      en: "Code without state contracts is a fragile foundation.",
      ru: "Код без контрактов состояний — хрупкий фундамент.",
    },
    caption: {
      en: "Rapid feature assembly without distributed state design fails under real network conditions.",
      ru: "Быстрая сборка фич без проектирования распределенного состояния ломается при первой сетевой задержке.",
    },
  },
  {
    num: "02",
    fileName: "Image_3.png",
    variant: "tall",
    aspectRatioClass: "aspect-[896/1200]",
    box: {
      top: "5.1%",
      left: "4.5%",
      width: "91.0%",
      height: "12.0%",
    },
    delayMs: 0,
    title: {
      en: "Concurrent Client Mutations",
      ru: "Повторные клиентские запросы",
    },
    punchline: {
      en: 'Weak signal on the subway. The user taps "Pay" three times.',
      ru: "Слабая связь в метро. Пользователь жмёт «Оплатить» трижды.",
    },
    caption: {
      en: "Without client-side request locking and idempotency keys, duplicate mutations flood the API.",
      ru: "Без блокировки повторных кликов и ключей идемпотентности клиент отправляет дублирующиеся мутации.",
    },
  },
  {
    num: "03",
    fileName: "Image_4.png",
    variant: "square",
    aspectRatioClass: "aspect-square",
    box: {
      top: "5.7%",
      left: "4.0%",
      width: "92.0%",
      height: "13.8%",
    },
    delayMs: 120,
    title: {
      en: "Race Condition & Data Corruption",
      ru: "Гонка состояний и повреждение данных",
    },
    punchline: {
      en: "Three requests hit the database at once. Balance goes negative.",
      ru: "Три запроса одновременно в БД. Баланс уходит в минус.",
    },
    caption: {
      en: "Lack of row-level locks and atomic transactions leads to inconsistent state and HTTP 429 cascades.",
      ru: "Отсутствие атомарных транзакций и блокировок приводит к рассинхронизации данных и каскаду ошибок.",
    },
  },
  {
    num: "04",
    fileName: "Image_5.png",
    variant: "wide",
    aspectRatioClass: "aspect-[1376/768]",
    box: {
      top: "7.2%",
      left: "3.2%",
      width: "93.6%",
      height: "17.7%",
    },
    delayMs: 0,
    title: {
      en: "Complexity Escalation",
      ru: "Деградация системы",
    },
    punchline: {
      en: "Every new boolean flag multiplies the race conditions.",
      ru: "Каждый новый булев флаг умножает гонки состояний.",
    },
    caption: {
      en: "Uncoordinated patches cannot resolve architectural flaws in asynchronous workflows.",
      ru: "Хаотичные патчи не способны исправить фундаментальную проблему несогласованного состояния.",
    },
  },
  {
    num: "05",
    fileName: "Image_6.png",
    variant: "square",
    aspectRatioClass: "aspect-square",
    box: {
      top: "5.7%",
      left: "4.0%",
      width: "92.0%",
      height: "13.8%",
    },
    delayMs: 0,
    title: {
      en: "Deterministic State Architecture",
      ru: "Детерминированная архитектура (FSM)",
    },
    punchline: {
      en: "Finite state machine + idempotency key + backoff queue.",
      ru: "Конечный автомат + ключ идемпотентности + очередь с backoff.",
    },
    caption: {
      en: "Strict state transition contracts replace scattered flags and guarantee predictable execution.",
      ru: "Строгая математическая модель переходов состояний заменяет хаотичные флаги и гарантирует предсказуемость.",
    },
  },
  {
    num: "06",
    fileName: "Image_7.png",
    variant: "square",
    aspectRatioClass: "aspect-square",
    box: {
      top: "7.9%",
      left: "6.2%",
      width: "87.6%",
      height: "9.5%",
    },
    delayMs: 120,
    title: {
      en: "Verified Production Systems",
      ru: "Верифицированные продакшн-системы",
    },
    punchline: {
      en: "Deterministic state. 200 OK. Every edge case verified.",
      ru: "Детерминированное состояние. 200 OK. Все граничные случаи верифицированы.",
    },
    caption: {
      en: "Industrial engineering discipline applied to software: fault-tolerant, deterministic, verified in production.",
      ru: "Инженерная дисциплина в веб-системах: отказоустойчивость, предсказуемость и надежность под нагрузкой.",
    },
  },
] as const;
