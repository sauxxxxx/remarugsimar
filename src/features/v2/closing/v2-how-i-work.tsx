"use client";

import { useState } from "react";
import { useSectionEntrance } from "../scroll/use-section-entrance";
import { processSteps } from "./closing-content";
import styles from "./v2-how-i-work.module.css";

export function V2HowIWork() {
  const entranceRef = useSectionEntrance<HTMLElement>();
  const [selectedId, setSelectedId] = useState<(typeof processSteps)[number]["id"]>("understand");

  return (
    <section aria-labelledby="v2-process-heading" className={styles.process} data-v2-reveal-root id="v2-how-i-work" ref={entranceRef}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <h2 data-v2-reveal="heading" id="v2-process-heading">How I work.</h2>
          <p data-v2-reveal="copy">A clear path from problem to product.</p>
        </header>
        <ol className={styles.steps} data-v2-reveal="visual">
          {processSteps.map((step, index) => (
            <li key={step.id}>
              <button
                aria-controls={`v2-process-detail-${step.id}`}
                aria-expanded={selectedId === step.id}
                className={styles.step}
                onClick={() => setSelectedId(step.id)}
                type="button"
              >
                <span aria-hidden="true" className={styles.number}>0{index + 1}</span>
                <span className={styles.stepCopy}><strong>{step.title}</strong><span>{step.summary}</span></span>
              </button>
              <p
                className={styles.detail}
                hidden={selectedId !== step.id}
                id={`v2-process-detail-${step.id}`}
              >
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
