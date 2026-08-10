"use client";

import { useEffect, useRef, useState } from "react";
import {
  type PortfolioSectionId,
  useActivePortfolioSection,
} from "./use-active-portfolio-section";

const sectionGuidance: Record<PortfolioSectionId, { href: string; message: string }> = {
  about: { href: "#projects", message: "Start with selected projects." },
  contact: { href: "#contact", message: "Send the project brief." },
  experience: { href: "#experience", message: "Follow the work timeline." },
  projects: { href: "#contact", message: "Need a build like this?" },
  services: { href: "#services", message: "Match a service to your workflow." },
  stack: { href: "#stack", message: "Inspect the toolkit." },
  writing: { href: "#writing", message: "Read the field notes." },
};

const crowReplies = [
  "No bugs on my watch.",
  "The projects are worth exploring.",
  "Still debugging.",
  "You found the portfolio crow.",
] as const;

export function ProfileCompanion() {
  const activeSection = useActivePortfolioSection();
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
  const [replyIndex, setReplyIndex] = useState(-1);
  const replyTimer = useRef<number | null>(null);
  const guidance = sectionGuidance[activeSection];
  const message = interactionMessage ?? (replyIndex >= 0 ? crowReplies[replyIndex] : guidance.message);

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
      if (target?.dataset.companionMessage) {
        setInteractionMessage(target.dataset.companionMessage);
      }
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

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
  }, []);

  function askCrow() {
    setInteractionMessage(null);
    setReplyIndex((current) => (current + 1) % crowReplies.length);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => setReplyIndex(-1), 4200);
  }

  return (
    <div className="profile-companion">
      <button
        aria-label="Ask the portfolio crow for guidance"
        className="profile-companion__raven"
        data-companion-message="Ask me where to go next."
        onClick={askCrow}
        type="button"
      >
        <span aria-hidden="true" className="profile-companion__crow-sprite" />
      </button>
      <a
        aria-live="polite"
        className="profile-companion__bubble"
        href={guidance.href}
        key={message}
      >
        {message}
      </a>
    </div>
  );
}
