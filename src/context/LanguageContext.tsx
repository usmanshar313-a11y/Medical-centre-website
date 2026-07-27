import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../translations/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('rafah_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rafah_lang', lang);
  };

  const isUrdu = language === 'ur';
  const t = translations[language];

  useEffect(() => {
    document.dir = isUrdu ? 'rtl' : 'ltr';
  }, [isUrdu]);

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
