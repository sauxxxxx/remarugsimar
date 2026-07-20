import { type Point, type PreparedStroke } from "@/features/entrance/signature-strokes";

export type MotionSegment = {
  cumulative: number[];
  drawn: number;
  kind: "ink" | "lift";
  length: number;
  points: Point[];
  pressure: number;
  start: number;
  tempo: number;
};

export type MotionState = {
  curvature: number;
  point: Point;
  segment: MotionSegment;
  tangent: Point;
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const distance = (from: Point, to: Point) => Math.hypot(to.x - from.x, to.y - from.y);

function createLift(from: Point, to: Point, start: number): MotionSegment {
  const visualDistance = distance(from, to);
  const midpoint = {
    x: (from.x + to.x) / 2,
    y: Math.min(from.y, to.y) - Math.min(18, visualDistance * 0.18),
  };
  const points = Array.from({ length: 13 }, (_, index) => {
    const progress = index / 12;
    const inverse = 1 - progress;
    return {
      x: inverse * inverse * from.x + 2 * inverse * progress * midpoint.x + progress * progress * to.x,
      y: inverse * inverse * from.y + 2 * inverse * progress * midpoint.y + progress * progress * to.y,
    };
  });
  const physical = [0];
  for (let index = 1; index < points.length; index += 1) {
    physical.push(physical[index - 1] + distance(points[index - 1], points[index]));
  }
  const physicalLength = physical[physical.length - 1];
  const length = Math.min(32, Math.max(12, physicalLength * 0.25));
  return {
    cumulative: physical.map((value) => (value / physicalLength) * length),
    drawn: 0,
    kind: "lift",
    length,
    points,
    pressure: 0,
    start,
    tempo: 1,
  };
}

export function createSignatureTimeline(strokes: PreparedStroke[]) {
  const segments: MotionSegment[] = [];
  let start = 0;

  strokes.forEach((stroke, index) => {
    const segment: MotionSegment = { ...stroke, drawn: 0, kind: "ink", start };
    segments.push(segment);
    start += segment.length;
    const next = strokes[index + 1];
    if (next) {
      const lift = createLift(stroke.points[stroke.points.length - 1], next.points[0], start);
      segments.push(lift);
      start += lift.length;
    }
  });

  return { segments, totalLength: start };
}

export function pointAtDistance(segment: MotionSegment, target: number) {
  const targetDistance = clamp(target, 0, segment.length);
  let index = 1;
  while (index < segment.cumulative.length && segment.cumulative[index] < targetDistance) {
    index += 1;
  }
  const previousIndex = Math.max(0, index - 1);
  const nextIndex = Math.min(segment.points.length - 1, index);
  const fromDistance = segment.cumulative[previousIndex];
  const toDistance = segment.cumulative[nextIndex];
  const progress = toDistance === fromDistance ? 0 : (targetDistance - fromDistance) / (toDistance - fromDistance);
  const from = segment.points[previousIndex];
  const to = segment.points[nextIndex];
  const magnitude = Math.max(0.001, distance(from, to));

  return {
    point: {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
    },
    tangent: {
      x: (to.x - from.x) / magnitude,
      y: (to.y - from.y) / magnitude,
    },
  };
}

export function getMotionState(segments: MotionSegment[], distanceOnTimeline: number): MotionState {
  const segment =
    segments.find((candidate) => distanceOnTimeline <= candidate.start + candidate.length) ??
    segments[segments.length - 1];
  const localDistance = distanceOnTimeline - segment.start;
  const current = pointAtDistance(segment, localDistance);
  const before = pointAtDistance(segment, localDistance - 3).tangent;
  const after = pointAtDistance(segment, localDistance + 3).tangent;
  const dot = clamp(before.x * after.x + before.y * after.y, -1, 1);

  return {
    ...current,
    curvature: Math.acos(dot) / Math.PI,
    segment,
  };
}
