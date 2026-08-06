"use client";

import { useEffect, useRef, useState } from "react";
import { shooterPosition } from "./system-type-engine";
import {
  drawEffectSprite,
  drawIncidentSprite,
  drawShipSprite,
  loadSystemTypeSprites,
  type SystemTypeSprites,
} from "./system-type-sprites";
import type {
  SystemTypeBurst,
  SystemTypeShot,
  SystemTypeState,
  SystemTypeThreat,
} from "./system-type.types";

type Palette = {
  accent: string;
  background: string;
  border: string;
  error: string;
  foreground: string;
  font: string;
  muted: string;
};

function paletteFor(canvas: HTMLCanvasElement): Palette {
  const style = getComputedStyle(canvas);
  return {
    accent: style.getPropertyValue("--system-accent").trim() || "#157958",
    background: style.getPropertyValue("--system-bg").trim() || "#f7f7f5",
    border: style.getPropertyValue("--system-border").trim() || "#deded9",
    error: style.getPropertyValue("--system-error").trim() || "#b8473c",
    foreground: style.getPropertyValue("--system-fg").trim() || "#181816",
    font: style.fontFamily || "monospace",
    muted: style.getPropertyValue("--system-muted").trim() || "#666661",
  };
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number, palette: Palette, state: SystemTypeState) {
  context.save();
  context.strokeStyle = palette.border;
  context.lineWidth = 1;
  const pulse = Math.sin(state.elapsed / 430) * state.difficulty * 0.08;
  context.globalAlpha = 0.32 + state.difficulty * 0.14 + pulse;
  const spacing = Math.max(42, width / 20);
  for (let x = spacing; x < width; x += spacing) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = spacing; y < height; y += spacing) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.setLineDash([4, 8]);
  context.globalAlpha = 0.55;
  for (const lane of [0.23, 0.36, 0.5, 0.64, 0.77]) {
    context.beginPath();
    context.moveTo(width * 0.12, height * lane);
    context.lineTo(width * 0.96, height * lane);
    context.stroke();
  }
  context.restore();
}

function drawShooter(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: Palette,
  state: SystemTypeState,
  sprites: SystemTypeSprites | null,
) {
  const shooter = shooterPosition();
  const x = width * shooter.x;
  const y = height * shooter.y;
  const size = Math.max(38, Math.min(62, width * 0.045));
  const visibility = state.phase === "idle"
    ? 0.38
    : state.phase === "scanning" ? 0.38 + state.scanElapsed / 2400 * 0.62 : 1;
  if (sprites) {
    const shipState = state.health < 45
      ? "damaged"
      : state.shots.some((shot) => shot.age < 130) ? "firing" : "idle";
    context.save();
    context.globalAlpha = visibility;
    drawShipSprite(context, sprites, shipState, x, y, size * 3.35);
    context.restore();
    return;
  }
  context.save();
  context.globalAlpha = visibility;
  context.translate(x, y);
  context.strokeStyle = palette.foreground;
  context.fillStyle = palette.background;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(-size * 0.72, -size * 0.42);
  context.lineTo(size * 0.68, 0);
  context.lineTo(-size * 0.72, size * 0.42);
  context.lineTo(-size * 0.42, 0);
  context.closePath();
  context.fill();
  context.stroke();
  context.beginPath();
  context.rect(-size * 0.44, -size * 0.25, size * 0.48, size * 0.5);
  context.stroke();
  context.fillStyle = palette.accent;
  context.fillRect(-size * 0.29, -3, 6, 6);
  context.globalAlpha = 0.5;
  context.setLineDash([3, 5]);
  context.beginPath();
  context.moveTo(-size * 0.75, -size * 0.2);
  context.lineTo(-size * 1.55, -size * 0.2);
  context.moveTo(-size * 0.75, size * 0.2);
  context.lineTo(-size * 1.35, size * 0.2);
  context.stroke();
  context.restore();
}

function drawThreat(
  context: CanvasRenderingContext2D,
  threat: SystemTypeThreat,
  targeted: boolean,
  width: number,
  height: number,
  palette: Palette,
  sprites: SystemTypeSprites | null,
  elapsed: number,
  hasTarget: boolean,
) {
  const x = threat.x * width;
  const y = threat.lane * height;
  const size = threat.kind === "deadlock" ? 23 : 18;
  const tierScale = threat.tier === "critical" ? 1.15 : threat.tier === "elite" ? 1.07 : 1;
  const focusScale = targeted ? 1.08 : 1;
  const spriteSize = (threat.kind === "deadlock" ? 92 : 82) * tierScale * focusScale;
  const damage = threat.typed / threat.word.length;
  context.save();
  if (hasTarget && !targeted) context.globalAlpha = 0.58;
  if (sprites) {
    drawIncidentSprite(context, sprites, threat.kind, x, y, spriteSize, damage);
    if (damage >= 0.35) {
      context.save();
      context.globalAlpha = damage >= 0.7 ? 0.72 : 0.34;
      drawEffectSprite(context, sprites, 3, x + spriteSize * 0.12, y, spriteSize * (damage >= 0.7 ? 0.9 : 0.58));
      context.restore();
    }
    if (targeted) drawEffectSprite(context, sprites, 5, x, y, spriteSize * 1.18);
    if (threat.tier === "critical") {
      context.save();
      context.globalAlpha = 0.16 + (Math.sin(elapsed / 160) + 1) * 0.12;
      drawEffectSprite(context, sprites, 6, x, y, spriteSize * 1.45);
      context.restore();
    }
  } else {
    context.save();
    context.translate(x, y);
    context.strokeStyle = targeted ? palette.accent : palette.error;
    context.lineWidth = targeted ? 1.7 : 1.2;
    context.beginPath();
    context.rect(-size, -size, size * 2, size * 2);
    context.moveTo(-size - 6, -size + 5);
    context.lineTo(-size - 6, -size - 6);
    context.lineTo(-size + 5, -size - 6);
    context.moveTo(size + 6, size - 5);
    context.lineTo(size + 6, size + 6);
    context.lineTo(size - 5, size + 6);
    context.stroke();
    context.globalAlpha = 0.7;
    context.fillStyle = targeted ? palette.accent : palette.error;
    context.fillRect(-4, -4, 8, 8);
    for (let line = 0; line < 4; line += 1) {
      context.fillRect(size + 7 + line * 7, -8 + line * 5, 4 + line * 2, 1);
    }
    context.restore();
  }

  context.save();
  context.font = `${Math.max(12, Math.min(15, width / 95))}px ${palette.font}`;
  context.textAlign = "center";
  const label = threat.word.toUpperCase();
  const wordWidth = context.measureText(label).width;
  const textX = x - wordWidth / 2;
  const stagger = threat.id % 2 === 0 ? 0 : 7;
  const textY = y - (sprites ? spriteSize * 0.5 + 10 + stagger : size + 15);
  context.textAlign = "left";
  context.fillStyle = palette.accent;
  context.fillText(label.slice(0, threat.typed), textX, textY);
  const typedWidth = context.measureText(label.slice(0, threat.typed)).width;
  context.fillStyle = hasTarget && !targeted ? palette.muted : palette.foreground;
  context.fillText(label.slice(threat.typed), textX + typedWidth, textY);
  context.restore();
  context.restore();
}

