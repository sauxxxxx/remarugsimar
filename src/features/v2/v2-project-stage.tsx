import DarkVeil from "@/components/DarkVeil";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  getClosingRevealUnit,
  getLastProjectSettleUnit,
  getProjectSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-project-stage.module.css";

type V2ProjectStageProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  projectCount: number;
  scrollUnits: number;
};

const accent = "#b5df08";
const muted = "rgba(245,245,239,.62)";
const darkVeilTint = [181 / 255, 223 / 255, 8 / 255] as const;

function V2ProjectRailItem({
  index,
  progress,
  projectCount,
  scrollUnits,
}: {
  index: number;
  progress: MotionValue<number>;
  projectCount: number;
  scrollUnits: number;
}) {
  const settle = getProjectSettleUnit(index) / scrollUnits;
  const previousSettle = index === 0 ? 0 : getProjectSettleUnit(index - 1) / scrollUnits;
  const nextSettle = index === projectCount - 1 ? 1 : getProjectSettleUnit(index + 1) / scrollUnits;
  const activeStart = index === 0 ? 0 : (previousSettle + settle) / 2;
  const activeEnd = index === projectCount - 1 ? 1 : (settle + nextSettle) / 2;
  const transitionWidth = 0.012;

  const input = index === 0
    ? [0, activeEnd, activeEnd + transitionWidth, 1]
    : index === projectCount - 1
      ? [0, activeStart - transitionWidth, activeStart, 1]
      : [0, activeStart - transitionWidth, activeStart, activeEnd, activeEnd + transitionWidth, 1];
  const output = index === 0
    ? [accent, accent, muted, muted]
    : index === projectCount - 1
      ? [muted, muted, accent, accent]
      : [muted, muted, accent, accent, muted, muted];
  const color = useTransform(progress, input, output);

  return (
    <motion.li style={{ color }}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      {index < projectCount - 1 ? <i /> : null}
    </motion.li>
  );
}

export function V2ProjectStage({
  children,
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
      <div aria-hidden="true" className={styles.darkVeil}>
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.015}
          offsetX={0}
          offsetY={-0.4}
          resolutionScale={0.7}
          scanlineIntensity={0}
          speed={0.35}
          tintColor={darkVeilTint}
          tintStrength={1}
          warpAmount={0.08}
          zoom={1.3}
        />
      </div>
      <div aria-hidden="true" className={styles.atmosphere} />

      <motion.header className={styles.sectionHeader} style={{ opacity: chromeOpacity, y: chromeY }}>
        <p><span>02</span> Selected work</p>
        <i aria-hidden="true" />
        <Link href="/projects">
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

      <motion.ol
        aria-label="Project position"
        className={styles.projectRail}
        style={{ opacity: chromeOpacity, y: chromeY }}
      >
        {Array.from({ length: projectCount }, (_, index) => (
          <V2ProjectRailItem
            index={index}
            key={index}
            progress={progress}
            projectCount={projectCount}
            scrollUnits={scrollUnits}
          />
        ))}
      </motion.ol>

      <motion.p className={styles.scrollHint} style={{ opacity: chromeOpacity }}>
        <span><ArrowDown aria-hidden="true" size={15} strokeWidth={1.5} /></span>
        Scroll to view next project
      </motion.p>
    </section>
  );
}
