"use client";

import { Moon, Sun } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ViewTransition = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setThemeState(currentTheme === "dark" ? "dark" : "light");
  }, []);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {}
    setThemeState(nextTheme);
  }

  async function transitionTo(nextTheme: Theme, event: MouseEvent<HTMLButtonElement>) {
    if (nextTheme === theme || isTransitioning) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transitionDocument = document as ViewTransitionDocument;
    const startViewTransition = transitionDocument.startViewTransition?.bind(document);

    if (prefersReducedMotion || !startViewTransition) {
      applyTheme(nextTheme);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    setIsTransitioning(true);
    document.documentElement.dataset.themeTransitioning = "true";
    document.documentElement.style.setProperty("--theme-transition-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-transition-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-transition-radius", `${radius}px`);

    const viewTransition = startViewTransition(() => applyTheme(nextTheme));

    try {
      await viewTransition.finished;
    } finally {
      document.documentElement.removeAttribute("data-theme-transitioning");
      document.documentElement.style.removeProperty("--theme-transition-x");
      document.documentElement.style.removeProperty("--theme-transition-y");
      document.documentElement.style.removeProperty("--theme-transition-radius");
      setIsTransitioning(false);
    }
  }

  return (
    <div
      aria-busy={isTransitioning}
      aria-label="Color theme"
      className="theme-toggle"
      role="group"
    >
      <button
        aria-label="Use light theme"
        aria-pressed={theme === "light"}
        className="theme-toggle__button"
        disabled={isTransitioning}
        onClick={(event) => transitionTo("light", event)}
        type="button"
      >
        <Sun aria-hidden="true" size={12} strokeWidth={1.6} />
      </button>
      <button
        aria-label="Use dark theme"
        aria-pressed={theme === "dark"}
        className="theme-toggle__button"
        disabled={isTransitioning}
        onClick={(event) => transitionTo("dark", event)}
        type="button"
      >
        <Moon aria-hidden="true" size={12} strokeWidth={1.6} />
      </button>
    </div>
  );
}
