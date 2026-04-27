"use client";

import "@/lib/i18n";
import i18n from "@/lib/i18n";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface I18nContextType {
  language: string;
  t: any;
  setLanguage: (lang: "vi" | "en") => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setLanguage = (lang: "vi" | "en") => {
    i18n.changeLanguage(lang);
  };

  if (!mounted) return null;

  return (
    <I18nContext.Provider value={{ language: i18n.language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
