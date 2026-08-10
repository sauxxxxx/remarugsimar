"use client";

import {
  BriefcaseBusiness,
  FolderOpen,
  Grid2X2,
  Home,
  Layers3,
  PenLine,
  Send,
} from "lucide-react";
import { TranslatedText } from "@/features/translation/translation-provider";
import { portfolioSections, useActivePortfolioSection } from "./use-active-portfolio-section";

const navigationIcons = {
  about: Home,
  contact: Send,
  experience: BriefcaseBusiness,
  projects: FolderOpen,
  services: Grid2X2,
  stack: Layers3,
  writing: PenLine,
} as const;

const navigationMessages = {
  about: "Meet the developer.",
  contact: "Ready to discuss a project?",
  experience: "Follow the work timeline.",
  projects: "See what Remar has shipped.",
  services: "See how Remar can help.",
  stack: "Inspect the toolkit.",
  writing: "Read the field notes.",
} as const;

export function ProfileNavigation() {
  const activeSection = useActivePortfolioSection();

  return (
    <nav aria-label="Portfolio sections" className="portfolio-navigation">
      {portfolioSections.map((item, index) => {
        const isActive = activeSection === item.id;
        const Icon = navigationIcons[item.id];

        return (
          <a
            aria-current={isActive ? "location" : undefined}
            data-companion-message={navigationMessages[item.id]}
            href={`#${item.id}`}
            key={item.id}
          >
            <Icon aria-hidden="true" className="portfolio-navigation__icon" size={15} strokeWidth={1.45} />
            <span aria-hidden="true" className="portfolio-navigation__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="portfolio-navigation__label">
              <TranslatedText text={item.label} />
            </span>
          </a>
        );
      })}
    </nav>
  );
}
