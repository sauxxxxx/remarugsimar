"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

type FocusModeShellProps = {
  profile: ReactNode;
  content: ReactNode;
};

export function FocusModeShell({ profile, content }: FocusModeShellProps) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    function leaveFocusMode(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFocused(false);
    }

    window.addEventListener("keydown", leaveFocusMode);
    return () => window.removeEventListener("keydown", leaveFocusMode);
  }, [isFocused]);

  const label = isFocused ? "Exit focus mode" : "Enter focus mode";
  const Icon = isFocused ? Minimize2 : Maximize2;

  return (
    <>
      <button
        aria-label={label}
        aria-pressed={isFocused}
        className="focus-mode-toggle"
        onClick={() => setIsFocused((current) => !current)}
        title={label}
        type="button"
      >
        <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>
      <main className={`portfolio-shell${isFocused ? " portfolio-shell--focused" : ""}`}>
        {profile}
        {content}
      </main>
    </>
  );
}
