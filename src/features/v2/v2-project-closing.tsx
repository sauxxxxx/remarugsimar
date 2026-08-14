import { ArrowDown } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import {
  getAboutRevealUnit,
  getAboutSettleUnit,
  getClosingRevealUnit,
  getClosingSettleUnit,
} from "./v2-scroll-timeline";
import styles from "./v2-project-closing.module.css";

type V2ProjectClosingProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
};

type BlurWordProps = {
  end: number;
  progress: MotionValue<number>;
  start: number;
  word: string;
};

const headingLines = [
  ["THAT’S", "A", "GLIMPSE", "OF"],
  ["WHAT", "I", "BUILD."],
];

function BlurWord({ end, progress, start, word }: BlurWordProps) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ["blur(18px)", "blur(0px)"]);
  const y = useTransform(progress, [start, end], ["0.42em", "0em"]);

  return (
    <motion.span className={styles.word} style={{ filter, opacity, y }}>
      {word}
    </motion.span>
  );
}

export function V2ProjectClosing({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: V2ProjectClosingProps) {
  const revealUnit = getClosingRevealUnit(projectCount);
  const settleUnit = getClosingSettleUnit(projectCount);
  const aboutRevealUnit = getAboutRevealUnit(projectCount);
  const aboutSettleUnit = getAboutSettleUnit(projectCount);
  const at = (unit: number) => unit / scrollUnits;
  const sectionOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.18),
      at(revealUnit + 0.32),
      at(aboutSettleUnit - 0.12),
      at(aboutSettleUnit + 0.08),
    ],
    [0, 1, 1, 0],
  );
  const sectionScale = useTransform(
    progress,
    [at(revealUnit - 0.18), at(settleUnit), at(aboutRevealUnit + 0.35), at(aboutSettleUnit)],
    [1.025, 1, 1, 1.018],
  );
  const sectionY = useTransform(
    progress,
    [at(aboutRevealUnit + 0.28), at(aboutSettleUnit)],
    ["0vh", "8vh"],
  );
  const veilOpacity = useTransform(
    progress,
    [at(aboutRevealUnit - 0.04), at(aboutRevealUnit + 0.62)],
    [1, 0],
  );
  const copyOpacity = useTransform(
    progress,
    [
      at(revealUnit + 0.38),
      at(settleUnit),
      at(aboutRevealUnit - 0.04),
      at(aboutRevealUnit + 0.34),
    ],
    [0, 1, 1, 0],
  );
  const copyY = useTransform(
    progress,
    [at(revealUnit + 0.38), at(settleUnit)],
    ["18px", "0px"],
  );
  const headingOpacity = useTransform(
    progress,
    [at(aboutRevealUnit - 0.06), at(aboutRevealUnit + 0.38)],
    [1, 0],
  );
  const headingFilter = useTransform(
    progress,
    [at(aboutRevealUnit - 0.06), at(aboutRevealUnit + 0.42)],
    ["blur(0px)", "blur(16px)"],
  );
  const headingY = useTransform(
    progress,
    [at(aboutRevealUnit - 0.06), at(aboutRevealUnit + 0.42)],
    ["0vh", "-3vh"],
  );
  const rayOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.05),
      at(settleUnit),
      at(aboutRevealUnit + 0.08),
      at(aboutRevealUnit + 0.68),
    ],
    [0, 0.42, 0.32, 0],
  );
  const rockOpacity = useTransform(
    progress,
    [
      at(revealUnit - 0.08),
      at(revealUnit + 0.58),
      at(aboutRevealUnit + 0.46),
      at(aboutSettleUnit),
    ],
    [0, 0.92, 0.92, 0],
  );
  const rockY = useTransform(
    progress,
    [
      at(revealUnit - 0.08),
      at(settleUnit),
      at(aboutRevealUnit + 0.46),
      at(aboutSettleUnit),
    ],
    ["10vh", "0vh", "0vh", "15vh"],
  );
  const rockScale = useTransform(
    progress,
    [at(revealUnit - 0.08), at(settleUnit)],
    [0.94, 1],
  );
  let wordIndex = 0;

  return (
    <motion.section
      aria-hidden={reduceMotion}
      aria-label="Selected work closing statement"
      className={`${styles.bridge} ${reduceMotion ? styles.reducedMotion : ""}`}
      style={{ opacity: sectionOpacity, scale: sectionScale, y: sectionY }}
    >
      <motion.div aria-hidden="true" className={styles.veil} style={{ opacity: veilOpacity }} />
      <motion.div aria-hidden="true" className={styles.lightRays} style={{ opacity: rayOpacity }} />
      <motion.div
        aria-hidden="true"
        className={styles.rock}
        style={{ opacity: rockOpacity, scale: rockScale, y: rockY }}
      >
        <Image
          alt=""
          fill
          sizes="100vw"
          src="/v2/closing-rock-valley-v2.webp"
        />
      </motion.div>
      <div aria-hidden="true" className={styles.noise} />

      <div className={styles.content}>
        <motion.h2
          className={styles.heading}
          style={{ filter: headingFilter, opacity: headingOpacity, y: headingY }}
        >
          {headingLines.map((line, lineIndex) => (
            <span className={styles.line} key={line.join("-")}>
              {line.map((word) => {
                const currentIndex = wordIndex;
                wordIndex += 1;
                const start = at(revealUnit + currentIndex * 0.07);
                const end = at(revealUnit + 0.52 + currentIndex * 0.07);

                return (
                  <BlurWord
                    end={end}
                    key={`${lineIndex}-${word}`}
                    progress={progress}
                    start={start}
                    word={word}
                  />
                );
              })}
            </span>
          ))}
        </motion.h2>

        <motion.div className={styles.support} style={{ opacity: copyOpacity, y: copyY }}>
          <p>More ideas. More experiments.</p>
          <p>Always building something meaningful.</p>
        </motion.div>

        <motion.p className={styles.scrollPrompt} style={{ opacity: copyOpacity, y: copyY }}>
          Let’s keep scrolling
          <span><ArrowDown aria-hidden="true" size={18} strokeWidth={1.5} /></span>
        </motion.p>
      </div>
    </motion.section>
  );
}
