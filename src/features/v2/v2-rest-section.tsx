import { motion, type MotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  getAboutRevealUnit,
  getExperienceRevealUnit,
  getContactRevealUnit,
  getWhatIDoRevealUnit,
} from "./v2-scroll-timeline";
import { V2ServicesIndex } from "./capabilities/v2-services-index";
import { useSectionEntrance } from "./scroll/use-section-entrance";
import { V2CareerTimeline } from "./experience/v2-career-timeline";
import styles from "./v2-rest-section.module.css";

type V2RestSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
  staticLayout?: boolean;
  section?: "capabilities" | "experience" | "all";
};

type PanelShellProps = {
  children: ReactNode;
  className?: string;
  hideUnit: number;
  id: string;
  label: string;
  progress: MotionValue<number>;
  revealUnit: number;
  scrollUnits: number;
  staticLayout?: boolean;
};

function PanelShell({
  children,
  className = "",
  hideUnit,
  id,
  label,
  progress,
  revealUnit,
  scrollUnits,
  staticLayout = false,
}: PanelShellProps) {
  const entranceRef = useSectionEntrance<HTMLElement>(staticLayout);
  const at = (unit: number) => unit / scrollUnits;
  const clipPath = useTransform(
    progress,
    [at(revealUnit - 0.12), at(revealUnit + 0.5)],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
  );
  const isInteractive = (value: number) => value >= at(revealUnit) && value < at(hideUnit);
  const [interactive, setInteractive] = useState(() => isInteractive(progress.get()));
  useMotionValueEvent(progress, "change", (value) => setInteractive(isInteractive(value)));

  const panel = (
    <motion.section
      aria-labelledby={`${id}-heading`}
      className={`${styles.panel} ${className}`}
      data-v2-reveal-root
      ref={entranceRef}
      id={id}
      inert={!staticLayout && !interactive}
      style={staticLayout ? undefined : { clipPath, pointerEvents: interactive ? "auto" : "none" }}
    >
      <div aria-hidden="true" className={styles.noise} />
      {/* The visible headline lives in the content; this names the section for assistive tech. */}
      <h2 className="sr-only" id={`${id}-heading`}>{label}</h2>
      {children}
    </motion.section>
  );

  return panel;
}

export function V2RestSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
  staticLayout = false,
  section = "all",
}: V2RestSectionProps) {
  const whatRevealUnit = getWhatIDoRevealUnit(projectCount);
  const experienceRevealUnit = getExperienceRevealUnit(projectCount);

  return (
    <div
      aria-label={section === "all" ? "Services and experience" : section === "capabilities" ? "Services" : "Experience"}
      className={`${styles.sequence} ${section === "experience" ? styles.experienceSequence : ""} ${reduceMotion ? styles.reducedMotion : ""} ${staticLayout ? styles.staticLayout : ""}`}
      id={`v2-rest-${section}`}
    >
      {section !== "experience" && <PanelShell
        className={styles.whatPanel}
        id="v2-what-i-do"
        hideUnit={getAboutRevealUnit(projectCount) + 0.5}
        label="Services"
        progress={progress}
        revealUnit={whatRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <V2ServicesIndex staticLayout={staticLayout} />
      </PanelShell>}

      {section !== "capabilities" && <PanelShell
        className={styles.experiencePanel}
        id="v2-experience"
        hideUnit={getContactRevealUnit(projectCount) + 0.58}
        label="Experience"
        progress={progress}
        revealUnit={experienceRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <V2CareerTimeline staticLayout={staticLayout} />
      </PanelShell>}
    </div>
  );
}
