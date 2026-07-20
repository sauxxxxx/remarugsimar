export type Point = { x: number; y: number };

export type PreparedStroke = {
  cumulative: number[];
  length: number;
  points: Point[];
  pressure: number;
  tempo: number;
};

export type SignatureGeometry = {
  baseWidth: number;
  strokes: PreparedStroke[];
};

type StrokeDefinition = {
  points: Point[];
  pressure?: number;
  tempo?: number;
};

const DESIGN_WIDTH = 760;
const DESIGN_HEIGHT = 150;

const strokes: StrokeDefinition[] = [
  // R
  { points: [{ x: 17, y: 25 }, { x: 14, y: 52 }, { x: 12, y: 79 }, { x: 10, y: 108 }], pressure: 1.08, tempo: 1.2 },
  { points: [{ x: 15, y: 28 }, { x: 43, y: 20 }, { x: 69, y: 29 }, { x: 67, y: 47 }, { x: 53, y: 58 }, { x: 17, y: 59 }], tempo: 1.14 },
  { points: [{ x: 43, y: 58 }, { x: 55, y: 72 }, { x: 70, y: 91 }, { x: 82, y: 106 }], pressure: 1.04, tempo: 0.94 },
  // e
  { points: [{ x: 82, y: 96 }, { x: 96, y: 82 }, { x: 116, y: 79 }, { x: 119, y: 87 }, { x: 105, y: 94 }, { x: 89, y: 91 }, { x: 99, y: 105 }, { x: 126, y: 99 }], tempo: 1.06 },
  // m
  { points: [{ x: 126, y: 99 }, { x: 134, y: 74 }, { x: 135, y: 101 }, { x: 147, y: 77 }, { x: 163, y: 74 }, { x: 164, y: 101 }, { x: 177, y: 77 }, { x: 194, y: 75 }, { x: 199, y: 100 }, { x: 209, y: 96 }], tempo: 0.96 },
  // a
  { points: [{ x: 209, y: 96 }, { x: 217, y: 77 }, { x: 236, y: 72 }, { x: 250, y: 80 }, { x: 247, y: 99 }, { x: 229, y: 103 }, { x: 214, y: 94 }, { x: 221, y: 77 }], tempo: 1.1 },
  { points: [{ x: 248, y: 76 }, { x: 248, y: 100 }, { x: 262, y: 96 }], tempo: 0.86 },
  // r
  { points: [{ x: 262, y: 97 }, { x: 270, y: 75 }, { x: 271, y: 100 }, { x: 282, y: 78 }, { x: 298, y: 74 }, { x: 309, y: 83 }], tempo: 0.9 },
  // U
  { points: [{ x: 355, y: 28 }, { x: 354, y: 62 }, { x: 358, y: 91 }, { x: 373, y: 105 }, { x: 395, y: 104 }, { x: 411, y: 91 }, { x: 416, y: 62 }, { x: 418, y: 29 }], pressure: 1.08, tempo: 1.2 },
  // g
  { points: [{ x: 421, y: 96 }, { x: 429, y: 77 }, { x: 448, y: 72 }, { x: 463, y: 81 }, { x: 459, y: 100 }, { x: 441, y: 103 }, { x: 426, y: 94 }, { x: 434, y: 77 }], tempo: 1.08 },
  { points: [{ x: 461, y: 76 }, { x: 460, y: 105 }, { x: 455, y: 132 }, { x: 443, y: 144 }, { x: 427, y: 139 }, { x: 438, y: 128 }, { x: 465, y: 121 }, { x: 477, y: 113 }], tempo: 1.16 },
  // s
  { points: [{ x: 519, y: 78 }, { x: 506, y: 70 }, { x: 488, y: 74 }, { x: 482, y: 84 }, { x: 495, y: 91 }, { x: 514, y: 94 }, { x: 518, y: 102 }, { x: 503, y: 108 }, { x: 484, y: 102 }], tempo: 1.1 },
  // i + dot
  { points: [{ x: 525, y: 80 }, { x: 526, y: 103 }, { x: 541, y: 98 }], tempo: 0.82 },
  { points: [{ x: 526, y: 62 }, { x: 526.5, y: 62.4 }], pressure: 1.2, tempo: 1.2 },
  // m
  { points: [{ x: 541, y: 98 }, { x: 549, y: 74 }, { x: 550, y: 101 }, { x: 562, y: 77 }, { x: 578, y: 74 }, { x: 580, y: 101 }, { x: 592, y: 77 }, { x: 608, y: 75 }, { x: 613, y: 100 }, { x: 624, y: 96 }], tempo: 0.96 },
  // a
  { points: [{ x: 624, y: 96 }, { x: 632, y: 77 }, { x: 651, y: 72 }, { x: 665, y: 80 }, { x: 662, y: 99 }, { x: 644, y: 103 }, { x: 629, y: 94 }, { x: 636, y: 77 }], tempo: 1.1 },
  { points: [{ x: 663, y: 76 }, { x: 663, y: 100 }, { x: 677, y: 96 }], tempo: 0.86 },
  // r
  { points: [{ x: 677, y: 97 }, { x: 685, y: 75 }, { x: 686, y: 100 }, { x: 697, y: 78 }, { x: 713, y: 74 }, { x: 725, y: 83 }, { x: 742, y: 92 }], tempo: 0.9 },
];

const distance = (from: Point, to: Point) => Math.hypot(to.x - from.x, to.y - from.y);

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function sampleStroke(points: Point[], scale: number, offsetX: number, offsetY: number) {
  const transformed = points.map((point) => ({
    x: offsetX + (point.x + (100 - point.y) * 0.065) * scale,
    y: offsetY + point.y * scale,
  }));
  const sampled: Point[] = [transformed[0]];

  for (let index = 0; index < transformed.length - 1; index += 1) {
    const p0 = transformed[Math.max(0, index - 1)];
    const p1 = transformed[index];
    const p2 = transformed[index + 1];
    const p3 = transformed[Math.min(transformed.length - 1, index + 2)];
    const steps = Math.max(3, Math.ceil(distance(p1, p2) / 2.5));

    for (let step = 1; step <= steps; step += 1) {
      sampled.push(catmullRom(p0, p1, p2, p3, step / steps));
    }
  }

  return sampled;
}

export function prepareSignatureGeometry(width: number, height: number): SignatureGeometry {
  const scale = Math.min((width - 48) / DESIGN_WIDTH, (height * 0.34) / DESIGN_HEIGHT, 1.45);
  const offsetX = (width - DESIGN_WIDTH * scale) / 2;
  const offsetY = (height - DESIGN_HEIGHT * scale) / 2;
  const prepared = strokes.map((stroke): PreparedStroke => {
    const points = sampleStroke(stroke.points, scale, offsetX, offsetY);
    const cumulative = [0];
    for (let index = 1; index < points.length; index += 1) {
      cumulative.push(
        cumulative[index - 1] + distance(points[index - 1], points[index]) * (stroke.tempo ?? 1),
      );
    }
    return {
      cumulative,
      length: cumulative[cumulative.length - 1],
      points,
      pressure: stroke.pressure ?? 1,
      tempo: stroke.tempo ?? 1,
    };
  });

  return {
    baseWidth: Math.max(2.6, 6.2 * scale),
    strokes: prepared,
  };
}
