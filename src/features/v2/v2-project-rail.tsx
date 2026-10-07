import { motion, type MotionStyle, type MotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useState } from "react";
import { v2Projects } from "./projects/v2-project-data";
import { getActiveProjectIndex, getClosingRevealUnit, getProjectSettleUnit } from "./v2-scroll-timeline";
import styles from "./v2-project-rail.module.css";

type RailProps = {
  progress: MotionValue<number>;
  projectCount: number;
  scrollUnits: number;
  onSelectProject: (index: number) => void;
  style?: MotionStyle;
};

function ProjectRailItem({ index, active, progress, projectCount, scrollUnits, onSelectProject }: RailProps & {
  index: number;
  active: boolean;
}) {
  const settle = getProjectSettleUnit(index) / scrollUnits;
  const previousSettle = index === 0 ? 0 : getProjectSettleUnit(index - 1) / scrollUnits;
  const nextSettle = index === projectCount - 1 ? 1 : getProjectSettleUnit(index + 1) / scrollUnits;
  const activeStart = index === 0 ? 0 : (previousSettle + settle) / 2;
  const activeEnd = index === projectCount - 1 ? 1 : (settle + nextSettle) / 2;
  const input = index === 0
    ? [0, activeEnd, activeEnd + 0.012, 1]
    : index === projectCount - 1
      ? [0, activeStart - 0.012, activeStart, 1]
      : [0, activeStart - 0.012, activeStart, activeEnd, activeEnd + 0.012, 1];
  const accent = "#8bdbc9";
  const muted = "rgba(245,245,239,.62)";
  const output = index === 0
    ? [accent, accent, muted, muted]
    : index === projectCount - 1
      ? [muted, muted, accent, accent]
      : [muted, muted, accent, accent, muted, muted];
  const color = useTransform(progress, input, output);
  const name = v2Projects[index]?.name ?? `Project ${index + 1}`;

  return (
    <motion.li style={{ color }}>
      <button
        aria-current={active ? "true" : undefined}
        aria-label={`Show ${name}, project ${index + 1} of ${projectCount}`}
        onClick={() => onSelectProject(index)}
        type="button"
      >
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className={styles.tooltip}>{name}</span>
      </button>
      {index < projectCount - 1 && <i aria-hidden="true" />}
    </motion.li>
  );
}

export function V2ProjectRail({ progress, projectCount, scrollUnits, onSelectProject, style }: RailProps) {
  const stateAt = (value: number) => ({
    index: getActiveProjectIndex(value, projectCount, scrollUnits),
    available: value * scrollUnits >= getProjectSettleUnit(0) - 0.1
      && value * scrollUnits < getClosingRevealUnit(projectCount) + 0.32,
  });
  const [state, setState] = useState(() => stateAt(progress.get()));
  useMotionValueEvent(progress, "change", (value) => {
    const next = stateAt(value);
    setState((previous) => previous.index === next.index && previous.available === next.available ? previous : next);
  });

  return (
    <motion.ol aria-label="Selected project navigation" className={styles.rail} inert={!state.available} style={style}>
      {Array.from({ length: projectCount }, (_, index) => (
        <ProjectRailItem
          active={state.index === index}
          index={index}
          key={index}
          onSelectProject={onSelectProject}
          progress={progress}
          projectCount={projectCount}
          scrollUnits={scrollUnits}
        />
      ))}
    </motion.ol>
  );
}
