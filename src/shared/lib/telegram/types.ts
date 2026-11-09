/**
 * Zero-dependency TypeScript definitions for Telegram WebApp SDK
 * Covering Telegram WebApp API versions 6.0 through 8.0+
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export type TelegramHapticImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

export type TelegramHapticNotificationType = "error" | "success" | "warning";

export interface TelegramHapticFeedback {
  impactOccurred(style: TelegramHapticImpactStyle): void;
  notificationOccurred(type: TelegramHapticNotificationType): void;
  selectionChanged(): void;
}

export interface TelegramBottomButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  has_shine_effect?: boolean;
  position?: "left" | "right" | "top" | "bottom";
  is_active?: boolean;
  is_visible?: boolean;
}

export interface TelegramBottomButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  position?: "left" | "right" | "top" | "bottom";
  setText(text: string): TelegramBottomButton;
  onClick(callback: () => void): TelegramBottomButton;
  offClick(callback: () => void): TelegramBottomButton;
  show(): TelegramBottomButton;
  hide(): TelegramBottomButton;
  enable(): TelegramBottomButton;
  disable(): TelegramBottomButton;
  setParams(params: TelegramBottomButtonParams): TelegramBottomButton;
}

export interface TelegramBackButton {
  isVisible: boolean;
  onClick(callback: () => void): TelegramBackButton;
  offClick(callback: () => void): TelegramBackButton;
  show(): TelegramBackButton;
  hide(): TelegramBackButton;
}

export interface TelegramDownloadFileParams {
  url: string;
  file_name: string;
}

export interface TelegramSafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: unknown;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  safeAreaInset?: TelegramSafeAreaInset;
  contentSafeAreaInset?: TelegramSafeAreaInset;
  isVersionAtLeast(version: string): boolean;
  ready(): void;
  expand(): void;
  close(): void;
  disableVerticalSwipes?(): void;
  enableVerticalSwipes?(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  setBottomBarColor?(color: string): void;
  BackButton: TelegramBackButton;
  MainButton: TelegramBottomButton;
  SecondaryButton?: TelegramBottomButton;
  HapticFeedback?: TelegramHapticFeedback;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  downloadFile?(params: TelegramDownloadFileParams, callback?: (accepted: boolean) => void): void;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
