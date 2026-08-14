import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { experiences } from "@/lib/portfolio-data";
import { Bot, CloudCog, Database, Globe2 } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  getExperienceRevealUnit,
  getExperienceSettleUnit,
  getExperimentsRevealUnit,
  getExperimentsSettleUnit,
  getWhatIDoRevealUnit,
  getWhatIDoSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-rest-section.module.css";

type V2RestSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

type PanelShellProps = {
  children: ReactNode;
  className?: string;
  id: string;
  label: string;
  number: string;
  panelPosition: string;
  progress: MotionValue<number>;
  revealUnit: number;
  scrollUnits: number;
};

const capabilities = [
  {
    title: "CRM systems",
    copy: "Customer, pipeline, communication, and reporting workflows built around daily operations.",
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
  { title: "Interface motion", subtitle: "Scroll study", image: "/projects/roarly-dashboard.webp" },
  { title: "Data density", subtitle: "Dashboard study", image: "/projects/joynosync-dashboard.webp" },
  { title: "Editorial depth", subtitle: "3D browser study", image: "/projects/nxone-home.webp" },
  { title: "Visual pacing", subtitle: "Loading concept", image: "/projects/sharks-tail-home.webp" },
] as const;

function PanelShell({
  children,
  className = "",
  id,
  label,
  number,
  panelPosition,
  progress,
  revealUnit,
  scrollUnits,
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

  return (
    <motion.section
      aria-labelledby={`${id}-heading`}
      className={`${styles.panel} ${className}`}
      id={id}
      style={{ clipPath, pointerEvents }}
    >
      <div aria-hidden="true" className={styles.noise} />
      <header className={styles.header}>
        <h2 id={`${id}-heading`}><span>{number}</span> {label}</h2>
        <p>The rest <i>{panelPosition}</i></p>
      </header>
      {children}
    </motion.section>
  );
}

export function V2RestSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2RestSectionProps) {
  const whatRevealUnit = getWhatIDoRevealUnit(projectCount);
  const whatSettleUnit = getWhatIDoSettleUnit(projectCount);
  const experimentsRevealUnit = getExperimentsRevealUnit(projectCount);
  const experimentsSettleUnit = getExperimentsSettleUnit(projectCount);
  const experienceRevealUnit = getExperienceRevealUnit(projectCount);
  const experienceSettleUnit = getExperienceSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const whatProgress = useTransform(progress, [at(whatRevealUnit), at(whatSettleUnit)], [0, 1]);
  const experimentsProgress = useTransform(
    progress,
    [at(experimentsRevealUnit), at(experimentsSettleUnit)],
    [0, 1],
  );
  const experienceProgress = useTransform(
    progress,
    [at(experienceRevealUnit), at(experienceSettleUnit)],
    [0, 1],
  );

  return (
    <div
      aria-label="Capabilities, experiments, and experience"
      className={`${styles.sequence} ${reduceMotion ? styles.reducedMotion : ""}`}
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
              I connect interface, backend, data, and deployment around the workflow people
              actually need to complete.
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
        id="v2-experiments"
        label="Experiments & playground"
        number="05"
        panelPosition="02 / 03"
        progress={progress}
        revealUnit={experimentsRevealUnit}
        scrollUnits={scrollUnits}
      >
        <div className={styles.experimentsIntro}>
          <ScrollAnimatedContent end={0.48} progress={experimentsProgress} start={0.06}>
            <p className={styles.kicker}>Playground</p>
            <h3>Small studies.<br />Useful discoveries.</h3>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent end={0.62} progress={experimentsProgress} start={0.22}>
            <p>Motion, depth, pacing, and information density explored outside client constraints.</p>
          </ScrollAnimatedContent>
        </div>

        <div className={styles.experiments}>
          {experiments.map((experiment, index) => (
            <ScrollAnimatedContent
              className={styles.experimentReveal}
              distance={30}
              end={0.66 + index * 0.08}
              key={experiment.title}
              progress={experimentsProgress}
              start={0.25 + index * 0.08}
            >
              <article className={styles.experiment}>
                <Image alt="" fill sizes="25vw" src={experiment.image} />
                <div aria-hidden="true" className={styles.experimentShade} />
                <span>0{index + 1}</span>
                <p>{experiment.title}<small>{experiment.subtitle}</small></p>
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
            {experiences.map((experience, index) => (
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
