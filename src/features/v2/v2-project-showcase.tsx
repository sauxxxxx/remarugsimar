import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Image from "next/image";
import deviceStyles from "./v2-project-device.module.css";
import { V2ProjectCopy } from "./v2-project-copy";
import styles from "./v2-project-showcase.module.css";

const projectTags = ["AI integration", "SaaS", "Web app"];

type V2ProjectShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2ProjectShowcase({
  copyRevealProgress,
  copyStyle,
  visualStyle,
}: V2ProjectShowcaseProps) {
  return (
    <>
      <V2ProjectCopy
        className={styles.projectCopy}
        description="An AI-powered animation studio that helps users generate polished animated stories in minutes."
        href="/projects/roarly-ai"
        number="01"
        revealProgress={copyRevealProgress}
        style={copyStyle}
        tags={projectTags}
        title="Roarly AI"
        type="AI animation studio"
      />

      <motion.div aria-hidden="true" className={deviceStyles.deviceStage} style={visualStyle}>
        <Image
          alt=""
          className={styles.laptopVisual}
          fill
          priority
          sizes="(max-width: 1100px) 64vw, 920px"
          src="/v2/roarly-laptop-real-screen-v6.png"
        />
      </motion.div>
    </>
  );
}
