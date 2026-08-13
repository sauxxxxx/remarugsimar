import { ArrowRight } from "lucide-react";
import { motion, type MotionStyle } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./v2-project-showcase.module.css";

const projectTags = ["AI integration", "SaaS", "Web app"];

type V2ProjectShowcaseProps = {
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

export function V2ProjectShowcase({ copyStyle, visualStyle }: V2ProjectShowcaseProps) {
  return (
    <>
      <motion.div className={styles.projectCopy} style={copyStyle}>
        <p className={styles.projectNumber}>01</p>
        <h2>Roarly AI</h2>
        <p className={styles.projectType}>AI animation studio</p>
        <p className={styles.description}>
          An AI-powered animation studio that helps users generate polished animated stories in
          minutes.
        </p>

        <ul aria-label="Project technologies" className={styles.tags}>
          {projectTags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>

        <Link className={styles.caseStudyLink} href="/projects/roarly-ai">
          View case study
          <ArrowRight aria-hidden="true" size={19} strokeWidth={1.5} />
        </Link>
      </motion.div>

      <motion.div aria-hidden="true" className={styles.deviceScene} style={visualStyle}>
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
