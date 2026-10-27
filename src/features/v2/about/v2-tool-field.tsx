"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./v2-tool-field.module.css";

// Logos live in /public/v2/experience/tools; every logo is shown as white.
const tools = [
  { name: "Figma", file: "figma" },
  { name: "ChatGPT", file: "openai" },
  { name: "Claude", file: "claude" },
  { name: "Google", file: "google" },
  { name: "Vue.js", file: "vue" },
  { name: "Node.js", file: "node" },
  { name: "Flutter", file: "flutter" },
  { name: "Supabase", file: "supabase" },
  { name: "Tailwind CSS", file: "tailwind" },
  { name: "JavaScript", file: "javascript" },
  { name: "Firebase", file: "firebase" },
  { name: "WordPress", file: "wordpress" },
  { name: "Elementor", file: "elementor" },
  { name: "Slack", file: "slack" },
  { name: "Discord", file: "discord" },
  { name: "Microsoft Teams", file: "microsoftteams" },
] as const;

export function V2ToolField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  // Pause the loop while it is off-screen or the tab is hidden.
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
      <p className={styles.introduction}>
        Curious about my tech stack? These are the development, design, AI, and communication tools I use to deliver quality results.
      </p>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[false, true].map((duplicate) => (
            <ul
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : "Tools I use"}
              className={`${styles.tools} ${duplicate ? styles.duplicate : ""}`}
              key={String(duplicate)}
            >
              {tools.map(({ name, file }) => (
                <li className={styles.tool} key={name}>
                  <Image
                    alt={duplicate ? "" : name}
                    className={styles.logo}
                    draggable={false}
                    height={24}
                    src={`/v2/experience/tools/${file}.svg`}
                    width={24}
                  />
                  <span aria-hidden="true" className={styles.name}>{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
