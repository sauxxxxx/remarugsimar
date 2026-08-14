"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { type CSSProperties, useRef } from "react";
import { V2AboutSection } from "./v2-about-section";
import { V2ContactSection } from "./v2-contact-section";
import { V2Hero } from "./v2-hero";
import { V2JoynoSyncShowcase } from "./v2-joynosync-showcase";
import { V2NxOneShowcase } from "./v2-nxone-showcase";
import { V2ProjectClosing } from "./v2-project-closing";
import { V2ProjectOrbit } from "./v2-project-orbit";
import { V2RestSection } from "./v2-rest-section";
import { getProjectScrollUnits } from "./v2-scroll-timeline";
import { V2ProjectShowcase } from "./v2-project-showcase";
import { V2ProjectStage } from "./v2-project-stage";
import {
  V2JoynoIncShowcase,
  V2RoarlyWebsiteShowcase,
  V2SharksTailShowcase,
} from "./v2-web-project-showcases";
import styles from "./v2-scroll-experience.module.css";

const projectShowcases = [
  V2ProjectShowcase,
  V2JoynoSyncShowcase,
  V2NxOneShowcase,
  V2SharksTailShowcase,
  V2RoarlyWebsiteShowcase,
  V2JoynoIncShowcase,
];
const projectCount = projectShowcases.length;
const scrollUnits = getProjectScrollUnits(projectCount);

export function V2ScrollExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 28,
    mass: 0.34,
    restDelta: 0.0005,
  });
  const at = (scrollUnit: number) => scrollUnit / scrollUnits;

  const heroScale = useTransform(progress, [0, at(0.7), at(1.9)], [1, 0.985, 0.96]);
  const heroY = useTransform(progress, [0, at(0.7), at(1.9)], ["0vh", "-0.8vh", "-3.2vh"]);
  const heroOpacity = useTransform(progress, [at(0.6), at(1.7), at(2.2)], [1, 0.64, 0]);
  const heroRadius = useTransform(progress, [0, at(1.2)], ["0px", "18px"]);

  const projectY = useTransform(
    progress,
    [0, at(0.5), at(1.5), at(2.4)],
    ["112vh", "112vh", "15vh", "0vh"],
  );
  const projectScale = useTransform(progress, [at(0.5), at(1.5), at(2.4)], [0.86, 0.9, 1]);
  const projectOpacity = useTransform(progress, [at(0.4), at(0.9), at(1.5)], [0, 0.35, 1]);
  const projectRadius = useTransform(progress, [at(1.2), at(2.4)], ["18px", "0px"]);
  const projectShadow = useTransform(
    progress,
    [at(1), at(2.4)],
    ["0 28px 90px rgba(0,0,0,.34)", "0 0 0 rgba(0,0,0,0)"],
  );

  const animatedHeroStyle = reduceMotion
    ? undefined
    : { scale: heroScale, y: heroY, opacity: heroOpacity, borderRadius: heroRadius };
  const animatedProjectStyle = reduceMotion
    ? undefined
    : {
        scale: projectScale,
        y: projectY,
        opacity: projectOpacity,
        borderRadius: projectRadius,
        boxShadow: projectShadow,
      };
  const trackStyle = { "--v2-scroll-units": scrollUnits } as CSSProperties;

  return (
    <div
      className={`${styles.track} ${reduceMotion ? styles.reducedMotion : ""}`}
      ref={trackRef}
      style={trackStyle}
    >
      <div className={styles.stickyViewport}>
        <motion.div className={styles.heroLayer} style={animatedHeroStyle}>
          <V2Hero />
        </motion.div>

        <motion.div className={styles.projectEntryLayer} style={animatedProjectStyle}>
          <V2ProjectStage
            progress={progress}
            projectCount={projectCount}
            scrollUnits={scrollUnits}
          >
            <V2ProjectOrbit
              progress={progress}
              projectCount={projectCount}
              reduceMotion={reduceMotion}
              scrollUnits={scrollUnits}
              showcases={projectShowcases}
            />
          </V2ProjectStage>
          <V2ProjectClosing
            progress={progress}
            projectCount={projectCount}
            reduceMotion={reduceMotion}
            scrollUnits={scrollUnits}
          />
          <V2AboutSection
            progress={progress}
            projectCount={projectCount}
            reduceMotion={reduceMotion}
            scrollUnits={scrollUnits}
          />
          <V2RestSection
            progress={progress}
            projectCount={projectCount}
            reduceMotion={reduceMotion}
            scrollUnits={scrollUnits}
          />
          <V2ContactSection
            progress={progress}
            projectCount={projectCount}
            reduceMotion={reduceMotion}
            scrollUnits={scrollUnits}
          />
        </motion.div>
      </div>
    </div>
  );
}
