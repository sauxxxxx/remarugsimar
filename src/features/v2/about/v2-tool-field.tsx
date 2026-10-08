"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { toolLogos } from "../brand/v2-tool-logos";
import styles from "./v2-tool-field.module.css";

const tools = [
  "Vue.js", "Node.js", "Flutter", "Supabase", "Tailwind CSS",
  "JavaScript", "Firebase", "WordPress", "Elementor",
] as const;

export function V2ToolField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    let inView = false;
    let disposed = false;
    const update = () => {
      if (!disposed) field.dataset.active = String(inView && !document.hidden);
    };
    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        update();
      })
      : undefined;
    if (observer) observer.observe(field);
    else inView = true;
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      delete field.dataset.active;
    };
  }, []);

  return (
    <div aria-label="Tools I use" className={styles.field} data-v2-reveal="visual" ref={fieldRef} role="group">
      <h3 className={styles.heading}>Tools I use</h3>
      <div
        className={styles.row}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.scrollLeft = 0;
        }}
      >
        <div className={styles.track}>
          {[false, true].map((duplicate) => (
            <ul
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : "Tool row"}
              className={`${styles.group} ${duplicate ? styles.duplicate : ""}`}
              inert={duplicate || undefined}
              key={String(duplicate)}
            >
              {tools.map((tool) => {
                const logo = toolLogos[tool];
                return (
                  <li aria-label={tool} className={styles.tool} key={tool} tabIndex={duplicate ? -1 : 0}>
                    <Image
                      alt=""
                      className={`${styles.logo} ${logo.monochrome ? styles.monochrome : ""}`}
                      draggable={false}
                      height={28}
                      src={`/v2/experience/tools/${logo.file}.svg`}
                      width={28}
                    />
                    <span aria-hidden="true" className={styles.name}>{tool}</span>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
