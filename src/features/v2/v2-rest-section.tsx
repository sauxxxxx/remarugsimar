import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { Bot, CloudCog, Database, Globe2 } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";
import {
  getExperienceRevealUnit,
  getExperienceSettleUnit,
  getExperimentsRevealUnit,
  getExperimentsSettleUnit,
  getWhatIDoRevealUnit,
  getWhatIDoSettleUnit,
} from "./v2-scroll-timeline";
import { V2FlowReveal } from "./v2-flow-reveal";
import { v2Experiences } from "./v2-experience-data";
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
  const pointerEvents = useTransform(
    progress,
    [at(revealUnit - 0.02), at(revealUnit)],
    ["none", "auto"],
  );

  const panel = (
    <motion.section
      aria-labelledby={`${id}-heading`}
      className={`${styles.panel} ${className}`}
      id={id}
      style={staticLayout ? undefined : { clipPath, pointerEvents }}
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
  const experienceSettleUnit = getExperienceSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const whatProgress = useTransform(progress, [at(whatRevealUnit), at(whatSettleUnit)], staticLayout ? [1, 1] : [0, 1]);
  const experimentsProgress = useTransform(
    progress,
    [at(experimentsRevealUnit), at(experimentsSettleUnit)],
    staticLayout ? [1, 1] : [0, 1],
  );
  const experienceProgress = useTransform(
    progress,
    [at(experienceRevealUnit), at(experienceSettleUnit)],
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
        className={styles.experiencePanel}
        id="v2-experience"
        label="Experience"
        number="06"
        panelPosition="03 / 03"
        progress={progress}
        revealUnit={experienceRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <div className={styles.experienceLayout}>
          <ScrollAnimatedContent
            className={styles.experienceIntro}
            distance={22}
            end={0.48}
            progress={experienceProgress}
            start={0.06}
          >
            <p className={styles.kicker}>Selected timeline</p>
            <h3>Building across product, platform, and web.</h3>
          </ScrollAnimatedContent>

          <ol className={styles.experienceList}>
            {v2Experiences.map((experience, index) => (
              <ScrollAnimatedContent
                className={styles.experienceReveal}
                distance={20}
                end={0.62 + index * 0.13}
                key={`${experience.company}-${experience.role}`}
                progress={experienceProgress}
                start={0.2 + index * 0.11}
              >
                <li>
                  <span className={styles.experienceIndex}>0{index + 1}</span>
                  <time dateTime={experience.dateTime}>{experience.period}</time>
                  <div>
                    <strong>{experience.role}</strong>
                    <span>{experience.company}</span>
                  </div>
                  <p>{experience.description}</p>
                </li>
              </ScrollAnimatedContent>
            ))}
          </ol>
        </div>
      </PanelShell>
    </div>
  );
}
