import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, type MotionStyle } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./v2-project-stage.module.css";

type V2ProjectStageProps = {
  children: ReactNode;
  railOneStyle?: MotionStyle;
  railTwoStyle?: MotionStyle;
};

export function V2ProjectStage({ children, railOneStyle, railTwoStyle }: V2ProjectStageProps) {
  return (
    <section aria-label="Selected work" className={styles.section} id="v2-projects">
      <div aria-hidden="true" className={styles.atmosphere} />

      <header className={styles.sectionHeader}>
        <p><span>02</span> Selected work</p>
        <i aria-hidden="true" />
        <Link href="/projects">
          View all projects
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.6} />
        </Link>
      </header>

      <div className={styles.projectViewport}>{children}</div>

      <Image
        alt=""
        aria-hidden="true"
        className={styles.rock}
        fill
        priority
        sizes="100vw"
        src="/v2/roarly-volcanic-rock-v2.webp"
      />

      <ol aria-label="Project position" className={styles.projectRail}>
        <motion.li style={railOneStyle}><span>01</span><i /></motion.li>
        <motion.li style={railTwoStyle}><span>02</span><i /></motion.li>
        <li><span>03</span></li>
      </ol>

      <p className={styles.scrollHint}>
        <span><ArrowDown aria-hidden="true" size={15} strokeWidth={1.5} /></span>
        Scroll to view next project
      </p>
    </section>
  );
}
