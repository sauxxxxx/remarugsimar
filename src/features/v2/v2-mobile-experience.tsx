"use client";

import { ArrowRight } from "lucide-react";
import { type MotionStyle, useMotionValue } from "motion/react";
import Link from "next/link";
import { V2AboutSection } from "./v2-about-section";
import { V2ContactSection } from "./v2-contact-section";
import { V2FlowReveal } from "./v2-flow-reveal";
import { V2Hero } from "./v2-hero";
import { projectShowcases } from "./v2-project-showcases";
import { V2RestSection } from "./v2-rest-section";
import styles from "./v2-mobile-experience.module.css";

const copyStyle: MotionStyle = {
  position: "relative", top: "auto", left: "auto", width: "100%",
  willChange: "auto", transformStyle: "flat",
};
const visualStyle: MotionStyle = {
  position: "relative", top: "auto", left: "auto", width: "100%",
  translate: "none", filter: "none", transformStyle: "flat",
  willChange: "auto",
};

export function V2MobileExperience() {
  // Settled content stays visible; mobile never subscribes to the scroll timeline.
  const progress = useMotionValue(1);
  const sectionProps = {
    progress, projectCount: projectShowcases.length, scrollUnits: 1,
    reduceMotion: false, staticLayout: true,
  };

  return (
    <div className={styles.page}>
      <V2Hero />
      <section aria-labelledby="v2-projects-heading" className={styles.projects} id="v2-projects">
        <header className={styles.header}>
          <h2 id="v2-projects-heading"><span>02</span> Selected work</h2>
          <Link href="/v2/projects">View all projects <ArrowRight aria-hidden="true" size={16} /></Link>
        </header>
        {projectShowcases.map((Showcase, index) => (
          <V2FlowReveal className={styles.project} key={index}>
            <Showcase copyRevealProgress={progress} copyStyle={copyStyle} visualStyle={visualStyle} />
          </V2FlowReveal>
        ))}
      </section>
      <V2FlowReveal><V2AboutSection {...sectionProps} /></V2FlowReveal>
      <V2RestSection {...sectionProps} />
      <V2FlowReveal><V2ContactSection {...sectionProps} /></V2FlowReveal>
    </div>
  );
}
