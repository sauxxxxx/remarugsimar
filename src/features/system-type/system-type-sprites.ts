import type { SystemTypeThreatKind } from "./system-type.types";

export type SystemTypeSprites = {
  effects: HTMLImageElement;
  incidents: HTMLImageElement;
  ship: HTMLImageElement;
};

const INCIDENT_FRAMES: Record<SystemTypeThreatKind, readonly [number, number]> = {
  timeout: [0, 0],
  deadlock: [1, 0],
  memory: [2, 0],
  rollback: [0, 1],
  runtime: [1, 1],
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load SYSTEM.TYPE sprite: ${source}`));
    image.src = source;
  });
}

export async function loadSystemTypeSprites(): Promise<SystemTypeSprites> {
  const [effects, incidents, ship] = await Promise.all([
    loadImage("/games/system-type/effects-atlas.png"),
    loadImage("/games/system-type/incident-atlas.png"),
    loadImage("/games/system-type/ship-atlas.png"),
  ]);
  return { effects, incidents, ship };
}

function drawFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  columns: number,
  rows: number,
  column: number,
  row: number,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const frameWidth = image.naturalWidth / columns;
  const frameHeight = image.naturalHeight / rows;
  context.drawImage(
    image,
    column * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    x - width / 2,
    y - height / 2,
    width,
    height,
  );
}

export function drawShipSprite(
  context: CanvasRenderingContext2D,
  sprites: SystemTypeSprites,
  state: "damaged" | "firing" | "idle",
  x: number,
  y: number,
  width: number,
) {
  const frame = state === "firing" ? [1, 0] : state === "damaged" ? [0, 1] : [0, 0];
  drawFrame(context, sprites.ship, 2, 2, frame[0], frame[1], x, y, width, width * 0.62);
}

export function drawIncidentSprite(
  context: CanvasRenderingContext2D,
  sprites: SystemTypeSprites,
  kind: SystemTypeThreatKind,
  x: number,
  y: number,
  size: number,
  damage: number,
) {
  const [column, row] = INCIDENT_FRAMES[kind];
  const width = size * 1.35;
  if (damage < 0.35) {
    drawFrame(context, sprites.incidents, 3, 2, column, row, x, y, width, size);
    return;
  }

  const image = sprites.incidents;
  const frameWidth = image.naturalWidth / 3;
  const frameHeight = image.naturalHeight / 2;
  const separation = damage < 0.7 ? 2.5 : 5 + damage * 5;
  const alpha = damage < 0.7 ? 0.96 : 0.84;
  context.save();
  context.globalAlpha = alpha;
  for (let rowPart = 0; rowPart < 2; rowPart += 1) {
    for (let columnPart = 0; columnPart < 2; columnPart += 1) {
      const directionX = columnPart === 0 ? -1 : 1;
      const directionY = rowPart === 0 ? -1 : 1;
      context.drawImage(
        image,
        column * frameWidth + columnPart * frameWidth / 2,
        row * frameHeight + rowPart * frameHeight / 2,
        frameWidth / 2,
        frameHeight / 2,
        x - width / 2 + columnPart * width / 2 + directionX * separation,
        y - size / 2 + rowPart * size / 2 + directionY * separation,
        width / 2,
        size / 2,
      );
    }
  }
  context.restore();
}

export function drawEffectSprite(
  context: CanvasRenderingContext2D,
  sprites: SystemTypeSprites,
  frame: number,
  x: number,
  y: number,
  size: number,
) {
  drawFrame(context, sprites.effects, 4, 2, frame % 4, Math.floor(frame / 4), x, y, size, size);
}
