import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { experiences } from "@/lib/portfolio-data";
import {
  Bot,
  CloudCog,
  Database,
  Globe2,
  Plus,
} from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import {
  getContactRevealUnit,
  getRestRevealUnit,
  getRestSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-rest-section.module.css";

type V2RestSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

const capabilities = [
  {
    title: "CRM systems",
    copy: "Custom CRM solutions that streamline business operations.",
    Icon: Database,
  },
  {
    title: "SaaS platforms",
    copy: "Scalable products built for growth and dependable performance.",
    Icon: CloudCog,
  },
  {
    title: "AI integrations",
    copy: "Practical AI features that automate and improve real workflows.",
    Icon: Bot,
  },
  {
    title: "Web applications",
    copy: "Fast, modern interfaces backed by production-ready systems.",
    Icon: Globe2,
  },
] as const;

const experiments = [
  {
    title: "Interface motion",
    subtitle: "Scroll study",
    image: "/projects/roarly-dashboard.webp",
  },
  {
    title: "Data density",
    subtitle: "Dashboard study",
    image: "/projects/joynosync-dashboard.webp",
  },
  {
    title: "Editorial depth",
    subtitle: "3D browser study",
    image: "/projects/nxone-home.webp",
  },
  {
    title: "Visual pacing",
    subtitle: "Loading concept",
    image: "/projects/sharks-tail-home.webp",
  },
] as const;

export function V2RestSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2RestSectionProps) {
  const revealUnit = getRestRevealUnit(projectCount);
  const settleUnit = getRestSettleUnit(projectCount);
  const contactRevealUnit = getContactRevealUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const revealProgress = useTransform(progress, [at(revealUnit), at(settleUnit)], [0, 1]);
  const sectionOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.12),
      at(revealUnit + 0.16),
      at(contactRevealUnit - 0.08),
      at(contactRevealUnit + 0.58),
    ],
    [0, 1, 1, 0],
  );
  const sectionScale = useTransform(
    progress,
    [at(revealUnit - 0.1), at(settleUnit), at(contactRevealUnit + 0.55)],
    [1.018, 1, 0.975],
  );
  const sectionY = useTransform(
    progress,
    [at(contactRevealUnit - 0.08), at(contactRevealUnit + 0.58)],
    ["0vh", "-5vh"],
  );
  const pointerEvents = useTransform(
    progress,
    [at(revealUnit - 0.02), at(revealUnit)],
    ["none", "auto"],
  );

  return (
    <motion.section
      aria-label="Capabilities, experiments, and experience"
      className={`${styles.section} ${reduceMotion ? styles.reducedMotion : ""}`}
      id="v2-rest"
      style={{ opacity: sectionOpacity, pointerEvents, scale: sectionScale, y: sectionY }}
    >
      <div aria-hidden="true" className={styles.noise} />

      <ScrollAnimatedContent
        className={styles.introReveal}
        end={0.18}
        progress={revealProgress}
        start={0}
      >
        <header className={styles.header}>
          <p><span>04</span> The rest</p>
          <p>What I do <i /> Experiments <i /> Experience</p>
        </header>
      </ScrollAnimatedContent>

      <div className={styles.content}>
        <ScrollAnimatedContent
          className={styles.capabilitiesReveal}
          distance={18}
          end={0.47}
          progress={revealProgress}
          start={0.12}
        >
          <section aria-labelledby="v2-capabilities-heading" className={styles.block}>
            <div className={styles.blockHeading}>
              <span>04</span>
              <h2 id="v2-capabilities-heading">What I do</h2>
              <Plus aria-hidden="true" size={14} strokeWidth={1.4} />
            </div>
            <div className={styles.capabilities}>
              {capabilities.map(({ Icon, copy, title }) => (
                <article className={styles.capability} key={title}>
                  <Icon aria-hidden="true" size={18} strokeWidth={1.25} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </section>
        </ScrollAnimatedContent>

        <ScrollAnimatedContent
          className={styles.experimentsReveal}
          distance={22}
          end={0.75}
          progress={revealProgress}
          start={0.34}
        >
          <section aria-labelledby="v2-experiments-heading" className={styles.block}>
            <div className={styles.blockHeading}>
              <span>05</span>
              <h2 id="v2-experiments-heading">Experiments &amp; playground</h2>
              <Plus aria-hidden="true" size={14} strokeWidth={1.4} />
            </div>
            <div className={styles.experiments}>
              {experiments.map((experiment) => (
                <article className={styles.experiment} key={experiment.title}>
                  <Image
                    alt=""
                    fill
                    sizes="25vw"
                    src={experiment.image}
                  />
                  <div className={styles.experimentShade} />
                  <p>{experiment.title}<span>{experiment.subtitle}</span></p>
                </article>
              ))}
            </div>
          </section>
        </ScrollAnimatedContent>

        <ScrollAnimatedContent
          className={styles.experienceReveal}
          distance={24}
          end={1}
          progress={revealProgress}
          start={0.58}
        >
          <section aria-labelledby="v2-experience-heading" className={styles.block}>
            <div className={styles.blockHeading}>
              <span>06</span>
              <h2 id="v2-experience-heading">Experience</h2>
              <Plus aria-hidden="true" size={14} strokeWidth={1.4} />
            </div>
            <ol className={styles.experienceList}>
              {experiences.map((experience) => (
                <li key={`${experience.company}-${experience.role}`}>
                  <time dateTime={experience.dateTime}>{experience.period}</time>
                  <strong>{experience.role}</strong>
                  <span>{experience.company}</span>
                  <p>{experience.description}</p>
                </li>
              ))}
            </ol>
          </section>
        </ScrollAnimatedContent>
      </div>
    </motion.section>
  );
}
