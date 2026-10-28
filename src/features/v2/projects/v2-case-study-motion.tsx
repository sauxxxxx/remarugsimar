"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { V2RibbonCanvas } from "../ribbons/v2-ribbon-canvas";
import { useSectionEntrance } from "../scroll/use-section-entrance";

const MINT: readonly [number, number, number] = [0.55, 0.86, 0.79];

/** Reveals every [data-v2-reveal] group inside as it scrolls into view. */
export function V2RevealRoot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useSectionEntrance<HTMLDivElement>();
  return <div className={className} data-v2-reveal-root ref={ref}>{children}</div>;
}

/** The hero screenshot eases in slightly as the page scrolls past it. */
export function V2HeroZoom({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 900], [1, 1.07]);
  return <motion.div className={className} style={reduceMotion ? undefined : { scale }}>{children}</motion.div>;
}

/** Ribbons behind the features glass panel. */
export function V2PanelRibbons({ className, canvasClassName }: { className?: string; canvasClassName?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <V2RibbonCanvas className={canvasClassName} intensity={0.7} lift={0} slope={-0.08} speed={0.6} tint={MINT} tintAmount={0.3} />
    </div>
  );
}
