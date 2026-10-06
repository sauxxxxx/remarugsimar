import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import { type MotionValue, useReducedMotion } from "motion/react";
import { v2Projects, v2ProjectHref } from "./projects/v2-project-data";
import { MagneticProjectButton, SpotlightSurface, TiltedProjectPreview } from "./lab/v2-lab-interactions";
import styles from "./v2-lab.module.css";

type V2LabProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  staticLayout: boolean;
};

export function V2Lab({ progress, reduceMotion, staticLayout }: V2LabProps) {
  const motionPreference = useReducedMotion();
  const quiet = reduceMotion || (motionPreference ?? false);
  const project = v2Projects[0];

  return (
    <div className={`${styles.lab} ${staticLayout ? styles.flow : ""}`}>
      <p className={styles.intro}>Details for project previews, calls to action, and feature highlights. Try them.</p>
      <div className={styles.studies}>
        <ScrollAnimatedContent className={styles.feature} distance={16} start={0.08} end={0.65} progress={progress}>
          <figure className={styles.primary}>
            <TiltedProjectPreview src={project.deviceImage} name={project.name} href={v2ProjectHref(project.slug)} reduceMotion={quiet} />
            <figcaption className={styles.primaryCaption}>
              <h3>Tilted project preview</h3>
              <p>Give project images depth. Open the preview to see the case study.</p>
            </figcaption>
          </figure>
        </ScrollAnimatedContent>
        <div className={styles.previews}>
          <ScrollAnimatedContent className={styles.preview} distance={12} start={0.2} end={0.75} progress={progress}>
            <figure className={styles.secondary}>
              <MagneticProjectButton reduceMotion={quiet} />
              <figcaption className={`${styles.caption} ${styles.coralCaption}`}>
                <h3>Magnetic button</h3>
                <p>A subtle pull toward a working call to action.</p>
              </figcaption>
            </figure>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent className={styles.preview} distance={12} start={0.32} end={0.85} progress={progress}>
            <figure className={styles.secondary}>
              <SpotlightSurface reduceMotion={quiet} />
              <figcaption className={`${styles.caption} ${styles.violetCaption}`}>
                <h3>Spotlight surface</h3>
                <p>Move the light across a feature, or tap to change its color.</p>
              </figcaption>
            </figure>
          </ScrollAnimatedContent>
        </div>
      </div>
    </div>
  );
}
