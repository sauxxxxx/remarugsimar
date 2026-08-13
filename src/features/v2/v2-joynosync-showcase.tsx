import { ArrowRight } from "lucide-react";
import { motion, type MotionStyle } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./v2-joynosync-showcase.module.css";

const projectTags = ["CRM", "SaaS", "Web app"];

type V2JoynoSyncShowcaseProps = {
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2JoynoSyncShowcase({ copyStyle, visualStyle }: V2JoynoSyncShowcaseProps) {
  return (
    <>
      <motion.div className={styles.projectCopy} style={copyStyle}>
        <p className={styles.projectNumber}>02</p>
        <h2>Joyno Sync</h2>
        <p className={styles.projectType}>Business CRM platform</p>
        <p className={styles.description}>
          A modern CRM that brings customer activity, pipeline movement, and daily operations into
          one focused workspace.
        </p>

        <ul aria-label="Project technologies" className={styles.tags}>
          {projectTags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>

        <Link className={styles.caseStudyLink} href="/projects/joynosync">
          View case study
          <ArrowRight aria-hidden="true" size={19} strokeWidth={1.5} />
        </Link>
      </motion.div>

      <motion.div
        className={styles.dashboardVisual}
        style={visualStyle}
      >
        <div className={styles.tabletDevice}>
          <div aria-hidden="true" className={styles.camera} />
          <div className={styles.tabletScreen}>
            <Image
              alt="JoynoSync Visual Studio-style dark CRM dashboard showing pipeline, lead, and activity analytics"
              fill
              priority
              sizes="(max-width: 980px) 62vw, 64vw"
              src="/v2/joynosync-dashboard-vs-dark-v3.webp"
            />
          </div>
          <div aria-hidden="true" className={styles.volumeControls}>
            <span />
            <span />
          </div>
        </div>
      </motion.div>
    </>
  );
}
