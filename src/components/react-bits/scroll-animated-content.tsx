import { motion, type MotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";

type ScrollAnimatedContentProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  end: number;
  progress: MotionValue<number>;
  start: number;
};

/** Scroll-scrubbed adaptation of React Bits' Animated Content pattern. */
export function ScrollAnimatedContent({
  children,
  className,
  distance = 12,
  end,
  progress,
  start,
}: ScrollAnimatedContentProps) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [distance, 0]);

  return (
    <motion.div className={className} style={{ display: "flow-root", opacity, y }}>
      {children}
    </motion.div>
  );
}
