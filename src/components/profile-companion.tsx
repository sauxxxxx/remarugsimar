"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type PortfolioSectionId,
  useActivePortfolioSection,
} from "./use-active-portfolio-section";

const sectionGuidance: Record<PortfolioSectionId, { href: string; message: string }> = {
  about: { href: "#services", message: "See what I specialize in →" },
  contact: { href: "mailto:jarinaremar13@gmail.com", message: "Let's discuss your project →" },
  experience: { href: "#experience", message: "View my production work →" },
  projects: { href: "/projects/roarly-ai", message: "Start with Roarly AI →" },
  services: { href: "#contact", message: "Need a system like this? →" },
  stack: { href: "#stack", message: "Explore my toolkit →" },
  writing: { href: "#writing", message: "Read the latest field note →" },
};

const crowShortcuts = [
  sectionGuidance.projects,
  sectionGuidance.services,
  sectionGuidance.experience,
  sectionGuidance.writing,
  sectionGuidance.contact,
] as const;

type CrowMotion = "fly" | "hop" | "idle" | "peck" | "walk";
type CrowLocation =
  | "ground-left"
  | "ground-right"
  | "perch-middle"
  | "perch-small"
  | "perch-tall";
type CrowFacing = "left" | "right";

const locationX: Record<CrowLocation, number> = {
  "ground-left": 8,
  "ground-right": 42,
  "perch-small": 27.4,
  "perch-middle": 49,
  "perch-tall": 74,
};

const motionDuration: Record<Exclude<CrowMotion, "idle">, number> = {
  fly: 1700,
  hop: 900,
  peck: 1100,
  walk: 1400,
};

export function ProfileCompanion() {
  const activeSection = useActivePortfolioSection();
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
  const [shortcutIndex, setShortcutIndex] = useState(-1);
  const [motion, setMotion] = useState<CrowMotion>("idle");
  const [location, setLocation] = useState<CrowLocation>("ground-left");
  const [facing, setFacing] = useState<CrowFacing>("right");
  const [isEngaged, setIsEngaged] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const contextualGuide = sectionGuidance[activeSection];
  const guidance = shortcutIndex >= 0 ? crowShortcuts[shortcutIndex] : contextualGuide;
  const message = interactionMessage ?? guidance.message;
  const isBubbleOpen = Boolean(interactionMessage) || isEngaged || isPromptVisible;

  const moveCrow = useCallback((
    target: CrowLocation,
    nextMotion: Extract<CrowMotion, "fly" | "walk">,
  ) => {
    setFacing(locationX[target] < locationX[location] ? "left" : "right");
    setMotion(nextMotion);
    setLocation(target);
  }, [location]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setShortcutIndex(-1);
    setIsPromptVisible(true);
    const timer = window.setTimeout(() => setIsPromptVisible(false), 3800);
    return () => window.clearTimeout(timer);
  }, [activeSection]);

  useEffect(() => {
    if (motion === "idle") return;
    const timer = window.setTimeout(() => setMotion("idle"), motionDuration[motion]);
    return () => window.clearTimeout(timer);
  }, [motion]);

  useEffect(() => {
    if (reducedMotion || isBubbleOpen || motion !== "idle") return;

    const isPerched = location.startsWith("perch-");
    const timer = window.setTimeout(() => {
      const roll = Math.random();

      if (location === "perch-small") {
        moveCrow("perch-middle", "fly");
      } else if (location === "perch-middle") {
        moveCrow("perch-tall", "fly");
      } else if (location === "perch-tall") {
        moveCrow(Math.random() > 0.5 ? "ground-left" : "ground-right", "fly");
      } else if (roll < 0.38) {
        moveCrow(location === "ground-left" ? "ground-right" : "ground-left", "walk");
      } else if (roll < 0.62) {
        setMotion("peck");
      } else if (roll < 0.78) {
        setMotion("hop");
      } else {
        moveCrow("perch-small", "fly");
      }
    }, (isPerched ? 4200 : 6500) + Math.random() * (isPerched ? 2600 : 4000));

    return () => window.clearTimeout(timer);
  }, [isBubbleOpen, location, motion, moveCrow, reducedMotion]);

  useEffect(() => {
    const panel = document.querySelector<HTMLElement>(".profile-panel");
    if (!panel) return;

    function findMessageTarget(target: EventTarget | null) {
      return target instanceof Element
        ? target.closest<HTMLElement>("[data-companion-message]")
        : null;
    }

    function showMessage(event: Event) {
      const target = findMessageTarget(event.target);
      if (target?.dataset.companionMessage) setInteractionMessage(target.dataset.companionMessage);
    }

    function clearMessage(event: FocusEvent | PointerEvent) {
      const previous = findMessageTarget(event.target);
      const next = findMessageTarget(event.relatedTarget);
      if (previous !== next) setInteractionMessage(null);
    }

    panel.addEventListener("focusin", showMessage);
    panel.addEventListener("focusout", clearMessage);
    panel.addEventListener("pointerover", showMessage);
    panel.addEventListener("pointerout", clearMessage);

    return () => {
      panel.removeEventListener("focusin", showMessage);
      panel.removeEventListener("focusout", clearMessage);
      panel.removeEventListener("pointerover", showMessage);
      panel.removeEventListener("pointerout", clearMessage);
    };
  }, []);

  function askCrow() {
    setInteractionMessage(null);
    setShortcutIndex((current) => (current + 1) % crowShortcuts.length);
    setIsPromptVisible(true);
    if (!reducedMotion) setMotion("hop");
  }

  return (
    <div
      className="profile-companion"
      data-bubble-open={isBubbleOpen}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsEngaged(false);
      }}
      onFocusCapture={() => setIsEngaged(true)}
      onPointerEnter={() => setIsEngaged(true)}
      onPointerLeave={() => setIsEngaged(false)}
    >
      <div className="profile-companion__stage">
        <div aria-hidden="true" className="profile-companion__rigging">
          <span className="profile-companion__chain profile-companion__chain--small" />
          <span className="profile-companion__chain profile-companion__chain--middle" />
          <span className="profile-companion__chain profile-companion__chain--tall" />
        </div>

        <div aria-hidden="true" className="profile-companion__world">
          <span className="profile-companion__garden-scene" />
          <span className="profile-companion__waterfall profile-companion__waterfall--left" />
          <span className="profile-companion__waterfall profile-companion__waterfall--right" />
        </div>

        <div
          className="profile-companion__actor"
          data-facing={facing}
          data-location={location}
          data-motion={motion}
        >
          <button
            aria-label="Ask the portfolio crow for guidance"
            className="profile-companion__raven"
            data-companion-message="Ask me where to go next."
            onClick={askCrow}
            type="button"
          >
            <span aria-hidden="true" className="profile-companion__crow-lift">
              <span className="profile-companion__crow-sprite" />
            </span>
          </button>
          <a
            aria-hidden={!isBubbleOpen}
            aria-live="polite"
            className="profile-companion__bubble"
            href={guidance.href}
            key={message}
            tabIndex={isBubbleOpen ? 0 : -1}
          >
            {message}
          </a>
        </div>
      </div>
    </div>
  );
}
