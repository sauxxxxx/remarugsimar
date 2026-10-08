"use client";

import { V2ContactSection } from "../v2-contact-section";
import { V2HowIWork } from "./v2-how-i-work";
import type { ProcessNavigation } from "./use-process-scroll";
import styles from "./v2-closing-section.module.css";

export function V2ClosingSection({ onNavigate }: { onNavigate?: ProcessNavigation }) {
  return (
    <div className={styles.ending} id="v2-ending">
      <V2HowIWork onNavigate={onNavigate} />
      <V2ContactSection />
    </div>
  );
}
