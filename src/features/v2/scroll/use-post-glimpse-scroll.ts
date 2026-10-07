"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useCallback, useEffect, useRef, type RefObject } from "react";

const smoothScrollQuery = "(min-width: 1025px) and (min-height: 561px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function usePostGlimpseScroll(trackRef: RefObject<HTMLDivElement | null>) {
  const lenisRef = useRef<Lenis | null>(null);
  const boundary = useCallback(() => {
    const track = trackRef.current;
    return track ? track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight : Infinity;
  }, [trackRef]);

  useEffect(() => {
    const media = window.matchMedia(smoothScrollQuery);
    const root = document.documentElement;
    const destroy = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      delete root.dataset.v2SmoothScroll;
    };
    const update = () => {
      destroy();
      if (!media.matches) return;
      const lenis: Lenis = new Lenis({
        autoRaf: true,
        lerp: 0.16,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        allowNestedScroll: true,
        virtualScroll: ({ deltaX, deltaY, event }) => {
          const start = boundary();
          const smooth = root.dataset.v2Entrance !== "pending"
            && event.type === "wheel" && !event.ctrlKey && !event.shiftKey
            && Math.abs(deltaY) > Math.abs(deltaX)
            && window.scrollY >= start && lenis.targetScroll + deltaY >= start;
          // Cancel residual momentum before giving input back to native scrolling.
          if (!smooth && lenis.isScrolling === "smooth") {
            lenis.scrollTo(window.scrollY, { immediate: true });
          }
          return smooth;
        },
      });
      lenisRef.current = lenis;
      root.dataset.v2SmoothScroll = "enabled";
    };
    const cancelForKeyboard = (event: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
      const lenis = lenisRef.current;
      if (lenis?.isScrolling === "smooth") lenis.scrollTo(window.scrollY, { immediate: true });
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("keydown", cancelForKeyboard);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("keydown", cancelForKeyboard);
      destroy();
    };
  }, [trackRef, boundary]);

  return (target: number | HTMLElement) => {
    const lenis = lenisRef.current;
    const targetTop = typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY - 24;
    const start = boundary();
    if (lenis && window.scrollY >= start && targetTop >= start) {
      lenis.scrollTo(targetTop);
      return;
    }
    if (lenis?.isScrolling === "smooth") lenis.scrollTo(window.scrollY, { immediate: true });
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (typeof target === "number") window.scrollTo({ top: target, behavior });
    else target.scrollIntoView({ behavior, block: "start" });
  };
}
