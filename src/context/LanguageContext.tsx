import React, { createContext, useContext, useEffect } from 'react';
import { translations } from '../translations/i18n';

interface LanguageContextType {
  language: 'en';
  setLanguage: (lang: 'en') => void;
  t: typeof translations.en;
  isUrdu: false;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = 'en';
  const isUrdu = false;
  const t = translations.en;

  const setLanguage = () => {
    // Single language (English) enforcement
  };

  useEffect(() => {
    document.dir = 'ltr';
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isUrdu }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

