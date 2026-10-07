import { motion, type MotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  getExperienceRevealUnit,
  getContactRevealUnit,
  getExperimentsRevealUnit,
  getExperimentsSettleUnit,
  getWhatIDoRevealUnit,
} from "./v2-scroll-timeline";
import { V2Capabilities } from "./capabilities/v2-capabilities";
import capabilityStyles from "./capabilities/v2-capabilities.module.css";
import { V2FlowReveal } from "./v2-flow-reveal";
import { V2CareerRoadmap } from "./experience/v2-career-roadmap";
import roadStyles from "./experience/v2-career-roadmap.module.css";
import styles from "./v2-rest-section.module.css";
import { V2Lab } from "./v2-lab";
import labStyles from "./v2-lab.module.css";

type V2RestSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
  staticLayout?: boolean;
};

type PanelShellProps = {
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  hideUnit: number;
  id: string;
  label: string;
  number: string;
  panelPosition: string;
  progress: MotionValue<number>;
  revealUnit: number;
  scrollUnits: number;
  staticLayout?: boolean;
};

function PanelShell({
  children,
  className = "",
  headerAction,
  hideUnit,
  id,
  label,
  number,
  panelPosition,
  progress,
  revealUnit,
  scrollUnits,
  staticLayout = false,
}: PanelShellProps) {
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
      id={id}
      inert={!staticLayout && !interactive}
      style={staticLayout ? undefined : { clipPath, pointerEvents: interactive ? "auto" : "none" }}
    >
      <div aria-hidden="true" className={styles.noise} />
      <header className={styles.header}>
        <h2 id={`${id}-heading`}><span>{number}</span> {label}</h2>
        {headerAction ?? <p>The rest <i>{panelPosition}</i></p>}
      </header>
      {children}
    </motion.section>
  );

  return staticLayout ? <V2FlowReveal>{panel}</V2FlowReveal> : panel;
}

export function V2RestSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
  staticLayout = false,
}: V2RestSectionProps) {
  const whatRevealUnit = getWhatIDoRevealUnit(projectCount);
  const experimentsRevealUnit = getExperimentsRevealUnit(projectCount);
  const experimentsSettleUnit = getExperimentsSettleUnit(projectCount);
  const experienceRevealUnit = getExperienceRevealUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const experimentsProgress = useTransform(
    progress,
    [at(experimentsRevealUnit), at(experimentsSettleUnit)],
    staticLayout ? [1, 1] : [0, 1],
  );

  return (
    <div
      aria-label="Capabilities, experiments, and experience"
      className={`${styles.sequence} ${reduceMotion ? styles.reducedMotion : ""} ${staticLayout ? styles.staticLayout : ""}`}
      id="v2-rest"
    >
      <PanelShell
        className={`${styles.whatPanel} ${capabilityStyles.panel}`}
        headerAction={<span />}
        id="v2-what-i-do"
        hideUnit={experimentsRevealUnit + 0.5}
        label="What I do"
        number="04"
        panelPosition="01 / 03"
        progress={progress}
        revealUnit={whatRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <V2Capabilities staticLayout={staticLayout} />
      </PanelShell>

      <PanelShell
        className={`${styles.experimentsPanel} ${labStyles.panel}`}
        headerAction={<span />}
        id="v2-experiments"
        hideUnit={experienceRevealUnit + 0.5}
        label="Lab"
        number="05"
        panelPosition="02 / 03"
        progress={progress}
        revealUnit={experimentsRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <V2Lab progress={experimentsProgress} reduceMotion={reduceMotion} staticLayout={staticLayout} />
      </PanelShell>

      <PanelShell
        className={`${styles.experiencePanel} ${roadStyles.panel}`}
        headerAction={<span />}
        id="v2-experience"
        hideUnit={getContactRevealUnit(projectCount) + 0.58}
        label="Experience"
        number="06"
        panelPosition="03 / 03"
        progress={progress}
        revealUnit={experienceRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <V2CareerRoadmap reduceMotion={reduceMotion} staticLayout={staticLayout} />
      </PanelShell>
    </div>
  );
}
