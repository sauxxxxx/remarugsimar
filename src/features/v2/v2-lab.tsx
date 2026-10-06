import DotGrid from "@/components/DotGrid";
import { ScrollAnimatedContent } from "@/components/react-bits/scroll-animated-content";
import type { MotionValue } from "motion/react";
import styles from "./v2-lab.module.css";

type V2LabProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  staticLayout: boolean;
};

export function V2Lab({ progress, reduceMotion, staticLayout }: V2LabProps) {
  const still = reduceMotion || staticLayout;

  return (
    <div className={`${styles.lab} ${staticLayout ? styles.flow : ""} ${still ? styles.still : ""}`}>
      <p className={styles.intro}>Small studies in motion. A few things I try between builds.</p>
      <div className={styles.studies}>
        <ScrollAnimatedContent className={styles.feature} distance={16} start={0.08} end={0.65} progress={progress}>
          <figure className={styles.primary}>
            <div aria-hidden="true" className={styles.field}>
              {still ? <div className={styles.fieldStill} /> : (
                <DotGrid
                  activeColor="#b5df08"
                  baseColor="#434c2e"
                  className={styles.dots}
                  dotSize={3}
                  gap={20}
                  proximity={140}
                  returnDuration={1.2}
                  shockRadius={0}
                />
              )}
            </div>
            <figcaption className={styles.primaryCaption}>
              <h3>Pointer field</h3>
              <p>{still ? "A study in movement and return." : "Move across the dots and watch them settle back into place."}</p>
            </figcaption>
          </figure>
        </ScrollAnimatedContent>

        <div className={styles.previews}>
          <ScrollAnimatedContent className={styles.preview} distance={12} start={0.2} end={0.75} progress={progress}>
            <figure className={styles.secondary}>
              <div aria-hidden="true" className={styles.depth}>
                <div className={styles.depthGrid}>{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</div>
              </div>
              <figcaption className={styles.caption}>
                <h3>Depth study</h3>
                <p>A flat grid, seen from another angle.</p>
              </figcaption>
            </figure>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent className={styles.preview} distance={12} start={0.32} end={0.85} progress={progress}>
            <figure className={styles.secondary}>
              <div aria-hidden="true" className={styles.orbitStage}>
                <span className={styles.orbit}><i /><i /><b /></span>
              </div>
              <figcaption className={styles.caption}>
                <h3>Orbital motion</h3>
                <p>A looping rhythm for a waiting state.</p>
              </figcaption>
            </figure>
          </ScrollAnimatedContent>
        </div>
      </div>
      <p className={styles.credit}>Pointer study adapted from <a href="https://reactbits.dev/components/dot-grid" target="_blank" rel="noreferrer">React Bits</a>.</p>
    </div>
  );
}
