"use client";

import { V2RibbonCanvas } from "../ribbons/v2-ribbon-canvas";
import styles from "./v2-hero-ribbons.module.css";

export function V2HeroRibbons({ active = true }: { active?: boolean }) {
  return (
    <div aria-hidden="true" className={styles.ribbons}>
      <V2RibbonCanvas active={active} className={styles.canvas} />
    </div>
  );
}
