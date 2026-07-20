"use client";

import { Check, Languages, Search } from "lucide-react";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES, type LanguageOption } from "./translation.constants";
import { useTranslation } from "./translation-provider";

const RECOMMENDED_LANGUAGE_CODES = ["en", "fil", "ceb"] as const;
const RECOMMENDED_LANGUAGE_CODE_SET = new Set<string>(RECOMMENDED_LANGUAGE_CODES);

export function LanguageSelector() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const { activeLanguage, error, isTranslating, selectLanguage, switchingLanguage } =
    useTranslation();

  const languageGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (normalizedQuery) {
      const matches = SUPPORTED_LANGUAGES.filter(
        (language) =>
          language.name.toLocaleLowerCase().includes(normalizedQuery) ||
          language.code.toLocaleLowerCase().includes(normalizedQuery),
      );

      return [{ label: "Search results", languages: matches }];
    }

    const recommended = RECOMMENDED_LANGUAGE_CODES.map((languageCode) =>
      SUPPORTED_LANGUAGES.find((language) => language.code === languageCode),
    ).filter((language): language is LanguageOption => Boolean(language));
    const remaining = SUPPORTED_LANGUAGES.filter(
      (language) => !RECOMMENDED_LANGUAGE_CODE_SET.has(language.code),
    );

    return [
      { label: "Recommended", languages: recommended },
      { label: "All languages", languages: remaining },
    ].filter((group) => group.languages.length > 0);
  }, [query]);

  const visibleLanguages = useMemo(
    () => languageGroups.flatMap((group) => group.languages),
    [languageGroups],
  );
  const highlightedLanguage = visibleLanguages[highlightedIndex];

  function openDialog() {
    setQuery("");
    setHighlightedIndex(0);
    dialogRef.current?.showModal();
  }

  async function chooseLanguage(language: LanguageOption) {
    const didTranslate = await selectLanguage(language);
    if (didTranslate) dialogRef.current?.close();
  }

  function highlightOption(nextIndex: number) {
    if (!visibleLanguages.length) return;

    const normalizedIndex = (nextIndex + visibleLanguages.length) % visibleLanguages.length;
    const language = visibleLanguages[normalizedIndex];
    setHighlightedIndex(normalizedIndex);
    optionRefs.current.get(language.code)?.scrollIntoView({ block: "nearest" });
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      dialogRef.current?.close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightOption(highlightedIndex + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightOption(highlightedIndex - 1);
    }

    if (event.key === "Enter" && highlightedLanguage && !isTranslating) {
      event.preventDefault();
      void chooseLanguage(highlightedLanguage);
    }
  }

  return (
    <>
      <button
        aria-label={`Choose portfolio language. Current language: ${activeLanguage.name}`}
        className="language-trigger"
        onClick={openDialog}
        title={`Language: ${activeLanguage.name}`}
        type="button"
      >
        <Languages aria-hidden="true" size={12} strokeWidth={1.6} />
      </button>

      <dialog aria-labelledby="language-dialog-title" className="language-dialog" ref={dialogRef}>
        <div className="language-dialog__content">
          <h2 className="sr-only" id="language-dialog-title">
            Choose language
          </h2>

          <label className="language-search">
            <Search aria-hidden="true" size={14} />
            <span className="sr-only">Type a language or language code</span>
            <input
              aria-activedescendant={
                highlightedLanguage ? `language-option-${highlightedLanguage.code}` : undefined
              }
              aria-autocomplete="list"
              aria-controls="language-options"
              aria-expanded="true"
              autoComplete="off"
              autoFocus
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Type a language or search…"
              role="combobox"
              type="search"
              value={query}
            />
            <kbd>esc</kbd>
          </label>

          <div className="language-list" id="language-options" role="listbox">
            {visibleLanguages.length ? (
              languageGroups.map((group) => (
                <section
                  aria-labelledby={`language-group-${group.label.replaceAll(" ", "-")}`}
                  className="language-group"
                  key={group.label}
                  role="group"
                >
                  <p
                    className="language-group__label"
                    id={`language-group-${group.label.replaceAll(" ", "-")}`}
                  >
                    {group.label}
                  </p>
                  {group.languages.map((language) => {
                    const optionIndex = visibleLanguages.findIndex(
                      (visibleLanguage) => visibleLanguage.code === language.code,
                    );
                    const isActive = language.code === activeLanguage.code;
                    const isHighlighted = optionIndex === highlightedIndex;

                    return (
                      <button
                        aria-selected={isActive}
                        className="language-option"
                        data-highlighted={isHighlighted || undefined}
                        disabled={isTranslating}
                        id={`language-option-${language.code}`}
                        key={language.code}
                        onClick={() => void chooseLanguage(language)}
                        onMouseEnter={() => setHighlightedIndex(optionIndex)}
                        ref={(element) => {
                          if (element) optionRefs.current.set(language.code, element);
                          else optionRefs.current.delete(language.code);
                        }}
                        role="option"
                        type="button"
                      >
                        <span className="language-option__indicator" />
                        <span>{language.name}</span>
                        <span className="language-option__code">{language.code}</span>
                        {isActive ? <Check aria-hidden="true" size={13} /> : null}
                      </button>
                    );
                  })}
                </section>
              ))
            ) : (
              <div className="language-empty">
                <p>No matching languages</p>
                <span>Try a language name or code.</span>
              </div>
            )}
          </div>

          <footer aria-live="polite" className="language-dialog__status">
            {isTranslating ? (
              <span className="language-switch-status">
                Switching to {switchingLanguage?.name ?? "selected language"}…
              </span>
            ) : error ? (
              <span className="language-dialog__error">{error}</span>
            ) : (
              <span>↑↓ navigate · enter select · esc close</span>
            )}
          </footer>
        </div>
      </dialog>
    </>
  );
}
