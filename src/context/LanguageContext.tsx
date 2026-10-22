import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, translations } from '../i18n/translations';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (typeof translations)['id'];
}

const STORAGE_KEY_LANG = 'mature_prompt_studio_lang';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('id'); // Default Indonesian or English per user preference

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as AppLanguage | null;
      if (saved === 'id' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
