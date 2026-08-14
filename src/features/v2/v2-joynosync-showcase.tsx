import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Image from "next/image";
import deviceStyles from "./v2-project-device.module.css";
import { V2ProjectCopy } from "./v2-project-copy";
import styles from "./v2-joynosync-showcase.module.css";

const projectTags = ["CRM", "SaaS", "Web app"];

type V2JoynoSyncShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2JoynoSyncShowcase({
  copyRevealProgress,
  copyStyle,
  visualStyle,
}: V2JoynoSyncShowcaseProps) {
  return (
    <>
      <V2ProjectCopy
        className={styles.projectCopy}
        description="A modern CRM that brings customer activity, pipeline movement, and daily operations into one focused workspace."
        href="/projects/joynosync"
        number="02"
        revealProgress={copyRevealProgress}
        style={copyStyle}
        tags={projectTags}
        title="Joyno Sync"
        type="Business CRM platform"
      />

      <motion.div
        className={`${deviceStyles.deviceStage} ${styles.dashboardVisual}`}
        style={visualStyle}
      >
        <Image
          alt="JoynoSync Visual Studio-style dark CRM dashboard displayed on a real landscape tablet"
          className={styles.tabletImage}
          fill
          priority
          sizes="(max-width: 980px) 62vw, 980px"
          src="/v2/joynosync-ipad-left-alpha-v5.webp"
        />
      </motion.div>
    </>
  );
}
