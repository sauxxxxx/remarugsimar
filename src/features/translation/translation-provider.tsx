"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageOption,
} from "./translation.constants";
import { loadLocaleDictionary } from "./locales/locale-loader";

type TranslationContextValue = {
  activeLanguage: LanguageOption;
  error: string | null;
  isTranslating: boolean;
  switchingLanguage: LanguageOption | null;
  selectLanguage: (language: LanguageOption) => Promise<boolean>;
  translate: (source: string) => string;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);
const EXIT_DURATION_MS = 120;
const ENTER_DURATION_MS = 280;

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function nextFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [activeLanguage, setActiveLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [switchingLanguage, setSwitchingLanguage] = useState<LanguageOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyLanguage = useCallback(
    (language: LanguageOption, dictionary: Record<string, string>) => {
      setActiveLanguage(language);
      setTranslations(dictionary);
      document.documentElement.lang = language.code;

      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(language));
      } catch {}
    },
    [],
  );

  const selectLanguage = useCallback(
    async (language: LanguageOption) => {
      if (language.code === activeLanguage.code) return true;

      setError(null);
      setIsTranslating(true);
      setSwitchingLanguage(language);

      try {
        const dictionary =
          language.code === DEFAULT_LANGUAGE.code ? {} : await loadLocaleDictionary(language.code);
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
          document.documentElement.dataset.languageTransition = "out";
          await wait(EXIT_DURATION_MS);
        }

        applyLanguage(language.code === DEFAULT_LANGUAGE.code ? DEFAULT_LANGUAGE : language, dictionary);

        if (!prefersReducedMotion) {
          document.documentElement.dataset.languageTransition = "in";
          await nextFrame();
          await nextFrame();
          delete document.documentElement.dataset.languageTransition;
          await wait(ENTER_DURATION_MS);
        }

        return true;
      } catch (localeError) {
        setError(
          localeError instanceof Error
            ? localeError.message
            : "This language version could not be loaded.",
        );
        return false;
      } finally {
        delete document.documentElement.dataset.languageTransition;
        setIsTranslating(false);
        setSwitchingLanguage(null);
      }
    },
    [activeLanguage.code, applyLanguage],
  );

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (!storedLanguage) return;

      const stored = JSON.parse(storedLanguage) as Partial<LanguageOption>;
      const language = SUPPORTED_LANGUAGES.find((option) => option.code === stored.code);
      if (language) void selectLanguage(language);
    } catch {}
  }, [selectLanguage]);

  const value = useMemo<TranslationContextValue>(
    () => ({
      activeLanguage,
      error,
      isTranslating,
      selectLanguage,
      switchingLanguage,
      translate: (source) => translations[source] ?? source,
    }),
    [activeLanguage, error, isTranslating, selectLanguage, switchingLanguage, translations],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used inside TranslationProvider.");
  return context;
}

export function TranslatedText({ text }: { text: string }) {
  const { translate } = useTranslation();
  const staggerIndex = text.length % 4;

  return (
    <span className={`translated-text translated-text--delay-${staggerIndex}`}>
      {translate(text)}
    </span>
  );
}
