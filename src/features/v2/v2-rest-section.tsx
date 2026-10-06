import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import Cubes from "@/components/Cubes";
import DotGrid from "@/components/DotGrid";
import GlitchText from "@/components/GlitchText";
import { ArrowUpRight, Bot, CloudCog, Database, Globe2 } from "lucide-react";
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
import visualStyles from "./v2-experiment-visuals.module.css";

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

const experiments = [
  { kind: "trail", title: "Cursor trail", subtitle: "Interaction experiment" },
  { kind: "glitch", title: "Glitch transition", subtitle: "Motion study" },
  { kind: "cubes", title: "3D scroll", subtitle: "Depth exploration" },
  { kind: "loading", title: "Loading animation", subtitle: "Interface concept" },
] as const;

type ExperimentKind = (typeof experiments)[number]["kind"];

function ExperimentVisual({ kind, reduceMotion }: { kind: ExperimentKind; reduceMotion: boolean }) {
  if (kind === "trail") {
    return (
      <>
        {!reduceMotion && <DotGrid
          activeColor="#72d7ff"
          baseColor="#183845"
          className={visualStyles.cursorGrid}
          dotSize={3}
          gap={13}
          maxSpeed={reduceMotion ? 0 : 3600}
          proximity={120}
          returnDuration={1.2}
          shockRadius={reduceMotion ? 0 : 130}
          shockStrength={4}
          speedTrigger={75}
        />}
        <span className={visualStyles.trailReticle}><i /></span>
        <span className={visualStyles.visualReadout}><b>Vector field</b><b>Live / 60</b></span>
      </>
    );
  }

  if (kind === "glitch") {
    return (
      <>
        <span className={visualStyles.glitchEcho}>Shift</span>
        {reduceMotion ? (
          <span className={visualStyles.staticGlitch}>Shift</span>
        ) : (
          <GlitchText className={visualStyles.glitchText} enableShadows speed={0.34}>
            Shift
          </GlitchText>
        )}
        <span className={visualStyles.glitchScan} />
        <span className={visualStyles.visualReadout}><b>Signal offset</b><b>RGB / 03</b></span>
      </>
    );
  }

  if (kind === "cubes") {
    return (
      <>
        <span className={visualStyles.cubeHalo}><i /></span>
        {!reduceMotion && <Cubes
          autoAnimate={!reduceMotion}
          borderStyle="1px solid rgba(213, 224, 255, 0.46)"
          faceColor="#0b0e16"
          gridSize={6}
          maxAngle={56}
          radius={3.1}
          rippleColor="#a9bfff"
          rippleOnClick={!reduceMotion}
          shadow="0 10px 22px rgba(0, 0, 0, 0.52)"
        />}
        <span className={visualStyles.visualReadout}><b>Depth mesh</b><b>XYZ / 06</b></span>
      </>
    );
  }

  return (
    <>
      <span className={`${visualStyles.orbitalLoader} ${reduceMotion ? visualStyles.staticVisual : ""}`}>
        <i /><i /><i /><b />
      </span>
      <span className={visualStyles.visualReadout}><b>Phase cycle</b><b>74.8%</b></span>
    </>
  );
}

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
        className={styles.experimentsPanel}
        headerAction={(
          <a
            className={styles.headerAction}
            href="https://reactbits.dev/pro/components"
            rel="noreferrer"
            target="_blank"
          >
            Explore React Bits <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.5} />
          </a>
        )}
        id="v2-experiments"
        label="Experiments & playground"
        number="05"
        panelPosition="02 / 03"
        progress={progress}
        revealUnit={experimentsRevealUnit}
        scrollUnits={scrollUnits}
        staticLayout={staticLayout}
      >
        <div className={styles.experiments}>
          {experiments.map((experiment, index) => (
            <ScrollAnimatedContent
              className={styles.experimentReveal}
              distance={30}
              end={0.66 + index * 0.08}
              key={experiment.title}
              progress={experimentsProgress}
              start={0.12 + index * 0.08}
            >
              <article className={styles.experiment} data-kind={experiment.kind}>
                <span>0{index + 1}</span>
                <div aria-hidden="true" className={styles.experimentVisual}>
                  <ExperimentVisual kind={experiment.kind} reduceMotion={reduceMotion || staticLayout} />
                </div>
                <div className={styles.experimentMeta}>
                  <h3>{experiment.title}</h3>
                  <p>{experiment.subtitle}</p>
                </div>
              </article>
            </ScrollAnimatedContent>
          ))}
        </div>
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
