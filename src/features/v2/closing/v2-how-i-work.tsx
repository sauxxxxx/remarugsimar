"use client";

import { Code2, MessagesSquare, Rocket } from "lucide-react";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { useSectionEntrance } from "../scroll/use-section-entrance";
import { processSteps } from "./closing-content";
import { useProcessScroll, type ProcessNavigation } from "./use-process-scroll";
import styles from "./v2-how-i-work.module.css";

const icons = { plan: MessagesSquare, build: Code2, launch: Rocket };

export function V2HowIWork({ onNavigate }: { onNavigate?: ProcessNavigation }) {
  const entranceRef = useSectionEntrance<HTMLElement>();
  const { runwayRef, contentRef, selectedIndex, selectStage } = useProcessScroll(processSteps.length, onNavigate);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % processSteps.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + processSteps.length - 1) % processSteps.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = processSteps.length - 1;
    else return;
    event.preventDefault();
    selectStage(nextIndex);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <section aria-labelledby="v2-process-heading" className={styles.process} data-v2-reveal-root id="v2-how-i-work" ref={entranceRef}>
      <div className={styles.runway} data-process-mode="static" ref={runwayRef}>
        <div className={styles.scene}>
          <div className={styles.content} ref={contentRef}>
            <h2 className={styles.heading} data-v2-reveal="heading" id="v2-process-heading">How I work</h2>
            <div aria-label="Process stages" className={styles.tabs} data-v2-reveal="copy" role="tablist">
              {processSteps.map((step, index) => (
                <button
                  aria-controls={`v2-process-detail-${step.id}`}
                  aria-selected={selectedIndex === index}
                  id={`v2-process-tab-${step.id}`}
                  key={step.id}
                  onClick={() => selectStage(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  ref={(node) => { tabsRef.current[index] = node; }}
                  role="tab"
                  tabIndex={selectedIndex === index ? 0 : -1}
                  type="button"
                >
                  {step.label}.
                </button>
              ))}
            </div>
            <div className={styles.panels} data-v2-reveal="visual">
              {processSteps.map((step, index) => {
                const Icon = icons[step.id];
                return (
                  <div
                    aria-labelledby={`v2-process-tab-${step.id}`}
                    className={styles.panel}
                    aria-hidden={selectedIndex !== index}
                    data-process-card={step.id}
                    inert={selectedIndex !== index}
                    id={`v2-process-detail-${step.id}`}
                    key={step.id}
                    role="tabpanel"
                    style={{ "--process-layer": index + 1 } as CSSProperties}
                    tabIndex={selectedIndex === index ? 0 : -1}
                  >
                    <div aria-hidden="true" className={styles.symbol}><Icon size={30} strokeWidth={1.2} /></div>
                    <div className={styles.panelCopy}>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                      <p className={styles.outcome}>{step.outcome}</p>
                    </div>
                    <div aria-hidden="true" className={styles.dots}>
                      {processSteps.map((dot, dotIndex) => <span data-active={dotIndex === index} key={dot.id} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
