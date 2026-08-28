import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { AtSign, Instagram, Linkedin } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import {
  getAboutRevealUnit,
  getAboutSettleUnit,
  getWhatIDoRevealUnit,
  getWhatIDoSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-about-section.module.css";

type V2AboutSectionProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

const aboutSocials = [
  { href: "https://www.instagram.com/", icon: Instagram, label: "Instagram" },
  { href: "https://www.threads.net/", icon: AtSign, label: "Threads" },
  { href: "https://x.com/", icon: null, label: "X" },
  {
    href: "https://www.linkedin.com/in/ugsimar-remar-756a8a3a7/",
    icon: Linkedin,
    label: "LinkedIn",
  },
] as const;

export function V2AboutSection({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2AboutSectionProps) {
  const revealUnit = getAboutRevealUnit(projectCount);
  const settleUnit = getAboutSettleUnit(projectCount);
  const nextRevealUnit = getWhatIDoRevealUnit(projectCount);
  const nextSettleUnit = getWhatIDoSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const revealProgress = useTransform(progress, [at(revealUnit), at(settleUnit)], [0, 1]);
  const sectionOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.12),
      at(revealUnit + 0.08),
      at(nextRevealUnit - 0.1),
      at(nextSettleUnit - 0.55),
    ],
    [0, 1, 1, 0],
  );
  const pointerEvents = useTransform(
    progress,
    [at(revealUnit - 0.02), at(revealUnit)],
    ["none", "auto"],
  );
  const copyOpacity = useTransform(revealProgress, [0.08, 0.44], [0, 1]);
  const copyY = useTransform(revealProgress, [0.08, 0.74], ["5vh", "0vh"]);
  const copyFilter = useTransform(
    revealProgress,
    [0.08, 0.62],
    ["blur(18px)", "blur(0px)"],
  );
  const slabClip = useTransform(
    revealProgress,
    [0.04, 0.7],
    ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
  );
  const seamOpacity = useTransform(revealProgress, [0.08, 0.38, 0.92], [0, 1, 0.72]);
  const seamScale = useTransform(revealProgress, [0.08, 0.72], [0.12, 1]);
  const portraitX = useTransform(revealProgress, [0.18, 1], ["4.5vw", "0vw"]);
  const portraitY = useTransform(revealProgress, [0.18, 1], ["8vh", "0vh"]);
  const portraitOpacity = useTransform(revealProgress, [0.18, 0.6], [0, 1]);
  const portraitScale = useTransform(revealProgress, [0.18, 1], [1.045, 1]);
  const landscapeOpacity = useTransform(revealProgress, [0, 0.28], [0.4, 1]);
  const landscapeY = useTransform(revealProgress, [0, 1], ["5vh", "0vh"]);
  const sectionY = useTransform(
    progress,
    [at(nextRevealUnit - 0.1), at(nextSettleUnit - 0.45)],
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
        aria-hidden="true"
        className={styles.landscape}
        style={{ opacity: landscapeOpacity, y: landscapeY }}
      >
        <Image alt="" fill priority sizes="100vw" src="/v2/closing-rock-valley-v2.webp" />
      </motion.div>
      <div aria-hidden="true" className={styles.haze} />

      <motion.div aria-hidden="true" className={styles.visualPanel} style={{ clipPath: slabClip }}>
        <div className={styles.slabTexture} />
        <div className={styles.limeDust} />
        <motion.div
          className={styles.seam}
          style={{ opacity: seamOpacity, scaleY: seamScale }}
        />
        <motion.div
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
            priority
            sizes="(max-width: 1100px) 48vw, 700px"
            src="/v2/remar-profile-side-cutout-v2.png"
            width={1023}
          />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className={styles.foreground}
        style={{ opacity: landscapeOpacity, y: landscapeY }}
      >
        <Image alt="" fill priority sizes="100vw" src="/v2/closing-rock-valley-v2.webp" />
      </motion.div>

      <motion.div
        className={styles.copy}
        style={{ filter: copyFilter, opacity: copyOpacity, y: copyY }}
      >
        <ScrollAnimatedContent end={0.24} progress={revealProgress} start={0.02}>
          <p className={styles.eyebrow}><span>03</span> About me</p>
        </ScrollAnimatedContent>

        <div className={styles.statement}>
          <ScrollAnimatedContent distance={18} end={0.58} progress={revealProgress} start={0.16}>
            <h2 aria-label="I design and build systems that solve real problems.">
              <span>I design and build</span>
              <span>systems that</span>
              <em>solve real problems.</em>
            </h2>
          </ScrollAnimatedContent>

          <ScrollAnimatedContent end={0.82} progress={revealProgress} start={0.42}>
            <div className={styles.bodyCopy}>
              <i aria-hidden="true" />
              <p>
                I connect interface, backend, data, and deployment around the workflow people
                actually need to complete.
              </p>
            </div>

            <nav aria-label="Social profiles" className={styles.socials}>
              {aboutSocials.map(({ href, icon: Icon, label }) => (
                <a
                  aria-label={label}
                  href={href}
                  key={label}
                  rel="noreferrer"
                  target="_blank"
                  title={label}
                >
                  {Icon ? <Icon aria-hidden="true" strokeWidth={1.7} /> : <span aria-hidden="true">X</span>}
                </a>
              ))}
            </nav>
          </ScrollAnimatedContent>
        </div>
      </motion.div>
      <div aria-hidden="true" className={styles.noise} />
    </motion.section>
  );
}
