"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { V2HomeNav } from "./nav/v2-home-nav";
import { type V2SectionKey, V2_NAVIGATE_EVENT } from "./nav/v2-section-link";
import { V2FollowingSections } from "./v2-following-sections";
import { usePostGlimpseScroll } from "./scroll/use-post-glimpse-scroll";
import { V2Hero, type V2HeroDestination } from "./v2-hero";
import { V2ProjectClosing } from "./v2-project-closing";
import { V2ProjectOrbit } from "./v2-project-orbit";
import {
  getProjectScrollUnits,
  getProjectSettleUnit,
  PROJECT_INTERVAL_UNITS,
  STAGE_SETTLE_UNITS,
} from "./v2-scroll-timeline";
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
  useMotionValueEvent(progress, "change", (value) => setHeroActive(value < at(STAGE_SETTLE_UNITS - 0.1)));

  // The work panel rises from the first scroll and lands at STAGE_SETTLE_UNITS (about one screen).
  const heroScale = useTransform(progress, [0, at(0.5), at(STAGE_SETTLE_UNITS)], [1, 0.985, 0.96]);
  const heroY = useTransform(progress, [0, at(0.5), at(STAGE_SETTLE_UNITS)], ["0vh", "-0.8vh", "-3.2vh"]);
  const heroOpacity = useTransform(progress, [at(0.4), at(0.9), at(STAGE_SETTLE_UNITS)], [1, 0.64, 0]);
  const heroRadius = useTransform(progress, [0, at(0.8)], ["0px", "18px"]);

  const projectY = useTransform(
    progress,
    [0, at(0.75), at(STAGE_SETTLE_UNITS)],
    ["100vh", "10vh", "0vh"],
  );
  const projectScale = useTransform(progress, [0, at(0.75), at(STAGE_SETTLE_UNITS)], [0.9, 0.95, 1]);
  // The panel keeps its rounded frame once settled; see .projectEntryLayer. It stays opaque
  // while rising, so it never shows the hero through it.
  const projectShadow = useTransform(
    progress,
    [at(0.5), at(STAGE_SETTLE_UNITS)],
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
        boxShadow: projectShadow,
      };

  // Gentle snap: once scrolling pauses inside the project run, settle on the nearest project.
  useEffect(() => {
    if (reduceMotion) return;
    let timer: number | undefined;
    const settle = () => {
      const track = trackRef.current;
      if (!track) return;
      const start = track.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(0, track.offsetHeight - window.innerHeight);
      if (!distance) return;
      const unit = ((window.scrollY - start) / distance) * scrollUnits;
      const first = getProjectSettleUnit(0);
      const last = getProjectSettleUnit(projectCount - 1);
      if (unit < first - PROJECT_INTERVAL_UNITS * 0.5 || unit > last + PROJECT_INTERVAL_UNITS * 0.35) return;
      const index = Math.max(0, Math.min(projectCount - 1, Math.round((unit - first) / PROJECT_INTERVAL_UNITS)));
      const target = getProjectSettleUnit(index);
      if (Math.abs(target - unit) < 0.02) return;
      window.scrollTo({ top: start + (distance * target) / scrollUnits, behavior: "smooth" });
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);
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

  // The floating nav and footer links ask to jump to a section; land inside the pinned
  // sequences the same way the hero links do.
  const navigateRef = useRef<(key: V2SectionKey) => void>(() => {});
  navigateRef.current = (key) => {
    if (key === "top") scrollTo(0);
    else if (key === "work") navigateToProject(0);
    else navigateFromHero(key === "services" ? "capabilities" : key);
  };
  useEffect(() => {
    const onNavigate = (event: Event) => {
      event.preventDefault();
      navigateRef.current((event as CustomEvent<V2SectionKey>).detail);
    };
    window.addEventListener(V2_NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(V2_NAVIGATE_EVENT, onNavigate);
  }, []);

  return (
    <>
      <V2HomeNav />
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
