import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from '../locales/ko/translation.json';
import en from '../locales/en/translation.json';
import zh from '../locales/zh-CN/translation.json';
import es from '../locales/es/translation.json';
import ja from '../locales/ja/translation.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  zh: { translation: zh },
  es: { translation: es },
  ja: { translation: ja },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n; 