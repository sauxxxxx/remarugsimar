"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startParticleSignature } from "@/features/entrance/particle-signature";

export function EntranceTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  const stopAnimationRef = useRef<(() => void) | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const [exitState, setExitState] = useState<"idle" | "natural" | "skipped">("idle");

  const finish = useCallback((skipped = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setExitState(skipped ? "skipped" : "natural");

    if (skipped) stopAnimationRef.current?.();
    const delay = skipped ? 280 : 720;
    exitTimerRef.current = window.setTimeout(() => {
      document.documentElement.removeAttribute("data-portfolio-entrance");
      document.querySelectorAll<HTMLElement>(".portfolio-shell, .skip-link").forEach((element) => {
        element.inert = false;
      });
    }, delay);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (unmountTimerRef.current) window.clearTimeout(unmountTimerRef.current);
    if (root.dataset.portfolioEntrance !== "pending" || !canvas) return;

    document.querySelectorAll<HTMLElement>(".portfolio-shell, .skip-link").forEach((element) => {
      element.inert = true;
    });

    const stop = startParticleSignature(canvas, { onComplete: () => finish(false) });
    stopAnimationRef.current = stop;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      stop();
      stopAnimationRef.current = null;
      window.removeEventListener("keydown", handleKeyDown);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      unmountTimerRef.current = window.setTimeout(() => {
        root.removeAttribute("data-portfolio-entrance");
        document.querySelectorAll<HTMLElement>(".portfolio-shell, .skip-link").forEach((element) => {
          element.inert = false;
        });
      }, 0);
    };
  }, [finish]);

  return (
    <div
      className={`portfolio-entrance${exitState !== "idle" ? " portfolio-entrance--exiting" : ""}${exitState === "skipped" ? " portfolio-entrance--skipped" : ""}`}
      aria-label="Animated introduction"
      aria-modal="true"
      role="dialog"
    >
      <canvas ref={canvasRef} className="portfolio-entrance__canvas" aria-hidden="true" />
      <button className="portfolio-entrance__skip" type="button" onClick={() => finish(true)}>
        skip intro
      </button>
    </div>
  );
}
