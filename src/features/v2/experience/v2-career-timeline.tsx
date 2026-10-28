"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import { v2ProjectHref, v2Projects } from "../projects/v2-project-data";
import { useSectionEntrance } from "../scroll/use-section-entrance";
import { v2CareerStops } from "../v2-experience-data";
import styles from "./v2-career-timeline.module.css";
import introStyles from "../scroll/v2-section-intro.module.css";

// Newest role first; the stages are defined oldest first.
const entries = [...v2CareerStops].reverse();
const ongoing = (period: string) => period.includes("Present");

export function V2CareerTimeline({ staticLayout }: { staticLayout: boolean }) {
  const entranceRef = useSectionEntrance(staticLayout);
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(entries[0].id);

  return (
    <div className={styles.timeline} data-v2-reveal-root ref={entranceRef}>
      <div className={introStyles.intro} data-v2-reveal="heading">
        <h3 className={introStyles.headline}>The road so far.</h3>
        <p className={introStyles.lede}>Where I&apos;ve worked, newest first.</p>
      </div>

      <ol className={styles.list}>
        {entries.map((entry, index) => {
          const open = openId === entry.id;
          const panelId = `${baseId}-${entry.id}`;
          const projects = entry.projects.flatMap((slug) => v2Projects.filter((project) => project.slug === slug));

          return (
            <li
              className={styles.entry}
              data-open={open}
              data-v2-reveal="copy"
              key={entry.id}
              style={{ "--entry-color": entry.color, "--v2-reveal-delay": `${80 + index * 90}ms` } as CSSProperties}
            >
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className={styles.summary}
                onClick={() => setOpenId(open ? null : entry.id)}
                type="button"
              >
                <time className={styles.year} dateTime={entry.dateTime}>{entry.dateTime}</time>
                <span className={styles.heading}>
                  <strong>{entry.role}</strong>
                  <span>{entry.company} · {entry.period}</span>
                </span>
                {ongoing(entry.period) && <span className={styles.status}>{index === 0 ? "Current" : "Ongoing"}</span>}
                <Plus aria-hidden="true" className={styles.toggle} size={20} strokeWidth={1.5} />
              </button>

              <div className={styles.panel} id={panelId} inert={!open}>
                <div className={styles.panelInner}>
                  <p className={styles.description}>{entry.description}</p>

                  {projects.length > 0 && (
                    <div className={styles.group}>
                      <p className={styles.label}>Projects</p>
                      <ul className={styles.projects}>
                        {projects.map((project) => (
                          <li key={project.slug}>
                            <Link href={v2ProjectHref(project.slug)}>
                              <span>{project.name}</span>
                              <span className={styles.category}>{project.category}</span>
                              <ArrowUpRight aria-hidden="true" size={16} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.group}>
                    <p className={styles.label}>Tools</p>
                    <ul className={styles.tools}>
                      {entry.technologies.map((tool) => <li key={tool}>{tool}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
