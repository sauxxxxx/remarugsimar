"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { type V2Project, v2ProjectHref } from "../projects/v2-project-data";
import { getCareerSlideOffset } from "./career-carousel-slides";
import { useCareerCarousel } from "./use-career-carousel";
import styles from "./v2-career-carousel.module.css";

export function V2CareerCarousel({ projects, reduceMotion }: { projects: readonly V2Project[]; reduceMotion: boolean }) {
  const controls = useCareerCarousel(projects.length);
  const project = projects[controls.index];
  if (!project) return null;

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Projects built in this role" tabIndex={0} onKeyDown={controls.onKeyDown}>
      <div className={styles.viewport} id="v2-career-carousel-slides" {...controls.swipe}>
        {projects.map((item, index) => {
          const offset = getCareerSlideOffset(index, controls.index, projects.length);
          const active = offset === 0;
          const visible = Math.abs(offset) <= 1;
          const image = <Image src={item.thumbnailUrl} alt={`${item.name} project preview`} fill sizes="(max-width: 720px) 64vw, (max-width: 1024px) 42vw, 30vw" draggable={false} />;
          return (
            <motion.div
              key={item.slug}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${projects.length}: ${item.name}`}
              aria-hidden={!visible}
              inert={!visible}
              data-active={active}
              data-offset={offset}
              initial={false}
              animate={{ x: `${offset * 66}%`, scale: active ? 1 : 0.82, opacity: active ? 1 : visible ? 0.55 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: active ? 3 : visible ? 2 : 0, pointerEvents: visible ? "auto" : "none" }}
            >
              {active
                ? <Link className={styles.cardControl} href={v2ProjectHref(item.slug)} aria-label={`View ${item.name} case study`} draggable={false}>{image}</Link>
                : <button className={styles.cardControl} type="button" disabled={!visible} aria-label={`Show ${item.name} project`} onClick={(event) => {
                    controls.goTo(index);
                    event.currentTarget.closest<HTMLElement>('[aria-roledescription="carousel"]')?.focus({ preventScroll: true });
                  }}>{image}</button>}
            </motion.div>
          );
        })}
        {projects.length > 1 && <>
          <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Previous project" onClick={() => controls.move(-1)}><ArrowLeft aria-hidden="true" size={18} /></button>
          <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Next project" onClick={() => controls.move(1)}><ArrowRight aria-hidden="true" size={18} /></button>
        </>}
      </div>
      <div className={styles.footer}>
        <Link className={styles.projectLink} href={v2ProjectHref(project.slug)}>{project.name}<ArrowUpRight aria-hidden="true" size={17} /></Link>
        <span className={styles.count} aria-live="polite" aria-atomic="true"><span className={styles.srOnly}>{project.name}, project </span>{controls.index + 1} / {projects.length}</span>
      </div>
      {projects.length > 1 && <div className={styles.dots} role="group" aria-label="Choose a project">
        {projects.map((item, index) => <button key={item.slug} type="button" aria-label={`Show ${item.name}`} aria-pressed={index === controls.index} aria-controls="v2-career-carousel-slides" onClick={() => controls.goTo(index)}><span /></button>)}
      </div>}
    </div>
  );
}
