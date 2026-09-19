import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import te from '../i18n/te.json';
import hi from '../i18n/hi.json';

const translations = { en, te, hi };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('farm2market_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('farm2market_lang', language);
  }, [language]);

  const t = (key) => {
    const currentBundle = translations[language] || translations.en;
    return currentBundle[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
