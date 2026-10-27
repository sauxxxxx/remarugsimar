"use client";

import { type MotionValue, useTransform } from "motion/react";
import { V2RibbonCanvas } from "../ribbons/v2-ribbon-canvas";
import styles from "./v2-work-ribbons.module.css";

// The hero's ribbons, quieter and tinted toward the mint accent.
const MINT: readonly [number, number, number] = [0.55, 0.86, 0.79];

type V2WorkRibbonsProps = {
  /** Scroll progress of the project stage; the ribbons flow forward as projects change. */
  progress?: MotionValue<number>;
  scrollUnits?: number;
  compact?: boolean;
};

export function V2WorkRibbons({ progress, scrollUnits = 1, compact = false }: V2WorkRibbonsProps) {
  return progress
    ? <ScrollRibbons progress={progress} scrollUnits={scrollUnits} />
    : <StillRibbons compact={compact} />;
}

function ScrollRibbons({ progress, scrollUnits }: { progress: MotionValue<number>; scrollUnits: number }) {
  const flow = useTransform(progress, (value) => value * scrollUnits * 1.4);
  return (
    <div aria-hidden="true" className={styles.ribbons}>
      <V2RibbonCanvas
        className={styles.canvas}
        flow={flow}
        intensity={1}
        lift={-0.06}
        slope={-0.1}
        speed={0.7}
        tint={MINT}
        tintAmount={0.35}
      />
    </div>
  );
}

function StillRibbons({ compact }: { compact: boolean }) {
  return (
    <div aria-hidden="true" className={`${styles.ribbons} ${compact ? styles.compact : ""}`}>
      <V2RibbonCanvas
        className={styles.canvas}
        intensity={0.3}
        lift={-0.2}
        slope={-0.1}
        speed={0.7}
        tint={MINT}
        tintAmount={0.35}
      />
    </div>
  );
}
