"use client";

import { useEffect, useRef, useState } from "react";

const SPEED = 28; // Pixels per second, independent of the screen's refresh rate.

export function useProjectMarquee(active: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group || !active || paused) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let period = group.getBoundingClientRect().width;
    let position = viewport.scrollLeft;
    let hovering = false;
    let touching = false;
    let resumeAt = 0;
    let visible = true;

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const resize = new ResizeObserver(() => {
      period = group.getBoundingClientRect().width;
      position = viewport.scrollLeft;
    });
    observer.observe(viewport);
    resize.observe(group);

    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") hovering = true; };
    const leave = () => { hovering = false; };
    const down = (event: PointerEvent) => { if (event.pointerType !== "mouse") touching = true; };
    const up = () => {
      touching = false;
      resumeAt = performance.now() + 2000;
    };
    const wheel = () => { resumeAt = performance.now() + 2000; };
    viewport.addEventListener("pointerenter", enter);
    viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("pointerdown", down, { passive: true });
    viewport.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });

    function tick(time: number) {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      const focused = viewport!.contains(document.activeElement);
      if (!paused && !media.matches && !hovering && !touching && !focused && visible && !document.hidden && time >= resumeAt && period > 0) {
        // Native scrolling keeps touch gestures and keyboard focus usable.
        // Retain fractional pixels so slow motion stays smooth on high-refresh displays.
        if (Math.abs(viewport!.scrollLeft - position) > 1) position = viewport!.scrollLeft;
        position = (position + elapsed * SPEED / 1000) % period;
        viewport!.scrollLeft = position;
      } else {
        position = viewport!.scrollLeft;
      }
      frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      viewport.removeEventListener("pointerenter", enter);
      viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [active, paused]);

  return { viewportRef, groupRef, paused, togglePaused: () => setPaused((value) => !value) };
}
