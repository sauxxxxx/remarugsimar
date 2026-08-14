import { type ComponentType } from "react";
import {
  type MotionStyle,
  type MotionValue,
  useTransform,
} from "motion/react";
import { getProjectSettleUnit } from "./v2-scroll-timeline";

const ORBIT_DURATION_UNITS = 1;
const LAST_PROJECT_EXIT_DELAY_UNITS = 0.25;
const LAST_PROJECT_EXIT_DURATION_UNITS = 1;

type ShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

type OrbitFrame = {
  at: number;
  copyX: string;
  copyY: string;
  visualX: string;
  visualY: string;
  visualScale: number;
  visualRotateZ: string;
  visualRotateY: string;
  opacity: number;
};

type V2ProjectOrbitProps = {
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
  showcases: ComponentType<ShowcaseProps>[];
};

const incomingFrames = [
  { copyX: "1.8vw", copyY: "3.2vh", visualX: "58vw", visualY: "78vh", visualScale: 0.48, visualRotateZ: "13deg", visualRotateY: "-22deg", opacity: 0 },
  { copyX: "1.2vw", copyY: "2.1vh", visualX: "38vw", visualY: "48vh", visualScale: 0.64, visualRotateZ: "9deg", visualRotateY: "-16deg", opacity: 0.4 },
  { copyX: "0.45vw", copyY: "0.8vh", visualX: "14vw", visualY: "14vh", visualScale: 0.86, visualRotateZ: "3deg", visualRotateY: "-6deg", opacity: 0.88 },
] as const;

const centeredFrame = {
  copyX: "0vw",
  copyY: "0vh",
  visualX: "0vw",
  visualY: "0vh",
  visualScale: 1,
  visualRotateZ: "0deg",
  visualRotateY: "0deg",
  opacity: 1,
} as const;

const outgoingFrames = [
  { copyX: "-0.45vw", copyY: "-0.8vh", visualX: "-4vw", visualY: "-5vh", visualScale: 0.92, visualRotateZ: "-2deg", visualRotateY: "4deg", opacity: 0.72 },
  { copyX: "-1.1vw", copyY: "-2vh", visualX: "-15vw", visualY: "-20vh", visualScale: 0.7, visualRotateZ: "-8deg", visualRotateY: "11deg", opacity: 0.32 },
  { copyX: "-2vw", copyY: "-3.6vh", visualX: "-29vw", visualY: "-41vh", visualScale: 0.44, visualRotateZ: "-16deg", visualRotateY: "19deg", opacity: 0 },
] as const;

function createFrame(at: number, values: Omit<OrbitFrame, "at">): OrbitFrame {
  return { at, ...values };
}

function createOrbitFrames(index: number, projectCount: number, scrollUnits: number) {
  const frames: OrbitFrame[] = [];
  const settleUnit = getProjectSettleUnit(index);
  const toProgress = (unit: number) => unit / scrollUnits;

  if (index === 0) {
    frames.push(createFrame(0, centeredFrame));
  } else {
    const entryStart = settleUnit - ORBIT_DURATION_UNITS;
    frames.push(createFrame(0, incomingFrames[0]));
    frames.push(createFrame(toProgress(entryStart), incomingFrames[0]));
    frames.push(createFrame(toProgress(entryStart + 0.35), incomingFrames[1]));
    frames.push(createFrame(toProgress(entryStart + 0.72), incomingFrames[2]));
    frames.push(createFrame(toProgress(settleUnit), centeredFrame));
  }

  if (index < projectCount - 1) {
    const nextSettleUnit = getProjectSettleUnit(index + 1);
    const exitStart = nextSettleUnit - ORBIT_DURATION_UNITS;
    frames.push(createFrame(toProgress(exitStart), centeredFrame));
    frames.push(createFrame(toProgress(exitStart + 0.35), outgoingFrames[0]));
    frames.push(createFrame(toProgress(exitStart + 0.72), outgoingFrames[1]));
    frames.push(createFrame(toProgress(nextSettleUnit), outgoingFrames[2]));
    frames.push(createFrame(1, outgoingFrames[2]));
  } else {
    const exitStart = settleUnit + LAST_PROJECT_EXIT_DELAY_UNITS;
    const exitEnd = exitStart + LAST_PROJECT_EXIT_DURATION_UNITS;
    frames.push(createFrame(toProgress(exitStart), centeredFrame));
    frames.push(createFrame(toProgress(exitStart + 0.35), outgoingFrames[0]));
    frames.push(createFrame(toProgress(exitStart + 0.72), outgoingFrames[1]));
    frames.push(createFrame(toProgress(exitEnd), outgoingFrames[2]));
    frames.push(createFrame(1, outgoingFrames[2]));
  }

  return frames;
}

