"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

type FocusModeShellProps = {
  profile: ReactNode;
  content: ReactNode;
};

export function FocusModeShell({ profile, content }: FocusModeShellProps) {
  const [focusState, setFocusState] = useState<"default" | "focused" | "exiting">("default");
  const isFocused = focusState === "focused";
  const isExpanded = focusState !== "default";
  const isTransitioning = focusState === "exiting";

  useEffect(() => {
    if (focusState !== "exiting") return;

    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 620;
    const exitTimer = window.setTimeout(() => setFocusState("default"), exitDuration);
    return () => window.clearTimeout(exitTimer);
  }, [focusState]);

  useEffect(() => {
    if (!isFocused) return;

    function leaveFocusMode(event: KeyboardEvent) {
      if (event.key === "Escape") setFocusState("exiting");
    }

    window.addEventListener("keydown", leaveFocusMode);
    return () => window.removeEventListener("keydown", leaveFocusMode);
  }, [isFocused]);

  const label = isExpanded ? "Exit focus mode" : "Enter focus mode";
  const Icon = isExpanded ? Minimize2 : Maximize2;
  const shellStateClass =
    focusState === "focused"
      ? " portfolio-shell--focused"
      : focusState === "exiting"
        ? " portfolio-shell--exiting"
        : "";

  return (
    <main className={`portfolio-shell${shellStateClass}`}>
      <button
        aria-label={label}
        aria-pressed={isExpanded}
        className="focus-mode-toggle"
        disabled={isTransitioning}
        onClick={() => setFocusState(isFocused ? "exiting" : "focused")}
        title={label}
        type="button"
      >
        <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>
      {profile}
      {content}
    </main>
  );
}
