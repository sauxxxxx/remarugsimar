import { type Point } from "@/features/entrance/signature-strokes";
import {
  type MotionSegment,
  pointAtDistance,
} from "@/features/entrance/signature-timeline";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

function drawInkSegment(
  context: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  width: number,
  seed: number,
  curvature: number,
  ending: boolean,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
  const grainNoise = noise(seed);
  const grain = (grainNoise - 0.5) * width * 0.16;
  const dryOpacity = grainNoise < 0.07 ? 0.62 : 0.84 + grainNoise * 0.1;

  context.strokeStyle = `rgba(23, 23, 23, ${dryOpacity})`;
  context.lineCap = "round";
  context.lineWidth = width * (0.97 + grainNoise * 0.06);
  context.beginPath();
  context.moveTo(from.x + normal.x * grain, from.y + normal.y * grain);
  context.lineTo(to.x + normal.x * grain, to.y + normal.y * grain);
  context.stroke();

  context.strokeStyle = "rgba(23, 23, 23, 0.17)";
  context.lineWidth = Math.max(0.45, width * 0.15);
  context.beginPath();
  context.moveTo(from.x - normal.x * width * 0.3, from.y - normal.y * width * 0.3);
  context.lineTo(to.x - normal.x * width * 0.3, to.y - normal.y * width * 0.3);
  context.stroke();

  const speckleThreshold = ending ? 0.91 : 0.975 - curvature * 0.08;
  if (grainNoise > speckleThreshold) {
    const side = noise(seed + 17) > 0.5 ? 1 : -1;
    const offset = width * (0.7 + noise(seed + 29) * 0.85) * side;
    context.fillStyle = `rgba(23, 23, 23, ${0.12 + noise(seed + 41) * 0.2})`;
    context.beginPath();
    context.arc(
      to.x + normal.x * offset,
      to.y + normal.y * offset,
      Math.max(0.3, width * (0.035 + noise(seed + 53) * 0.045)),
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

export function paintSignatureUntil(
  context: CanvasRenderingContext2D,
  segments: MotionSegment[],
  timelineDistance: number,
  baseWidth: number,
) {
  segments.forEach((segment, segmentIndex) => {
    if (
      segment.kind === "lift" ||
      timelineDistance <= segment.start ||
      segment.drawn >= segment.length
    ) {
      return;
    }

    const target = Math.min(segment.length, timelineDistance - segment.start);
    let cursor = segment.drawn;
    let previous = pointAtDistance(segment, cursor).point;

    while (cursor < target) {
      const nextDistance = Math.min(target, cursor + 2);
      const before = pointAtDistance(segment, Math.max(0, nextDistance - 2));
      const current = pointAtDistance(segment, nextDistance);
      const after = pointAtDistance(segment, Math.min(segment.length, nextDistance + 2));
      const tangentDot = clamp(
        before.tangent.x * after.tangent.x + before.tangent.y * after.tangent.y,
        -1,
        1,
      );
      const curvature = Math.acos(tangentDot) / Math.PI;
      const progress = segment.length ? nextDistance / segment.length : 1;
      const startTaper = clamp(progress / 0.08);
      const endTaper = clamp((1 - progress) / 0.11);
      const envelope = 0.34 + 0.66 * Math.min(startTaper, endTaper);
      const downstroke = 0.72 + Math.max(0, current.tangent.y) * 0.43;
      const tempoInk = 0.92 + segment.tempo * 0.08;
      const pressure = segment.pressure * envelope * downstroke * tempoInk;

      drawInkSegment(
        context,
        previous,
        current.point,
        baseWidth * pressure,
        segmentIndex * 101 + nextDistance,
        curvature,
        progress > 0.9,
      );
      previous = current.point;
      cursor = nextDistance;
    }
    segment.drawn = target;
  });
}
