"use client";

import { useEffect, useRef } from "react";
import "./v2-section-entrance.css";

export function useSectionEntrance<T extends HTMLElement = HTMLDivElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root) return;
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-v2-reveal]"))
      .filter((group) => group.closest("[data-v2-reveal-root]") === root);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const reveal = (group: HTMLElement, immediate = false) => {
      const state = group.dataset.v2RevealState;
      if (state === "complete" || state === "instant" || (state === "visible" && !immediate)) return;
      group.dataset.v2RevealState = immediate ? "instant" : "visible";
      observer?.unobserve(group);
    };

    const update = () => {
      observer?.disconnect();
      observer = undefined;
      if (preference.matches || typeof window.IntersectionObserver !== "function") {
        groups.forEach((group) => reveal(group, true));
        return;
      }
      const nextObserver: IntersectionObserver = new window.IntersectionObserver((entries) => {
        if (observer !== nextObserver) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18) reveal(entry.target as HTMLElement);
        }
      }, { threshold: 0.18, rootMargin: "0px 0px -32px 0px" });
      observer = nextObserver;
      groups.forEach((group) => {
        if (["visible", "instant", "complete"].includes(group.dataset.v2RevealState ?? "")) return;
        if (group.contains(document.activeElement)) {
          reveal(group, true);
          return;
        }
        group.dataset.v2RevealState = "pending";
        observer?.observe(group);
      });
    };

    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;
      const group = target.closest<HTMLElement>("[data-v2-reveal]");
      if (group && groups.includes(group)) reveal(group, true);
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      const group = event.target as HTMLElement;
      if (event.animationName === "v2-content-enter" && groups.includes(group)) {
        group.dataset.v2RevealState = "complete";
      }
    };

    update();
    root.addEventListener("focusin", onFocus);
    root.addEventListener("animationend", onAnimationEnd);
    preference.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      observer = undefined;
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("animationend", onAnimationEnd);
      preference.removeEventListener("change", update);
      groups.forEach((group) => { delete group.dataset.v2RevealState; });
    };
  }, [enabled]);

  return ref;
}
