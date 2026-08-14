import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Image from "next/image";
import deviceStyles from "./v2-project-device.module.css";
import { V2ProjectCopy } from "./v2-project-copy";
import styles from "./v2-nxone-showcase.module.css";

const projectTags = ["WordPress", "Elementor", "SEO"];

type V2NxOneShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2NxOneShowcase({
  copyRevealProgress,
  copyStyle,
  visualStyle,
}: V2NxOneShowcaseProps) {
  return (
    <>
      <V2ProjectCopy
        className={styles.projectCopy}
        description="A focused corporate website presenting NxOne's data-center services, AI infrastructure direction, and path to expert contact."
        href="/projects/nxone-dc-inc"
        number="03"
        revealProgress={copyRevealProgress}
        style={copyStyle}
        tags={projectTags}
        title="NxOne DC Inc."
        type="Corporate data center website"
      />

      <motion.div
        className={`${deviceStyles.deviceStage} ${styles.monitorScene}`}
        style={visualStyle}
      >
        <Image
          alt="NxOne DC Inc. corporate website displayed on a real desktop monitor"
          className={styles.monitorImage}
          fill
          sizes="(max-width: 980px) 64vw, 930px"
          src="/v2/nxone-monitor-left-alpha-v3.webp"
        />
      </motion.div>
    </>
  );
}
