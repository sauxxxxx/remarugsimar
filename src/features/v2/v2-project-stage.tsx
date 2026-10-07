import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  getClosingRevealUnit,
  getLastProjectSettleUnit,
} from "./v2-scroll-timeline";
import { V2ProjectRail } from "./v2-project-rail";
import styles from "./v2-project-stage.module.css";

type V2ProjectStageProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  projectCount: number;
  scrollUnits: number;
  onSelectProject: (index: number) => void;
};

export function V2ProjectStage({
  children,
  onSelectProject,
  progress,
  projectCount,
  scrollUnits,
}: V2ProjectStageProps) {
  const lastSettleUnit = getLastProjectSettleUnit(projectCount);
  const closingRevealUnit = getClosingRevealUnit(projectCount);
  const chromeOpacity = useTransform(
    progress,
    [lastSettleUnit / scrollUnits, (closingRevealUnit + 0.32) / scrollUnits],
    [1, 0],
  );
  const chromeY = useTransform(
    progress,
    [lastSettleUnit / scrollUnits, (closingRevealUnit + 0.32) / scrollUnits],
    ["0px", "-14px"],
  );

  return (
    <section aria-label="Selected work" className={styles.section} id="v2-projects">
      <motion.header className={styles.sectionHeader} style={{ opacity: chromeOpacity, y: chromeY }}>
        <p><span>02</span> Selected work</p>
        <i aria-hidden="true" />
        <Link href="/v2/projects">
          View all projects
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.6} />
        </Link>
      </motion.header>

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

      <V2ProjectRail
        onSelectProject={onSelectProject}
        progress={progress}
        projectCount={projectCount}
        scrollUnits={scrollUnits}
        style={{ opacity: chromeOpacity, y: chromeY }}
      />

      <motion.p className={styles.scrollHint} style={{ opacity: chromeOpacity }}>
        <span><ArrowDown aria-hidden="true" size={15} strokeWidth={1.5} /></span>
        Scroll to view next project
      </motion.p>
    </section>
  );
}
