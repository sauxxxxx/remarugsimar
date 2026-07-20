import type { Point } from "@/features/entrance/signature-strokes";

type FeatherOptions = {
  alpha: number;
  baseWidth: number;
  point: Point;
};

const FEATHER_SOURCE = "/entrance/signature-quill.png";
const SOURCE_ASPECT_RATIO = 2 / 3;
const NIB_X_RATIO = 0.205;
const NIB_Y_RATIO = 0.963;

export function createSignatureFeatherImage() {
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = "high";
  image.src = FEATHER_SOURCE;
  return image;
}

export function drawSignatureFeather(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  { alpha, baseWidth, point }: FeatherOptions,
) {
  if (alpha <= 0 || !image.complete || image.naturalWidth === 0) return;

  const featherHeight = Math.min(156, Math.max(112, baseWidth * 28));
  const featherWidth = featherHeight * SOURCE_ASPECT_RATIO;
  const left = point.x - featherWidth * NIB_X_RATIO;
  const top = point.y - featherHeight * NIB_Y_RATIO;

  context.save();
  context.globalAlpha = alpha;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, left, top, featherWidth, featherHeight);
  context.restore();
}
