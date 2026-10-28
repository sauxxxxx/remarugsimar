"use client";

import { useScroll, useTransform } from "motion/react";
import { V2RibbonCanvas } from "./v2-ribbon-canvas";
import styles from "./v2-ambient-backdrop.module.css";

const MINT: readonly [number, number, number] = [0.55, 0.86, 0.79];

// A dim, page-length ribbon layer behind the sections below Selected Work, so the
// light from the hero and the work panel carries on instead of stopping.
export function V2AmbientBackdrop() {
  const { scrollY } = useScroll();
  const flow = useTransform(scrollY, (value) => value / 1400);

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <V2RibbonCanvas
        className={styles.canvas}
        flow={flow}
        intensity={0.24}
        lift={-0.12}
        slope={-0.08}
        speed={0.45}
        tint={MINT}
        tintAmount={0.25}
      />
      <div className={styles.grain} />
    </div>
  );
}
