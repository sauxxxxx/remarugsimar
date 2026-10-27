"use client";

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { V2RibbonCanvas } from "../ribbons/v2-ribbon-canvas";
import { useSectionEntrance } from "../scroll/use-section-entrance";
import { services, type Service } from "./service-data";
import styles from "./v2-services-index.module.css";

const pinnedQuery = "(min-width: 1025px) and (min-height: 561px) and (prefers-reduced-motion: no-preference)";
const last = services.length - 1;
// Share of each step the active line rests on before moving to the next.
const HOLD = 0.22;
const MINT: readonly [number, number, number] = [0.55, 0.86, 0.79];

function subscribe(onChange: () => void) {
  const media = window.matchMedia(pinnedQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getSnapshot = () => window.matchMedia(pinnedQuery).matches;
const getServerSnapshot = () => false;

// Scroll progress -> active line, with a rest on every service.
const holdInput: number[] = [];
const holdOutput: number[] = [];
services.forEach((_, index) => {
  const centre = index / last;
  const start = Math.max(0, centre - HOLD / last);
  const end = Math.min(1, centre + HOLD / last);
  holdInput.push(start, end);
  holdOutput.push(index, index);
});

export function V2ServicesIndex({ staticLayout }: { staticLayout: boolean }) {
  const pinned = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return pinned ? <PinnedIndex /> : <StaticIndex staticLayout={staticLayout} />;
}

function PinnedIndex() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const entranceRef = useSectionEntrance();
  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4, restDelta: 0.0005 });
  const active = useTransform(progress, holdInput, holdOutput);
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(active, "change", (value) => setActiveIndex(Math.round(value)));
  const bandTop = useTransform(active, (value) => `calc(${value + 0.58} * var(--line-step))`);
  const current = services[activeIndex];

  function select(index: number) {
    const runway = runwayRef.current;
    if (!runway) return;
    const start = runway.getBoundingClientRect().top + window.scrollY;
    const travel = runway.offsetHeight - window.innerHeight;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    window.scrollTo({ top: start + travel * (index / last), behavior });
  }

  return (
    <div className={styles.runway} ref={runwayRef} style={{ "--service-steps": last } as CSSProperties}>
      <div className={styles.sticky} data-v2-reveal-root ref={entranceRef}>
        <div className={styles.intro} data-v2-reveal="heading">
          <h3>What I can build for you.</h3>
        </div>

        <div className={styles.stage}>
          <div className={styles.index} data-v2-reveal="copy">
            <motion.div aria-hidden="true" className={styles.band} style={{ top: bandTop }}>
              <V2RibbonCanvas className={styles.bandCanvas} intensity={0.75} lift={-0.27} slope={0.02} speed={0.8} stretch={6} tint={MINT} tintAmount={0.3} />
            </motion.div>
            <ol aria-label="Services" className={styles.lines}>
            {services.map((service, index) => (
              <IndexLine
                active={active}
                current={index === activeIndex}
                index={index}
                key={service.id}
                name={service.name}
                onSelect={() => select(index)}
              />
            ))}
            </ol>
          </div>

          <div aria-live="polite" className={styles.details} data-v2-reveal="visual">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 14 }}
                key={current.id}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceDetails service={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.footer}>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
          <span aria-hidden="true" className={styles.progress}><motion.span style={{ scaleX: progress }} /></span>
        </div>
      </div>
    </div>
  );
}

function IndexLine({ active, current, index, name, onSelect }: {
  active: MotionValue<number>;
  current: boolean;
  index: number;
  name: string;
  onSelect: () => void;
}) {
  // Lines already passed drift left, upcoming ones wait to the right.
  const distance = useTransform(active, (value) => index - value);
  const x = useTransform(distance, (d) => `${Math.max(-2, Math.min(2, d)) * 2.4}vw`);
  const opacity = useTransform(distance, (d) => 1 - Math.min(Math.abs(d), 1) * 0.8);
  const scale = useTransform(distance, (d) => 1 + (1 - Math.min(Math.abs(d), 1)) * 0.035);

  return (
    <li>
      <motion.button
        aria-current={current || undefined}
        className={styles.line}
        onClick={onSelect}
        style={{ opacity, scale, x }}
        type="button"
      >
        {name}
      </motion.button>
    </li>
  );
}

function ServiceDetails({ service, showName = false }: { service: Service; showName?: boolean }) {
  return (
    <div className={styles.detailBody}>
      <h4 className={showName ? styles.staticName : "sr-only"}>{service.name}</h4>
      <p className={styles.promise}>{service.promise}</p>
      <p className={styles.description}>{service.description}</p>
      <div>
        <p className={styles.label}>What&apos;s included</p>
        <ul className={styles.tags}>
          {service.included.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <p className={styles.goodFor}><span className={styles.label}>Good for</span>{service.goodFor}</p>
    </div>
  );
}

function StaticIndex({ staticLayout }: { staticLayout: boolean }) {
  const entranceRef = useSectionEntrance(staticLayout);
  return (
    <div className={styles.static} data-v2-reveal-root ref={entranceRef}>
      <div className={styles.intro} data-v2-reveal="heading">
        <h3>What I can build for you.</h3>
      </div>
      <ol className={styles.staticList}>
        {services.map((service, index) => (
          <li data-v2-reveal="copy" key={service.id} style={{ "--v2-reveal-delay": `${80 + index * 70}ms` } as CSSProperties}>
            <span className={styles.count}>{String(index + 1).padStart(2, "0")}</span>
            <ServiceDetails service={service} showName />
          </li>
        ))}
      </ol>
    </div>
  );
}
