"use client";

// Interaction patterns adapted from David Haz's React Bits. See LICENSE.md.
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type PointerEvent, useState } from "react";
import { getLabPointer, useLabPointer } from "./use-lab-pointer";
import styles from "../v2-lab.module.css";

export function TiltedProjectPreview({ src, name, href, reduceMotion }: {
  src: string; name: string; href: string; reduceMotion: boolean;
}) {
  const pointer = useLabPointer(8, reduceMotion);
  const rotateX = useTransform(pointer.y, (value) => -value);

  return (
    <div className={styles.tiltStage} {...pointer.events}>
      <motion.div className={styles.tiltImage} style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : pointer.x }}>
        <Link aria-label={`Open ${name} case study`} className={styles.projectLink} href={href}>
          <Image alt={`${name} laptop preview`} fill sizes="(max-width: 720px) calc(100vw - 40px), 60vw" src={src} />
          <span className={styles.projectLabel}>Open {name} <ArrowUpRight aria-hidden="true" size={15} /></span>
        </Link>
      </motion.div>
    </div>
  );
}

export function MagneticProjectButton({ reduceMotion }: { reduceMotion: boolean }) {
  const pointer = useLabPointer(14, reduceMotion);

  return (
    <div className={styles.magnetStage} {...pointer.events}>
      <motion.div style={{ x: reduceMotion ? 0 : pointer.x, y: reduceMotion ? 0 : pointer.y }}>
        <Link className={styles.magnetButton} href="/v2/projects">
          Explore work <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </motion.div>
    </div>
  );
}

const glowColors = [
  { name: "violet", value: "rgba(181, 151, 255, 0.48)" },
  { name: "blue", value: "rgba(102, 196, 255, 0.48)" },
  { name: "coral", value: "rgba(255, 161, 139, 0.48)" },
] as const;

export function SpotlightSurface({ reduceMotion }: { reduceMotion: boolean }) {
  const [colorIndex, setColorIndex] = useState(0);
  const glow = glowColors[colorIndex];
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const point = getLabPointer(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect(), 50);
    event.currentTarget.style.setProperty("--light-x", `${50 + point.x}%`);
    event.currentTarget.style.setProperty("--light-y", `${50 + point.y}%`);
  };
  const reset = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--light-y", "50%");
  };

  return (
    <button
      aria-label={`Change spotlight color. Current light: ${glow.name}.`}
      className={styles.spotlight}
      onClick={() => setColorIndex((index) => (index + 1) % glowColors.length)}
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{ "--light-color": glow.value } as CSSProperties}
      type="button"
    >
      <span className={styles.spotlightWord}>Focus</span>
      <span className={styles.spotlightHint}>Change the light <ArrowUpRight aria-hidden="true" size={14} /></span>
    </button>
  );
}
