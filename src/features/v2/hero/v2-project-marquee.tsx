"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { v2Projects, v2ProjectHref } from "../projects/v2-project-data";
import { useProjectMarquee } from "./use-project-marquee";
import styles from "./v2-project-marquee.module.css";

// Lead with the four previews from the approved hero, followed by the other two projects.
const previewSlugs = ["scout", "joyno-accounting", "casatoon", "the-beach-park-hadsan", "joynosync", "nxone-dc-inc"];
const previews = previewSlugs.map((slug) => {
  const project = v2Projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing hero project: ${slug}`);
  return project;
});

export function V2ProjectMarquee({ active = true }: { active?: boolean }) {
  const { viewportRef, groupRef, paused, togglePaused } = useProjectMarquee(active);

  return (
    <div className={styles.marquee}>
      <div aria-label="Project previews" className={styles.viewport} ref={viewportRef} role="region">
        <div className={styles.track}>
          {[false, true].map((duplicate) => (
            <div
              aria-hidden={duplicate || undefined}
              className={`${styles.group} ${duplicate ? styles.duplicate : ""}`}
              key={String(duplicate)}
              ref={duplicate ? undefined : groupRef}
            >
              {previews.map((project, index) => (
                <Link
                  aria-label={`View ${project.name} case study`}
                  className={styles.preview}
                  href={v2ProjectHref(project.slug)}
                  key={project.slug}
                  prefetch={false}
                  tabIndex={duplicate ? -1 : undefined}
                >
                  <Image
                    alt={`${project.name} project screenshot`}
                    draggable={false}
                    fill
                    priority={!duplicate && index < 4}
                    sizes="(max-width: 600px) 288px, (max-height: 760px) 288px, 416px"
                    src={project.thumbnailUrl}
                  />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        aria-label={paused ? "Resume project previews" : "Pause project previews"}
        aria-pressed={paused}
        className={styles.pause}
        onClick={togglePaused}
        type="button"
      >
        {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
      </button>
    </div>
  );
}