function createCopyRevealFrames(index: number, projectCount: number, scrollUnits: number) {
  const settleUnit = getProjectSettleUnit(index);
  const toProgress = (unit: number) => unit / scrollUnits;
  const entryStart = settleUnit - ORBIT_DURATION_UNITS;
  const times = index === 0
    ? [0]
    : [0, toProgress(entryStart), toProgress(entryStart + 0.26), toProgress(settleUnit)];
  const values = index === 0 ? [1] : [0, 0, 0, 1];

  if (index < projectCount - 1) {
    const nextSettleUnit = getProjectSettleUnit(index + 1);
    const exitStart = nextSettleUnit - ORBIT_DURATION_UNITS;
    times.push(toProgress(exitStart), toProgress(exitStart + 0.38), toProgress(nextSettleUnit), 1);
    values.push(1, 0, 0, 0);
  } else {
    const exitStart = settleUnit + LAST_PROJECT_EXIT_DELAY_UNITS;
    const exitEnd = exitStart + LAST_PROJECT_EXIT_DURATION_UNITS;
    times.push(toProgress(exitStart), toProgress(exitStart + 0.38), toProgress(exitEnd), 1);
    values.push(1, 0, 0, 0);
  }

  return { times, values };
}

function V2OrbitingProject({
  Showcase,
  index,
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
}: {
  Showcase: ComponentType<ShowcaseProps>;
  index: number;
  progress: MotionValue<number>;
  projectCount: number;
  reduceMotion: boolean;
  scrollUnits: number;
}) {
  const frames = createOrbitFrames(index, projectCount, scrollUnits);
  const times = frames.map((frame) => frame.at);
  const copyX = useTransform(progress, times, frames.map((frame) => frame.copyX));
  const copyY = useTransform(progress, times, frames.map((frame) => frame.copyY));
  const visualX = useTransform(progress, times, frames.map((frame) => frame.visualX));
  const visualY = useTransform(progress, times, frames.map((frame) => frame.visualY));
  const visualScale = useTransform(progress, times, frames.map((frame) => frame.visualScale));
  const visualRotateZ = useTransform(progress, times, frames.map((frame) => frame.visualRotateZ));
  const visualRotateY = useTransform(progress, times, frames.map((frame) => frame.visualRotateY));
  const opacity = useTransform(progress, times, frames.map((frame) => frame.opacity));
  const copyRevealFrames = createCopyRevealFrames(index, projectCount, scrollUnits);
  const copyRevealProgress = useTransform(
    progress,
    copyRevealFrames.times,
    copyRevealFrames.values,
  );

  const copyStyle: MotionStyle = reduceMotion
    ? { display: index === 0 ? undefined : "none" }
    : { x: copyX, y: copyY, opacity };
  const visualStyle: MotionStyle = reduceMotion
    ? { display: index === 0 ? undefined : "none" }
    : {
        x: visualX,
        y: visualY,
        scale: visualScale,
        rotateZ: visualRotateZ,
        rotateY: visualRotateY,
        opacity,
      };

  return (
    <Showcase
      copyRevealProgress={copyRevealProgress}
      copyStyle={copyStyle}
      visualStyle={visualStyle}
    />
  );
}

export function V2ProjectOrbit({
  progress,
  projectCount,
  reduceMotion,
  scrollUnits,
  showcases,
}: V2ProjectOrbitProps) {
  return showcases.map((Showcase, index) => (
    <V2OrbitingProject
      Showcase={Showcase}
      index={index}
      key={Showcase.name}
      progress={progress}
      projectCount={projectCount}
      reduceMotion={reduceMotion}
      scrollUnits={scrollUnits}
    />
  ));
}
