"use client";

import { profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSectionEntrance } from "./scroll/use-section-entrance";
import {
  getAboutRevealUnit,
  getAboutSettleUnit,
  getExperienceRevealUnit,
  getExperienceSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-about-section.module.css";

type V2AboutSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
  staticLayout?: boolean;
};

const resume = profileLinks.find((link) => link.label === "resume")!;
const github = profileLinks.find((link) => link.label === "github")!;

export function V2AboutSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
  staticLayout = false,
}: V2AboutSectionProps) {
  const entranceRef = useSectionEntrance<HTMLElement>(staticLayout);
  const revealUnit = getAboutRevealUnit(projectCount);
  const settleUnit = getAboutSettleUnit(projectCount);
  const nextRevealUnit = getExperienceRevealUnit(projectCount);
  const nextSettleUnit = getExperienceSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const quiet = reduceMotion || staticLayout;
  const isInteractive = (value: number) =>
    value >= at(revealUnit) && value < at(nextRevealUnit + 0.5);
  const [interactive, setInteractive] = useState(() => isInteractive(progress.get()));
  useMotionValueEvent(progress, "change", (value) => setInteractive(isInteractive(value)));

  const sectionOpacity = useTransform(
    progress,
    [at(revealUnit - 0.12), at(revealUnit + 0.08), at(nextRevealUnit - 0.1), at(nextSettleUnit - 0.55)],
    [0, 1, 1, 0],
  );
  const sectionY = useTransform(
    progress,
    [at(nextRevealUnit - 0.1), at(nextSettleUnit - 0.45)],
    ["0vh", "-8vh"],
  );
  const revealProgress = useTransform(progress, [at(revealUnit), at(settleUnit)], [0, 1]);
  const portraitOpacity = useTransform(revealProgress, [0.04, 0.7], [0, 1]);
  const portraitY = useTransform(revealProgress, [0.04, 0.9], [20, 0]);
  const copyOpacity = useTransform(revealProgress, [0.14, 0.78], [0, 1]);
  const copyY = useTransform(revealProgress, [0.14, 0.95], [14, 0]);
  const pointerEvents = staticLayout || interactive ? "auto" : "none";

  return (
    <motion.section
      aria-labelledby="v2-about-heading"
      className={`${styles.section} ${staticLayout ? styles.staticLayout : ""}`}
      data-v2-reveal-root
      ref={entranceRef}
      id="v2-about"
      inert={!staticLayout && !interactive}
      style={staticLayout ? undefined : { opacity: sectionOpacity, pointerEvents, y: sectionY }}
    >
      <header className={styles.header} data-v2-reveal="heading">
        <h2 id="v2-about-heading"><span>04</span> About</h2>
      </header>

      <div className={styles.layout}>
        <motion.figure
          className={styles.portraitFrame}
          data-v2-reveal="visual"
          style={quiet ? undefined : { opacity: portraitOpacity, y: portraitY }}
        >
          <Image
            alt="Remar Ugsimar"
            className={styles.portrait}
            fill
            sizes="(max-width: 760px) 360px, (max-width: 1024px) 40vw, 430px"
            src="/v2/remar-editorial-portrait.webp"
          />
        </motion.figure>

        <motion.div className={styles.copy} data-v2-reveal="copy" style={quiet ? undefined : { opacity: copyOpacity, y: copyY }}>
          <h3>I&apos;m Remar.</h3>
          <p className={styles.role}>Full-stack developer · Cebu, Philippines.</p>
          <div className={styles.bodyCopy}>
            <p>
              I build software around the way people actually work. My projects span CRM and
              lead discovery, accounting, AI tools, and business websites.
            </p>
            <p>
              I start by understanding what takes time or gets lost in a manual process, then
              connect the interface, backend, and data into a practical solution.
            </p>
          </div>

          <nav aria-label="About links" className={styles.links} style={{ pointerEvents }}>
            <Link className={styles.resume} href={resume.href} prefetch={false} rel="noreferrer" target="_blank">
              View résumé <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <a href={github.href} rel="noreferrer" target="_blank">
              <Github aria-hidden="true" size={17} /> GitHub <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={`mailto:${siteConfig.email}`}>
              <Mail aria-hidden="true" size={17} /> Email
            </a>
          </nav>
        </motion.div>
      </div>
    </motion.section>
  );
}
