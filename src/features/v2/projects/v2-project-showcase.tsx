import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Image from "next/image";
import { V2ProjectCopy } from "../v2-project-copy";
import deviceStyles from "../v2-project-device.module.css";
import { type V2Project, v2ProjectHref } from "./v2-project-data";
import styles from "./v2-project-showcase.module.css";

export type V2ShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2ProjectShowcase({
  project, index, copyRevealProgress, copyStyle, visualStyle,
}: V2ShowcaseProps & { project: V2Project; index: number }) {
  return (
    <>
      <V2ProjectCopy
        className={styles.copy}
        description={project.description}
        href={v2ProjectHref(project.slug)}
        number={String(index + 1).padStart(2, "0")}
        revealProgress={copyRevealProgress}
        style={copyStyle}
        tags={project.highlights}
        title={project.name}
        type={project.category}
      />
      <motion.div
        className={`${deviceStyles.deviceStage} ${styles[project.device]}`}
        style={visualStyle}
      >
        <Image
          alt={`${project.name} displayed on a ${project.device}`}
          className={styles.image}
          fill
          priority={index === 0}
          sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 980px) 65vw, 920px"
          src={project.deviceImage}
        />
      </motion.div>
    </>
  );
}
