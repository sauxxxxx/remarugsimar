import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { ArrowRight } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  getAboutRevealUnit,
  getAboutSettleUnit,
  getRestRevealUnit,
  getRestSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-about-section.module.css";

type V2AboutSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

export function V2AboutSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2AboutSectionProps) {
  const revealUnit = getAboutRevealUnit(projectCount);
  const settleUnit = getAboutSettleUnit(projectCount);
  const restRevealUnit = getRestRevealUnit(projectCount);
  const restSettleUnit = getRestSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const revealProgress = useTransform(
    progress,
    [at(revealUnit), at(settleUnit)],
    [0, 1],
  );
  const sectionOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.12),
      at(revealUnit + 0.08),
      at(restRevealUnit - 0.1),
      at(restSettleUnit - 0.55),
    ],
    [0, 1, 1, 0],
  );
  const pointerEvents = useTransform(
    progress,
    [at(revealUnit - 0.02), at(revealUnit)],
    ["none", "auto"],
  );
  const copyOpacity = useTransform(revealProgress, [0.1, 0.46], [0, 1]);
  const copyY = useTransform(revealProgress, [0.08, 0.72], ["5vh", "0vh"]);
  const copyFilter = useTransform(
    revealProgress,
    [0.08, 0.62],
    ["blur(18px)", "blur(0px)"],
  );
  const paperClip = useTransform(
    revealProgress,
    [0, 0.34, 0.74, 1],
    [
      "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
      "polygon(68% 100%, 100% 100%, 100% 24%, 88% 40%)",
      "polygon(8% 100%, 100% 100%, 100% 0%, 38% 0%)",
      "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
    ],
  );
  const paperShadeOpacity = useTransform(revealProgress, [0.18, 0.82], [0.82, 0]);
  const portraitX = useTransform(revealProgress, [0.14, 1], ["3vw", "0vw"]);
  const portraitY = useTransform(revealProgress, [0.14, 0.92], ["25vh", "0vh"]);
  const portraitOpacity = useTransform(revealProgress, [0.14, 0.58], [0, 1]);
  const portraitScale = useTransform(revealProgress, [0.14, 1], [1.06, 1]);
  const sectionY = useTransform(
    progress,
    [at(restRevealUnit - 0.1), at(restSettleUnit - 0.45)],
    ["0vh", "-8vh"],
  );

  return (
    <motion.section
      aria-label="About Remar"
      className={`${styles.section} ${reduceMotion ? styles.reducedMotion : ""}`}
      id="v2-about"
      style={{ opacity: sectionOpacity, pointerEvents, y: sectionY }}
    >
      <motion.div
        className={styles.copyPanel}
        style={{ filter: copyFilter, opacity: copyOpacity, y: copyY }}
      >
        <div className={styles.copy}>
          <ScrollAnimatedContent end={0.2} progress={revealProgress} start={0}>
            <p className={styles.eyebrow}><span>03</span> About me</p>
          </ScrollAnimatedContent>

          <ScrollAnimatedContent distance={18} end={0.48} progress={revealProgress} start={0.12}>
            <h2>
              I enjoy the balance between <em>design</em> and <em>code.</em>
            </h2>
          </ScrollAnimatedContent>

          <ScrollAnimatedContent end={0.67} progress={revealProgress} start={0.34}>
            <p className={styles.bodyCopy}>
              Curious by nature. Disciplined by choice. Always learning. Always building.
            </p>
          </ScrollAnimatedContent>

          <ScrollAnimatedContent distance={10} end={0.82} progress={revealProgress} start={0.55}>
            <p aria-label="Remar" className={styles.signature}>Remar.</p>
          </ScrollAnimatedContent>

          <ScrollAnimatedContent end={1} progress={revealProgress} start={0.72}>
            <Link className={styles.readMore} href="/resume">
              Read more
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </ScrollAnimatedContent>
        </div>
      </motion.div>

      <motion.div className={styles.visualPanel} style={{ clipPath: paperClip }}>
        <div aria-hidden="true" className={styles.paperTexture} />
        <motion.div
          aria-hidden="true"
          className={styles.paperShade}
          style={{ opacity: paperShadeOpacity }}
        />
        <motion.div
          aria-hidden="true"
          className={styles.portraitFrame}
          style={{
            opacity: portraitOpacity,
            scale: portraitScale,
            x: portraitX,
            y: portraitY,
          }}
        >
          <Image
            alt=""
            className={styles.portrait}
            height={1537}
            sizes="(max-width: 1100px) 58vw, 760px"
            src="/v2/remar-profile-side-cutout-v2.png"
            width={1023}
          />
        </motion.div>
        <div aria-hidden="true" className={styles.portraitMark}>✳</div>
      </motion.div>
    </motion.section>
  );
}
