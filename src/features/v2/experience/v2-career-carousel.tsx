"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { type V2Project, v2ProjectHref } from "../projects/v2-project-data";
import { useCareerCarousel } from "./use-career-carousel";
import styles from "./v2-career-carousel.module.css";

export function V2CareerCarousel({ projects, reduceMotion }: { projects: readonly V2Project[]; reduceMotion: boolean }) {
  const controls = useCareerCarousel(projects.length);
  const project = projects[controls.index];
  if (!project) return null;

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Projects built in this role" tabIndex={0} onKeyDown={controls.onKeyDown}>
      <div className={styles.preview} {...controls.swipe}>
        <motion.div key={project.slug} className={styles.slide} initial={reduceMotion ? false : { opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>
          <Link href={v2ProjectHref(project.slug)} aria-label={`View ${project.name} case study`} draggable={false}>
            <Image src={project.thumbnailUrl} alt={`${project.name} project preview`} fill sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1024px) 60vw, 38vw" draggable={false} />
          </Link>
        </motion.div>
      </div>
      <div className={styles.footer}>
        <Link className={styles.projectLink} href={v2ProjectHref(project.slug)}>{project.name}<ArrowUpRight aria-hidden="true" size={17} /></Link>
        <div className={styles.controls}>
          <span className={styles.count} aria-live="polite" aria-atomic="true"><span className={styles.srOnly}>{project.name}, project </span>{controls.index + 1} / {projects.length}</span>
          {projects.length > 1 && <>
            <button type="button" aria-label="Previous project" onClick={() => controls.move(-1)}><ArrowLeft aria-hidden="true" size={17} /></button>
            <button type="button" aria-label="Next project" onClick={() => controls.move(1)}><ArrowRight aria-hidden="true" size={17} /></button>
          </>}
        </div>
      </div>
    </div>
  );
}
