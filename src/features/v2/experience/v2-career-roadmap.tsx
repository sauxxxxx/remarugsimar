"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { v2CareerStops } from "../v2-experience-data";
import { v2Projects, v2ProjectHref } from "../projects/v2-project-data";
import { V2CareerPin, V2CareerRoad } from "./v2-career-road";
import styles from "./v2-career-roadmap.module.css";

type RoadmapProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  staticLayout: boolean;
};

export function V2CareerRoadmap({ progress, reduceMotion, staticLayout }: RoadmapProps) {
  const [selectedId, setSelectedId] = useState("developer");
  const [revealed, setRevealed] = useState(() => progress.get() >= 0.9);
  const prefersReducedMotion = useReducedMotion();
  const quiet = reduceMotion || prefersReducedMotion;
  useMotionValueEvent(progress, "change", (value) => setRevealed(value >= 0.9));
  const selected = v2CareerStops.find((stop) => stop.id === selectedId)!;
  const projects = selected.projects.flatMap((slug) => {
    const project = v2Projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });

  return (
    <div className={`${styles.roadmap} ${staticLayout ? styles.flow : ""} ${quiet ? styles.quiet : ""}`} inert={!staticLayout && !revealed}>
      <div className={styles.intro}>
        <h3>The road so far.</h3>
        <p>Choose a stop. Explore the work behind it.</p>
      </div>
      <div className={styles.road}>
        <V2CareerRoad />
        <ol className={styles.stops} aria-label="Career milestones">
          {v2CareerStops.map((stop) => (
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
                  <time dateTime={stop.dateTime}>{stop.period}</time>
                  <strong>{stop.label}</strong>
                  <span>{stop.company}{stop.id === "developer" ? " · Current" : ""}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.branchLabel}>Independent work continues</p>
      </div>
      <div id="v2-career-details" className={styles.details} role="region" aria-labelledby="v2-career-role" aria-live="polite" style={{ "--stop-color": selected.color } as CSSProperties}>
        <motion.div key={selectedId} className={styles.roleDetails} initial={quiet ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: quiet ? 0 : 0.18 }}>
          <p className={styles.eyebrow}>Selected stop</p>
          <h4 id="v2-career-role">{selected.role}</h4>
          <p className={styles.company}>{selected.company} · {selected.period}</p>
          <p className={styles.description}>{selected.description}</p>
        </motion.div>
        <div className={styles.relatedWork}>
          {projects.length > 0 && (
            <div>
              <p className={styles.eyebrow}>Built here</p>
              <ul className={styles.projects}>
                {projects.map((project) => <li key={project.slug}><Link href={v2ProjectHref(project.slug)}>{project.name}<ArrowUpRight aria-hidden="true" size={17} /></Link></li>)}
              </ul>
            </div>
          )}
          <div>
            <p className={styles.eyebrow}>Tools</p>
            <ul className={styles.tools}>{selected.technologies.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