function drawShot(context: CanvasRenderingContext2D, shot: SystemTypeShot, width: number, height: number, palette: Palette, sprites: SystemTypeSprites | null) {
  const shooter = shooterPosition();
  const progress = Math.min(1, shot.age / 150);
  const endX = width * (shooter.x + (shot.targetX - shooter.x) * progress);
  const endY = height * (shooter.y + (shot.targetY - shooter.y) * progress);
  context.save();
  context.strokeStyle = palette.accent;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(width * (shooter.x + 0.025), height * shooter.y);
  context.lineTo(endX, endY);
  context.stroke();
  if (sprites) {
    context.translate(endX, endY);
    context.rotate(Math.PI / 2);
    drawEffectSprite(context, sprites, 0, 0, 0, 34);
  } else {
    context.fillStyle = palette.accent;
    context.fillRect(endX - 2, endY - 2, 4, 4);
  }
  context.restore();
}

function drawBurst(context: CanvasRenderingContext2D, burst: SystemTypeBurst, width: number, height: number, palette: Palette, sprites: SystemTypeSprites | null) {
  const progress = burst.age / 520;
  context.save();
  context.translate(burst.x * width, burst.y * height);
  context.fillStyle = burst.tone === "success" ? palette.accent : palette.error;
  context.globalAlpha = 1 - progress;
  if (sprites) {
    drawEffectSprite(context, sprites, burst.tone === "success" ? 1 : 2, 0, 0, 54 + progress * 46);
    context.restore();
    return;
  }
  for (let index = 0; index < 11; index += 1) {
    const angle = (Math.PI * 2 * index) / 11;
    const radius = 8 + progress * 42;
    const size = index % 3 === 0 ? 4 : 2;
    context.fillRect(Math.cos(angle) * radius, Math.sin(angle) * radius, size, size);
  }
  context.restore();
}

function renderCanvas(canvas: HTMLCanvasElement, state: SystemTypeState, sprites: SystemTypeSprites | null) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const palette = paletteFor(canvas);
  context.clearRect(0, 0, width, height);
  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);
  const recentDanger = state.feedback?.tone === "danger" && state.elapsed - state.feedback.at < 320;
  if (recentDanger) context.translate(Math.sin(state.elapsed * 0.17) * 2.5, Math.cos(state.elapsed * 0.13) * 1.5);
  drawGrid(context, width, height, palette, state);
  state.shots.forEach((shot) => drawShot(context, shot, width, height, palette, sprites));
  state.threats.forEach((threat) => drawThreat(
    context,
    threat,
    threat.id === state.targetId,
    width,
    height,
    palette,
    sprites,
    state.elapsed,
    state.targetId !== null,
  ));
  state.bursts.forEach((burst) => drawBurst(context, burst, width, height, palette, sprites));
  drawShooter(context, width, height, palette, state, sprites);
  if (state.phase === "scanning") {
    const progress = state.scanElapsed / 2400;
    const scanX = width * (0.08 + progress * 0.84);
    context.save();
    context.strokeStyle = palette.accent;
    context.globalAlpha = 0.65;
    context.beginPath();
    context.moveTo(scanX, height * 0.12);
    context.lineTo(scanX, height * 0.88);
    context.stroke();
    context.restore();
  }
}

export function SystemTypeCanvas({ state }: { state: SystemTypeState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<SystemTypeSprites | null>(null);
  const stateRef = useRef(state);
  const spritesRef = useRef(sprites);
  stateRef.current = state;
  spritesRef.current = sprites;

  useEffect(() => {
    let active = true;
    loadSystemTypeSprites().then((loaded) => {
      if (active) setSprites(loaded);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => renderCanvas(canvas, stateRef.current, spritesRef.current));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) renderCanvas(canvas, state, sprites);
  }, [sprites, state]);

  return (
    <canvas
      aria-label={`${state.threats.length} software incidents approaching from the right`}
      className="system-type-canvas"
      ref={canvasRef}
      role="img"
    />
  );
}
