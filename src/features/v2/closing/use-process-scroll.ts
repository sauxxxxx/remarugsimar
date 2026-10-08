"use client";

import { useEffect, useRef, useState } from "react";
import { getProcessScrollFrame, getProcessScrollGeometry } from "./process-scroll";

export type ProcessNavigation = (top: number) => void;

export function useProcessScroll(count: number, onNavigate?: ProcessNavigation) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRef = useRef(0);
  const geometryRef = useRef({ enabled: false, stepDistance: 1, entryDistance: 0, activeArrival: 0.8 });

  useEffect(() => {
    const runway = runwayRef.current;
    const content = contentRef.current;
    if (!runway || !content) return;
    const cards = Array.from(runway.querySelectorAll<HTMLElement>("[data-process-card]"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let frame = 0;
    let needsMeasure = false;

    const paint = () => {
      const geometry = geometryRef.current;
      const start = runway.getBoundingClientRect().top + window.scrollY;
      const next = geometry.enabled
        ? getProcessScrollFrame((window.scrollY - start) / geometry.stepDistance, count, geometry.entryDistance, geometry.activeArrival)
        : { activeIndex: selectedRef.current, cards: cards.map((_, index) => ({ y: 0, scale: 1, opacity: index === selectedRef.current ? 1 : 0 })) };
      cards.forEach((card, index) => {
        const state = next.cards[index];
        card.style.setProperty("--process-y", `${state.y}px`);
        card.style.setProperty("--process-scale", String(state.scale));
        card.style.setProperty("--process-opacity", String(state.opacity));
      });
      selectedRef.current = next.activeIndex;
      setSelectedIndex((current) => current === next.activeIndex ? current : next.activeIndex);
    };

    const measure = () => {
      const viewport = window.innerHeight;
      const geometry = getProcessScrollGeometry(viewport, content.offsetHeight, Math.max(...cards.map((card) => card.offsetHeight)), count);
      geometryRef.current = { ...geometry, enabled: geometry.enabled && !media.matches };
      runway.dataset.processMode = geometryRef.current.enabled ? "pinned" : "static";
      runway.style.setProperty("--process-runway-height", `${geometry.runwayHeight}px`);
      runway.style.setProperty("--process-viewport-height", `${viewport}px`);
      paint();
    };

    const schedule = (measureNeeded = false) => {
      if (disposed) return;
      needsMeasure ||= measureNeeded;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (disposed) return;
        if (needsMeasure) measure();
        else paint();
        needsMeasure = false;
      });
    };
    const onScroll = () => schedule();
    const onResize = () => schedule(true);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(onResize) : undefined;
    measure();
    observer?.observe(content);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onResize);
    document.fonts?.ready.then(onResize);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onResize);
      delete runway.dataset.processMode;
      runway.style.removeProperty("--process-runway-height");
      runway.style.removeProperty("--process-viewport-height");
      cards.forEach((card) => ["--process-y", "--process-scale", "--process-opacity"].forEach((property) => card.style.removeProperty(property)));
      geometryRef.current.enabled = false;
    };
  }, [count]);

  function selectStage(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= count) return;
    const runway = runwayRef.current;
    if (geometryRef.current.enabled && runway) {
      const target = runway.getBoundingClientRect().top + window.scrollY + index * geometryRef.current.stepDistance;
      if (onNavigate) onNavigate(target);
      else window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    selectedRef.current = index;
    setSelectedIndex(index);
    runway?.querySelectorAll<HTMLElement>("[data-process-card]").forEach((card, cardIndex) => {
      card.style.setProperty("--process-opacity", cardIndex === index ? "1" : "0");
    });
  }

  return { runwayRef, contentRef, selectedIndex, selectStage };
}
