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

const ravenReplies = [
  "No bugs on my watch.",
  "The projects are worth exploring.",
  "Still debugging.",
  "You found the portfolio raven.",
] as const;

function PixelRaven() {
  return (
    <svg aria-hidden="true" shapeRendering="crispEdges" viewBox="0 0 104 88">
      <path
        d="M43 8h18v4h8v6h17v7H66v8h-7v9h-5v17h-7v11h-8v-7H26v-5H13v-7h10v-9h5V25h7V13h8V8Z"
        fill="currentColor"
      />
      <path d="M30 33h22v6h-7v6h-8v5H25v-7h5V33Z" fill="var(--background)" />
      <path d="M54 16h4v4h-4z" fill="var(--accent)" />
      <path d="M38 69h4v12h-9v-4h5V69Zm12-5h4v17h9v4H49V64Z" fill="currentColor" />
      <path d="M24 84h46" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ProfileCompanion() {
  const activeSection = useActivePortfolioSection();
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
  const [replyIndex, setReplyIndex] = useState(-1);
  const replyTimer = useRef<number | null>(null);
  const guidance = sectionGuidance[activeSection];
  const message = interactionMessage ?? (replyIndex >= 0 ? ravenReplies[replyIndex] : guidance.message);

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

  function askRaven() {
    setInteractionMessage(null);
    setReplyIndex((current) => (current + 1) % ravenReplies.length);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => setReplyIndex(-1), 4200);
  }

  return (
    <div className="profile-companion">
      <button
        aria-label="Ask the portfolio raven for guidance"
        className="profile-companion__raven"
        data-companion-message="Ask me where to go next."
        onClick={askRaven}
        type="button"
      >
        <PixelRaven />
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
