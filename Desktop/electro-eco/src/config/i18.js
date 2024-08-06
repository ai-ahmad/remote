// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslations from '../ locales/en/ translation.json';
import ruTranslations from '../ locales/ru/ translation.json';
import uzTranslations from '../ locales/uz/ translation.json';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if key is not found
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    resources: {
      en: { translation: enTranslations },
      ru: { translation: ruTranslations },
      uz: { translation: uzTranslations },
    },
  });

export default i18n;
