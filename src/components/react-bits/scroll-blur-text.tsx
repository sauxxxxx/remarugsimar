import { motion, type MotionValue, useTransform } from "motion/react";

type ScrollBlurTextProps = {
  className?: string;
  end: number;
  progress: MotionValue<number>;
  start: number;
  text: string;
};

type ScrollBlurWordProps = {
  end: number;
  progress: MotionValue<number>;
  start: number;
  word: string;
};

function ScrollBlurWord({ end, progress, start, word }: ScrollBlurWordProps) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ["blur(7px)", "blur(0px)"]);
  const y = useTransform(progress, [start, end], [12, 0]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ display: "inline-block", filter, opacity, willChange: "filter, opacity, transform", y }}
    >
      {word}
    </motion.span>
  );
}

/** Scroll-scrubbed, word-based adaptation of React Bits' Blur Text pattern. */
export function ScrollBlurText({
  className,
  end,
  progress,
  start,
  text,
}: ScrollBlurTextProps) {
  const words = text.split(" ");
  const totalRange = end - start;
  const wordDuration = Math.min(totalRange * 0.72, 0.28);
  const stagger = words.length > 1 ? (totalRange - wordDuration) / (words.length - 1) : 0;

  return (
    <h2 aria-label={text} className={className} style={{ display: "flex", flexWrap: "wrap" }}>
      {words.map((word, index) => (
        <ScrollBlurWord
          end={start + index * stagger + wordDuration}
          key={`${word}-${index}`}
          progress={progress}
          start={start + index * stagger}
          word={index < words.length - 1 ? `${word}\u00A0` : word}
        />
      ))}
    </h2>
  );
}
