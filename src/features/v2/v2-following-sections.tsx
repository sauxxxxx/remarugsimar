"use client";

import { useMotionValue, useReducedMotion } from "motion/react";
import { V2ClosingSection } from "./closing/v2-closing-section";
import { V2AboutSection } from "./v2-about-section";
import { projectShowcases } from "./v2-project-showcases";
import { V2RestSection } from "./v2-rest-section";

export function V2FollowingSections() {
  const progress = useMotionValue(1);
  const reduceMotion = useReducedMotion() ?? false;
  const sectionProps = {
    progress, projectCount: projectShowcases.length, scrollUnits: 1,
    reduceMotion, staticLayout: true,
  };

  return (
    <>
      <V2RestSection {...sectionProps} section="capabilities" />
      <V2AboutSection {...sectionProps} />
      <V2RestSection {...sectionProps} section="experience" />
      <V2ClosingSection />
    </>
  );
}
