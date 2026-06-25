import { reactive } from 'vue';
import zhCN from './lang/zh-CN.json';
import en from './lang/en.json';

export type Locale = 'zh' | 'en';

const messages: Record<Locale, Record<string, string>> = {
  zh: zhCN,
  en,
};

function detectLocale(): Locale {
  const stored = localStorage.getItem('mcrcon-locale');
  if (stored === 'zh' || stored === 'en') return stored;
  const nav = navigator.language || (navigator as any).userLanguage || '';
  return nav.startsWith('zh') ? 'zh' : 'en';
}

export const locale = reactive<{ current: Locale }>({
  current: detectLocale(),
});

export function setLocale(l: Locale) {
  locale.current = l;
  localStorage.setItem('mcrcon-locale', l);
}

export function t(key: string, params?: Record<string, string>): string {
  const msg = messages[locale.current][key];
  if (!msg) {
    // fallback to Chinese if key missing in current locale
    const fallback = messages.zh[key];
    if (!fallback) return key;
    if (!params) return fallback;
    return fallback.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
  }
  if (!params) return msg;
  return msg.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}
