import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhCN from './locales/zh-CN.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': zhCN
    },
    fallbackLng: 'zh-CN',
    lng: 'zh-CN', // Set default language to Chinese
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;