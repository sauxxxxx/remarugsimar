"use client";

import { useState } from "react";
import { processSteps } from "./closing-content";
import styles from "./v2-how-i-work.module.css";

export function V2HowIWork() {
  const [selectedId, setSelectedId] = useState<(typeof processSteps)[number]["id"]>("understand");

  return (
    <section aria-labelledby="v2-process-heading" className={styles.process} id="v2-how-i-work">
      <div className={styles.content}>
        <header className={styles.heading}>
          <h2 id="v2-process-heading">How I work.</h2>
          <p>A clear path from problem to product.</p>
        </header>
        <ol className={styles.steps}>
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
