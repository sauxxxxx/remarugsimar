import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { ScrollBlurText } from "@/components/react-bits/scroll-blur-text";
import { ArrowRight } from "lucide-react";
import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Link from "next/link";
import styles from "./v2-project-copy.module.css";

export type V2ProjectCopyProps = {
  className?: string;
  description: string;
  href: string;
  number: string;
  revealProgress: MotionValue<number>;
  style?: MotionStyle;
  tags: string[];
  title: string;
  type: string;
};

export function V2ProjectCopy({
  className,
  description,
  href,
  number,
  revealProgress,
  style,
  tags,
  title,
  type,
}: V2ProjectCopyProps) {
  return (
    <motion.div className={`${styles.projectCopy} ${className ?? ""}`} style={style}>
      <ScrollAnimatedContent end={0.2} progress={revealProgress} start={0}>
        <p className={styles.projectNumber}>{number}</p>
      </ScrollAnimatedContent>

      <ScrollBlurText end={0.58} progress={revealProgress} start={0.12} text={title} />

      <ScrollAnimatedContent end={0.64} progress={revealProgress} start={0.34}>
        <p className={styles.projectType}>{type}</p>
      </ScrollAnimatedContent>

      <ScrollAnimatedContent end={0.78} progress={revealProgress} start={0.48}>
        <p className={styles.description}>{description}</p>
      </ScrollAnimatedContent>

      <ScrollAnimatedContent end={0.9} progress={revealProgress} start={0.62}>
        <ul aria-label="Project technologies" className={styles.tags}>
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </ScrollAnimatedContent>

      <ScrollAnimatedContent end={1} progress={revealProgress} start={0.76}>
        <Link className={styles.caseStudyLink} href={href}>
          View case study
          <ArrowRight aria-hidden="true" size={19} strokeWidth={1.5} />
        </Link>
      </ScrollAnimatedContent>
    </motion.div>
  );
}
