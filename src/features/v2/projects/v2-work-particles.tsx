"use client";

import { useEffect, useRef } from "react";
import styles from "./v2-work-particles.module.css";

// Fixed coordinates keep the decorative layer identical during server rendering and hydration.
const textures = Array.from({ length: 3 }, (_, layer) => {
  const dots = Array.from({ length: 32 }, (_, index) => {
    const x = (index * 317 + layer * 197 + 53) % 1200;
    const y = (index * 191 + layer * 313 + 79) % 800;
    const radius = 0.45 + ((index * 7 + layer) % 4) * 0.18;
    const opacity = 0.12 + ((index * 3 + layer) % 5) * 0.045;
    return `<circle cx="${x}" cy="${y}" r="${radius}" opacity="${opacity}"/>`;
  }).join("");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" fill="white">${dots}</svg>`)}")`;
});

export function V2WorkParticles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    let visible = false;
    let disposed = false;
    const update = () => {
      if (!disposed) layer.dataset.active = String(visible && !document.hidden);
    };
    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); })
      : undefined;
    if (observer) observer.observe(layer);
    else { visible = true; update(); }
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      delete layer.dataset.active;
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.particles} ref={ref}>
      {textures.map((backgroundImage, index) => (
        <span className={styles.layer} key={index} style={{ backgroundImage }} />
      ))}
    </div>
  );
}
