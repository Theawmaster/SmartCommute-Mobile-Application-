// src/services/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import JSON translation files
import en from '../data/locales/en.json';
import zh from '../data/locales/zh.json';
import ms from '../data/locales/ms.json';
import ta from '../data/locales/ta.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ms: { translation: ms },
  ta: { translation: ta }
};

const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem('appLanguage');
  return savedLang || 'en';
};

loadLanguage().then((lng) => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng, // Use the persisted language or default 'en'
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
});

export default i18n;
