import { paintSignatureUntil } from "@/features/entrance/signature-ink";
import {
  createSignatureFeatherImage,
  drawSignatureFeather,
} from "@/features/entrance/signature-feather";
import { type Point, prepareSignatureGeometry } from "@/features/entrance/signature-strokes";
import {
  type MotionSegment,
  createSignatureTimeline,
  getMotionState,
} from "@/features/entrance/signature-timeline";

type Bristle = {
  alpha: number;
  lag: number;
  normal: number;
  phase: number;
  size: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type ParticleSignatureOptions = { onComplete: () => void };

const GATHER_START = 1000;
const WRITE_START = 1750;
const WRITE_END = 5400;
const REVEAL_START = 5850;
const EXIT_END = 6600;
const INK = "#171717";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const easeInOut = (value: number) => {
  const progress = clamp(value);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

function createBristles(width: number, height: number) {
  const count = width < 600 ? 140 : 205;
  return Array.from({ length: count }, (): Bristle => {
    const rawNormal = Math.random() * 2 - 1;
    return {
      alpha: 0.3 + Math.random() * 0.62,
      lag: Math.pow(Math.random(), 2.15) * 16,
      normal: Math.sign(rawNormal) * Math.pow(Math.abs(rawNormal), 1.65),
      phase: Math.random() * Math.PI * 2,
      size: 0.45 + Math.random() * 1.15,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      x: Math.random() * width,
      y: Math.random() * height,
    };
  });
}

function drawBrush(
  context: CanvasRenderingContext2D,
  bristles: Bristle[],
  point: Point,
  tangent: Point,
  baseWidth: number,
  visibleCore: boolean,
) {
  const rotation = Math.atan2(tangent.y, tangent.x);
  context.fillStyle = INK;

  if (visibleCore) {
    context.save();
    context.translate(point.x - tangent.x * 1.5, point.y - tangent.y * 1.5);
    context.rotate(rotation);
    context.globalAlpha = 0.55;
    context.beginPath();
    context.ellipse(0, 0, baseWidth * 0.9, baseWidth * 0.48, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  bristles.forEach((bristle) => {
    context.save();
    context.translate(bristle.x, bristle.y);
    context.rotate(rotation);
    context.globalAlpha = bristle.alpha;
    context.beginPath();
    context.ellipse(0, 0, bristle.size * 1.9, bristle.size * 0.55, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
  context.globalAlpha = 1;
}

export function startParticleSignature(
  canvas: HTMLCanvasElement,
  { onComplete }: ParticleSignatureOptions,
) {
  const context = canvas.getContext("2d");
  const inkCanvas = document.createElement("canvas");
  const inkContext = inkCanvas.getContext("2d");
  if (!context || !inkContext) return () => undefined;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let baseWidth = 5;
  let segments: MotionSegment[] = [];
  let totalLength = 1;
  let bristles = createBristles(width, height);
  let animationFrame = 0;
  let revealStarted = false;
  let previousFrame = performance.now();
  let elapsedOnResize = 0;
  const featherImage = createSignatureFeatherImage();
  const startedAt = previousFrame;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    [canvas, inkCanvas].forEach((surface) => {
      surface.width = Math.round(width * density);
      surface.height = Math.round(height * density);
    });
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(density, 0, 0, density, 0, 0);
    inkContext.setTransform(density, 0, 0, density, 0, 0);

    const geometry = prepareSignatureGeometry(width, height);
    const timeline = createSignatureTimeline(geometry.strokes);
    baseWidth = geometry.baseWidth;
    segments = timeline.segments;
    totalLength = timeline.totalLength;
    bristles = createBristles(width, height);

    if (elapsedOnResize > WRITE_START) {
      const progress = clamp((elapsedOnResize - WRITE_START) / (WRITE_END - WRITE_START));
      paintSignatureUntil(inkContext, segments, progress * totalLength, baseWidth);
    }
  };

  const frame = (now: number) => {
    const elapsed = now - startedAt;
    elapsedOnResize = elapsed;
    const frameScale = Math.min(2, (now - previousFrame) / 16.667);
    previousFrame = now;
    context.clearRect(0, 0, width, height);

    const writeProgress = clamp((elapsed - WRITE_START) / (WRITE_END - WRITE_START));
    const timelineDistance = elapsed >= WRITE_START ? writeProgress * totalLength : 0;
    if (elapsed >= WRITE_START) {
      paintSignatureUntil(inkContext, segments, timelineDistance, baseWidth);
    }
    context.drawImage(inkCanvas, 0, 0, width, height);

    const first = getMotionState(segments, 0);
    const current = getMotionState(segments, timelineDistance);
    const gathering = elapsed >= GATHER_START && elapsed < WRITE_START;
    const exiting = elapsed >= REVEAL_START;
    const brush = elapsed >= WRITE_START ? current : first;
    const gatherProgress = gathering
      ? easeInOut((elapsed - GATHER_START) / (WRITE_START - GATHER_START))
      : 0;
    const normal = { x: -brush.tangent.y, y: brush.tangent.x };
    const curveCompression = 1 - clamp(brush.curvature * 2.6, 0, 0.52);

    bristles.forEach((bristle) => {
      if (elapsed < GATHER_START) {
        bristle.x = (bristle.x + bristle.vx * frameScale + width) % width;
        bristle.y = (bristle.y + bristle.vy * frameScale + height) % height;
        return;
      }

      if (exiting) {
        const outwardX = bristle.x - brush.point.x;
        const outwardY = bristle.y - brush.point.y;
        const magnitude = Math.max(1, Math.hypot(outwardX, outwardY));
        bristle.vx += (outwardX / magnitude + Math.cos(bristle.phase) * 0.8) * 0.055 * frameScale;
        bristle.vy += (outwardY / magnitude + Math.sin(bristle.phase) * 0.8) * 0.055 * frameScale;
        bristle.vx *= Math.pow(0.985, frameScale);
        bristle.vy *= Math.pow(0.985, frameScale);
        bristle.x += bristle.vx * frameScale;
        bristle.y += bristle.vy * frameScale;
        bristle.alpha *= Math.pow(0.973, frameScale);
        return;
      }

      const taper = 0.28 + bristle.lag / 16;
      const spread = baseWidth * 0.72 * taper * curveCompression;
      const flutter = Math.sin(elapsed * 0.006 + bristle.phase) * 0.45;
      const target = {
        x: brush.point.x - brush.tangent.x * bristle.lag + normal.x * (bristle.normal * spread + flutter),
        y: brush.point.y - brush.tangent.y * bristle.lag + normal.y * (bristle.normal * spread + flutter),
      };
      const stiffness = gathering ? 0.035 + gatherProgress * 0.16 : 0.22;
      const damping = Math.pow(gathering ? 0.78 : 0.66, frameScale);
      bristle.vx = (bristle.vx + (target.x - bristle.x) * stiffness * frameScale) * damping;
      bristle.vy = (bristle.vy + (target.y - bristle.y) * stiffness * frameScale) * damping;
      bristle.x += bristle.vx * frameScale;
      bristle.y += bristle.vy * frameScale;
    });

    drawBrush(context, bristles, brush.point, brush.tangent, baseWidth, !exiting);

    const featherArrival = clamp((elapsed - (WRITE_START - 320)) / 320);
    const featherDeparture = exiting
      ? 1 - clamp((elapsed - REVEAL_START) / (EXIT_END - REVEAL_START))
      : 1;
    drawSignatureFeather(context, featherImage, {
      alpha: featherArrival * featherDeparture * 0.86,
      baseWidth,
      point: brush.point,
    });

    if (elapsed >= REVEAL_START && !revealStarted) {
      revealStarted = true;
      onComplete();
    }
    if (elapsed >= EXIT_END) return;
    animationFrame = window.requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener("resize", resize);
  animationFrame = window.requestAnimationFrame(frame);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
  };
}
