import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { Bot, CloudCog, Database, Globe2 } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  getExperienceRevealUnit,
  getContactRevealUnit,
  getExperimentsRevealUnit,
  getExperimentsSettleUnit,
  getWhatIDoRevealUnit,
  getWhatIDoSettleUnit,
} from "./v2-scroll-timeline";
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

const capabilities = [
  {
    title: "CRM & lead generation",
    copy: "Targeted lead sourcing, qualification, pipeline, communication, and reporting built around sales operations.",
    Icon: Database,
  },
  {
    title: "SaaS platforms",
    copy: "Scalable product foundations designed for dependable growth and maintainable releases.",
    Icon: CloudCog,
  },
  {
    title: "AI integrations",
    copy: "Practical AI features that automate repetitive work without removing human control.",
    Icon: Bot,
  },
  {
    title: "Web applications",
    copy: "Responsive interfaces connected to production-ready services, data, and deployment.",
    Icon: Globe2,
  },
] as const;

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
  const whatSettleUnit = getWhatIDoSettleUnit(projectCount);
  const experimentsRevealUnit = getExperimentsRevealUnit(projectCount);
  const experimentsSettleUnit = getExperimentsSettleUnit(projectCount);
  const experienceRevealUnit = getExperienceRevealUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const whatProgress = useTransform(progress, [at(whatRevealUnit), at(whatSettleUnit)], staticLayout ? [1, 1] : [0, 1]);
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
        className={styles.whatPanel}
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
        <div className={styles.whatLayout}>
          <ScrollAnimatedContent
            className={styles.whatIntro}
            distance={24}
            end={0.55}
            progress={whatProgress}
            start={0.08}
          >
            <p className={styles.kicker}>Capabilities</p>
            <h3>Systems made for <em>real work.</em></h3>
            <p className={styles.whatCopy}>
              I connect lead acquisition, interface, backend, data, and deployment around the
              workflow people actually need to complete.
            </p>
          </ScrollAnimatedContent>

          <div className={styles.capabilities}>
            {capabilities.map(({ Icon, copy, title }, index) => (
              <ScrollAnimatedContent
                className={styles.capabilityReveal}
                distance={18}
                end={0.58 + index * 0.11}
                key={title}
                progress={whatProgress}
                start={0.22 + index * 0.09}
              >
                <article className={styles.capability}>
                  <span>0{index + 1}</span>
                  <Icon aria-hidden="true" size={22} strokeWidth={1.15} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </ScrollAnimatedContent>
            ))}
          </div>
        </div>
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
