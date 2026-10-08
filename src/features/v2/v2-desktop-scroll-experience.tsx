"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { type CSSProperties, useRef, useState } from "react";
import { V2FollowingSections } from "./v2-following-sections";
import { usePostGlimpseScroll } from "./scroll/use-post-glimpse-scroll";
import { V2Hero, type V2HeroDestination } from "./v2-hero";
import { V2ProjectClosing } from "./v2-project-closing";
import { V2ProjectOrbit } from "./v2-project-orbit";
import { getProjectScrollUnits, getProjectSettleUnit } from "./v2-scroll-timeline";
import { V2ProjectStage } from "./v2-project-stage";
import { projectShowcases } from "./v2-project-showcases";
import styles from "./v2-scroll-experience.module.css";

const projectCount = projectShowcases.length;
const scrollUnits = getProjectScrollUnits(projectCount);

export function V2DesktopScrollExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTo = usePostGlimpseScroll(trackRef);
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
  const [heroActive, setHeroActive] = useState(true);
  useMotionValueEvent(progress, "change", (value) => setHeroActive(value < at(1.7)));

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

  function navigateToProject(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= projectCount) return;
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, track.offsetHeight - window.innerHeight);
    // Land inside the settled hold, allowing for pixel rounding and the scroll spring.
    scrollTo(start + distance * (getProjectSettleUnit(index) + 0.08) / scrollUnits);
  }

  function navigateFromHero(destination: V2HeroDestination) {
    if (destination !== "work") {
      const sectionIds = { capabilities: "v2-what-i-do", about: "v2-about", contact: "v2-contact" };
      const section = document.getElementById(sectionIds[destination]);
      if (section) scrollTo(section);
      return;
    }
    navigateToProject(0);
  }

  return (
    <>
      <div
        className={`${styles.track} ${reduceMotion ? styles.reducedMotion : ""}`}
        ref={trackRef}
        style={trackStyle}
      >
        <div className={styles.stickyViewport}>
          <motion.div className={styles.heroLayer} inert={!heroActive} style={animatedHeroStyle}>
            <V2Hero active={heroActive} onNavigate={navigateFromHero} />
          </motion.div>

          <motion.div className={styles.projectEntryLayer} style={animatedProjectStyle}>
            <V2ProjectStage
              onSelectProject={navigateToProject}
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
          </motion.div>
        </div>
      </div>
      <V2FollowingSections onNavigate={scrollTo} />
    </>
  );
}
