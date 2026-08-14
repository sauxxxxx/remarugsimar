import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight, Clock3, Mail, MapPin } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  getContactRevealUnit,
  getContactSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-contact-section.module.css";

type V2ContactSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

export function V2ContactSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2ContactSectionProps) {
  const revealUnit = getContactRevealUnit(projectCount);
  const settleUnit = getContactSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const revealProgress = useTransform(progress, [at(revealUnit), at(settleUnit)], [0, 1]);
  const sectionClip = useTransform(
    progress,
    [at(revealUnit - 0.12), at(revealUnit + 0.58)],
    ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
  );
  const headingFilter = useTransform(
    revealProgress,
    [0.08, 0.58],
    ["blur(18px)", "blur(0px)"],
  );
  const headingY = useTransform(revealProgress, [0.08, 0.72], [36, 0]);
  const rockX = useTransform(revealProgress, [0.04, 1], ["12vw", "0vw"]);
  const rockY = useTransform(revealProgress, [0.04, 1], ["7vh", "0vh"]);
  const rockScale = useTransform(revealProgress, [0.04, 1], [1.08, 1]);
  const rockOpacity = useTransform(revealProgress, [0.04, 0.5], [0, 0.86]);
  const pointerEvents = useTransform(
    progress,
    [at(revealUnit - 0.02), at(revealUnit)],
    ["none", "auto"],
  );

  return (
    <motion.section
      aria-labelledby="v2-contact-heading"
      className={`${styles.section} ${reduceMotion ? styles.reducedMotion : ""}`}
      id="v2-contact"
      style={{ clipPath: sectionClip, pointerEvents }}
    >
      <div aria-hidden="true" className={styles.glow} />
      <div aria-hidden="true" className={styles.noise} />
      <motion.div
        aria-hidden="true"
        className={styles.rock}
        style={{ opacity: rockOpacity, scale: rockScale, x: rockX, y: rockY }}
      >
        <Image alt="" fill sizes="62vw" src="/v2/closing-rock-valley-v2.webp" />
      </motion.div>

      <header className={styles.header}>
        <p><span>07</span> Contact</p>
        <p>Available for selected projects</p>
      </header>

      <div className={styles.content}>
        <motion.div
          className={styles.headingWrap}
          style={{ filter: headingFilter, y: headingY }}
        >
          <h2 id="v2-contact-heading">
            Let&apos;s build
            <span>something great</span>
            <span>together.</span>
          </h2>
        </motion.div>

        <ScrollAnimatedContent
          className={styles.detailsReveal}
          distance={18}
          end={0.78}
          progress={revealProgress}
          start={0.32}
        >
          <div className={styles.details}>
            <a href={`mailto:${siteConfig.email}?subject=Project%20inquiry`}>
              <Mail aria-hidden="true" size={15} strokeWidth={1.45} />
              {siteConfig.email}
            </a>
            <p>
              <MapPin aria-hidden="true" size={15} strokeWidth={1.45} />
              Cebu, Philippines
            </p>
            <p>
              <Clock3 aria-hidden="true" size={15} strokeWidth={1.45} />
              Available for selected projects
            </p>
          </div>
        </ScrollAnimatedContent>

        <ScrollAnimatedContent
          className={styles.ctaReveal}
          distance={12}
          end={1}
          progress={revealProgress}
          start={0.62}
        >
          <a
            className={styles.cta}
            href={`mailto:${siteConfig.email}?subject=Project%20inquiry`}
          >
            <span>Start a project</span>
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </a>
        </ScrollAnimatedContent>
      </div>

      <footer className={styles.footer}>
        <Link href="/v2">Remar Ugsimar</Link>
        <p>Full-stack developer / Cebu, PH</p>
        <p>2026</p>
      </footer>
    </motion.section>
  );
}
