"use client";

import { useEffect, useState } from "react";
import { TranslatedText } from "@/features/translation/translation-provider";

const navigationItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;

type NavigationId = (typeof navigationItems)[number]["id"];

export function ProfileNavigation() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    let animationFrame = 0;
    const contentPanel = document.querySelector<HTMLElement>(".about-panel");

    function updateActiveSection() {
      const panelHasIndependentScroll =
        contentPanel !== null &&
        ["auto", "scroll"].includes(
          window.getComputedStyle(contentPanel).overflowY,
        );
      const panelTop = contentPanel?.getBoundingClientRect().top ?? 0;
      const scrollPosition = panelHasIndependentScroll
        ? contentPanel.scrollTop
        : window.scrollY;
      const viewportHeight = panelHasIndependentScroll
        ? contentPanel.clientHeight
        : window.innerHeight;
      const activationPoint = scrollPosition + viewportHeight * 0.3;
      let nextSection: NavigationId = navigationItems[0].id;

      for (const item of navigationItems) {
        const section = document.getElementById(item.id);
        if (!section) continue;

        const sectionTop = panelHasIndependentScroll
          ? section === contentPanel
            ? 0
            : section.getBoundingClientRect().top - panelTop + scrollPosition
          : section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= activationPoint) nextSection = item.id;
      }

      setActiveSection(nextSection);
    }

    function scheduleUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        updateActiveSection();
        animationFrame = 0;
      });
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    contentPanel?.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      contentPanel?.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);

  return (
    <nav aria-label="Portfolio sections" className="portfolio-navigation">
      {navigationItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <a
            aria-current={isActive ? "location" : undefined}
            href={`#${item.id}`}
            key={item.id}
          >
            <span aria-hidden="true" className="portfolio-navigation__indicator">
              {isActive ? "→" : ""}
            </span>
            <span>
              <TranslatedText text={item.label} />
            </span>
          </a>
        );
      })}
    </nav>
  );
}
