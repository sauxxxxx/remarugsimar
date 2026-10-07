"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { v2CareerStops } from "../v2-experience-data";
import { v2Projects } from "../projects/v2-project-data";
import { V2CareerPin, V2CareerRoad } from "./v2-career-road";
import { V2CareerCarousel } from "./v2-career-carousel";
import { V2CareerTools } from "./v2-career-tools";
import styles from "./v2-career-roadmap.module.css";

type RoadmapProps = {
  reduceMotion: boolean;
  staticLayout: boolean;
};

export function V2CareerRoadmap({ reduceMotion, staticLayout }: RoadmapProps) {
  const [selectedId, setSelectedId] = useState<(typeof v2CareerStops)[number]["id"]>("developer");
  const prefersReducedMotion = useReducedMotion();
  const quiet = Boolean(reduceMotion || prefersReducedMotion);
  const selected = v2CareerStops.find((stop) => stop.id === selectedId)!;
  const projects = selected.projects.flatMap((slug) => {
    const project = v2Projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });

  return (
    <div className={`${styles.roadmap} ${staticLayout ? styles.flow : ""} ${quiet ? styles.quiet : ""}`}>
      <div className={styles.intro}>
        <h3>The road so far.</h3>
        <p>Choose a stop to explore.</p>
      </div>
      <div className={styles.road}>
        <V2CareerRoad />
        <ol className={styles.stops} aria-label="Career milestones">
          {v2CareerStops.map((stop, index) => (
            <li key={stop.id} className={`${styles.stop} ${styles[stop.id]}`} style={{ "--stop-color": stop.color } as CSSProperties}>
              <button
                type="button"
                className={styles.stopButton}
                aria-pressed={stop.id === selectedId}
                aria-controls="v2-career-details"
                aria-label={`${stop.role}, ${stop.company}, ${stop.period}`}
                onClick={() => setSelectedId(stop.id)}
              >
                <V2CareerPin />
                <span className={styles.stopLabel}>
                  <span className={styles.stopNumber}>0{index + 1}</span>
                  <strong>{stop.label}</strong>
                  <span>{stop.company}</span>
                  <time dateTime={stop.dateTime}>{stop.period}</time>
                  {stop.id === "developer" && <span className={styles.current}>Current</span>}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.branchLabel}>Freelance continues <span aria-hidden="true">↗</span></p>
      </div>
      <div id="v2-career-details" className={styles.details} role="region" aria-labelledby="v2-career-role" style={{ "--stop-color": selected.color } as CSSProperties}>
        <motion.div key={`role-${selectedId}`} className={styles.roleDetails} aria-live="polite" aria-atomic="true" initial={quiet ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: quiet ? 0 : 0.18 }}>
          <p className={styles.eyebrow}>Selected stop</p>
          <h4 id="v2-career-role">{selected.role}</h4>
          <p className={styles.company}>{selected.company} · {selected.period}</p>
          <p className={styles.description}>{selected.summary}</p>
        </motion.div>
        {projects.length > 0 && <V2CareerCarousel key={`projects-${selected.id}`} projects={projects} reduceMotion={quiet} />}
        <V2CareerTools technologies={selected.coreTools} />
      </div>
    </div>
  );
}
