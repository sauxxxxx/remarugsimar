"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { V2Hero } from "./v2-hero";
import { V2JoynoSyncShowcase } from "./v2-joynosync-showcase";
import { V2ProjectShowcase } from "./v2-project-showcase";
import { V2ProjectStage } from "./v2-project-stage";
import styles from "./v2-scroll-experience.module.css";

export function V2ScrollExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
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

  const heroScale = useTransform(progress, [0, 0.14, 0.38], [1, 0.985, 0.96]);
  const heroY = useTransform(progress, [0, 0.14, 0.38], ["0vh", "-0.8vh", "-3.2vh"]);
  const heroOpacity = useTransform(progress, [0.12, 0.34, 0.44], [1, 0.64, 0]);
  const heroRadius = useTransform(progress, [0, 0.24], ["0px", "18px"]);

  const projectY = useTransform(
    progress,
    [0, 0.1, 0.3, 0.48],
    ["112vh", "112vh", "15vh", "0vh"],
  );
  const projectScale = useTransform(progress, [0.1, 0.3, 0.48], [0.86, 0.9, 1]);
  const projectOpacity = useTransform(progress, [0.08, 0.18, 0.3], [0, 0.35, 1]);
  const projectRadius = useTransform(progress, [0.24, 0.48], ["18px", "0px"]);
  const projectShadow = useTransform(
    progress,
    [0.2, 0.48],
    ["0 28px 90px rgba(0,0,0,.34)", "0 0 0 rgba(0,0,0,0)"],
  );

  const orbitPoints = [0.62, 0.68, 0.75, 0.82];

  const projectOneCopyX = useTransform(progress, orbitPoints, ["0vw", "-5vw", "-17vw", "-31vw"]);
  const projectOneCopyY = useTransform(progress, orbitPoints, ["0vh", "-4vh", "-16vh", "-34vh"]);
  const projectOneCopyScale = useTransform(progress, orbitPoints, [1, 0.94, 0.75, 0.5]);
  const projectOneCopyRotate = useTransform(progress, orbitPoints, ["0deg", "-2deg", "-7deg", "-14deg"]);
  const projectOneCopyOpacity = useTransform(progress, [0.62, 0.7, 0.8], [1, 0.72, 0]);

  const projectOneVisualX = useTransform(progress, orbitPoints, ["0vw", "-4vw", "-15vw", "-29vw"]);
  const projectOneVisualY = useTransform(progress, orbitPoints, ["0vh", "-5vh", "-20vh", "-41vh"]);
  const projectOneVisualScale = useTransform(progress, orbitPoints, [1, 0.92, 0.7, 0.44]);
  const projectOneVisualRotateZ = useTransform(progress, orbitPoints, ["0deg", "-2deg", "-8deg", "-16deg"]);
  const projectOneVisualRotateY = useTransform(progress, orbitPoints, ["0deg", "4deg", "11deg", "19deg"]);
  const projectOneVisualOpacity = useTransform(progress, [0.64, 0.72, 0.81], [1, 0.68, 0]);

  const projectTwoCopyX = useTransform(progress, orbitPoints, ["88vw", "61vw", "24vw", "0vw"]);
  const projectTwoCopyY = useTransform(progress, orbitPoints, ["72vh", "48vh", "15vh", "0vh"]);
  const projectTwoCopyScale = useTransform(progress, orbitPoints, [0.52, 0.68, 0.9, 1]);
  const projectTwoCopyRotate = useTransform(progress, orbitPoints, ["12deg", "8deg", "3deg", "0deg"]);
  const projectTwoCopyOpacity = useTransform(progress, [0.63, 0.69, 0.77, 0.82], [0, 0.35, 0.86, 1]);

  const projectTwoVisualX = useTransform(progress, orbitPoints, ["58vw", "38vw", "14vw", "0vw"]);
  const projectTwoVisualY = useTransform(progress, orbitPoints, ["78vh", "48vh", "14vh", "0vh"]);
  const projectTwoVisualScale = useTransform(progress, orbitPoints, [0.48, 0.64, 0.86, 1]);
  const projectTwoVisualRotateZ = useTransform(progress, orbitPoints, ["13deg", "9deg", "3deg", "0deg"]);
  const projectTwoVisualRotateY = useTransform(progress, orbitPoints, ["-22deg", "-16deg", "-6deg", "0deg"]);
  const projectTwoVisualOpacity = useTransform(progress, [0.63, 0.69, 0.77, 0.82], [0, 0.4, 0.88, 1]);
  const railOneColor = useTransform(
    progress,
    [0.68, 0.76],
    ["#b5df08", "rgba(245,245,239,.62)"],
  );
  const railTwoColor = useTransform(
    progress,
    [0.68, 0.76],
    ["rgba(245,245,239,.62)", "#b5df08"],
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
  const projectOneCopyStyle = reduceMotion
    ? undefined
    : {
        x: projectOneCopyX,
        y: projectOneCopyY,
        scale: projectOneCopyScale,
        rotate: projectOneCopyRotate,
        opacity: projectOneCopyOpacity,
      };
  const projectOneVisualStyle = reduceMotion
    ? undefined
    : {
        x: projectOneVisualX,
        y: projectOneVisualY,
        scale: projectOneVisualScale,
        rotateZ: projectOneVisualRotateZ,
        rotateY: projectOneVisualRotateY,
        opacity: projectOneVisualOpacity,
      };
  const projectTwoCopyStyle = reduceMotion
    ? { display: "none" }
    : {
        x: projectTwoCopyX,
        y: projectTwoCopyY,
        scale: projectTwoCopyScale,
        rotate: projectTwoCopyRotate,
        opacity: projectTwoCopyOpacity,
      };
  const projectTwoVisualStyle = reduceMotion
    ? { display: "none" }
    : {
        x: projectTwoVisualX,
        y: projectTwoVisualY,
        scale: projectTwoVisualScale,
        rotateZ: projectTwoVisualRotateZ,
        rotateY: projectTwoVisualRotateY,
        opacity: projectTwoVisualOpacity,
      };
  const railOneStyle = reduceMotion ? undefined : { color: railOneColor };
  const railTwoStyle = reduceMotion ? undefined : { color: railTwoColor };

  return (
    <div
      className={`${styles.track} ${reduceMotion ? styles.reducedMotion : ""}`}
      ref={trackRef}
    >
      <div className={styles.stickyViewport}>
        <motion.div className={styles.heroLayer} style={animatedHeroStyle}>
          <V2Hero />
        </motion.div>

        <motion.div className={styles.projectEntryLayer} style={animatedProjectStyle}>
          <V2ProjectStage railOneStyle={railOneStyle} railTwoStyle={railTwoStyle}>
            <V2ProjectShowcase copyStyle={projectOneCopyStyle} visualStyle={projectOneVisualStyle} />
            <V2JoynoSyncShowcase copyStyle={projectTwoCopyStyle} visualStyle={projectTwoVisualStyle} />
          </V2ProjectStage>
        </motion.div>
      </div>
    </div>
  );
}
