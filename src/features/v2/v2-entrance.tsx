"use client";

import gsap from "gsap";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RU_BOTTOM_ARC, RU_CENTER, RU_STEM, RU_TOP_ARC, RU_VIEW_BOX } from "./brand/ru-mark";
import styles from "./v2-entrance.module.css";

const VIEW_WIDTH = Number(RU_VIEW_BOX.split(" ")[2]);

// The mark is drawn with mix-blend-mode: difference over the cream iris (#f2f1eb),
// so its fill reads as (cream - fill) on cream and as the fill itself on black.
const FILL_INK_ON_CREAM = "#d1d0ca";
const FILL_HEADER_INK = "#f2f1ed";
const FLIGHT = 1.9;
const LOCK = 2;
const SAMPLES = 120;
// Each piece enters from off-screen past its edge: stem left, top arc top, bottom arc right.
const PIECES = [
  { name: "stem", startAngle: Math.PI, delay: 0 },
  { name: "top-arc", startAngle: -Math.PI / 2, delay: 0.07 },
  { name: "bottom-arc", startAngle: 0, delay: 0.14 },
] as const;

type Point = { x: number; y: number };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const rotatePoint = (point: Point, angle: number): Point => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
});

function lerpAngle(from: number, to: number, amount: number) {
  const turn = Math.PI * 2;
  const difference = ((((to - from + Math.PI) % turn) + turn) % turn) - Math.PI;
  return from + difference * amount;
}

// Evenly spaced outline points, re-ordered to start at one tip of the crescent.
function sampleOutline(path: SVGPathElement) {
  const length = path.getTotalLength();
  const raw = Array.from({ length: SAMPLES }, (_, index) => {
    const point = path.getPointAtLength((length * index) / SAMPLES);
    return { x: point.x, y: point.y };
  });
  const centroid = raw.reduce((sum, point) => ({ x: sum.x + point.x / SAMPLES, y: sum.y + point.y / SAMPLES }), { x: 0, y: 0 });
  const furthestFrom = (from: Point) => raw.reduce((best, point, index) =>
    Math.hypot(point.x - from.x, point.y - from.y) > Math.hypot(raw[best].x - from.x, raw[best].y - from.y) ? index : best, 0);

  const tipA = furthestFrom(centroid);
  const tipB = furthestFrom(raw[tipA]);
  const points = [...raw.slice(tipA), ...raw.slice(0, tipA)].map((point) => ({ x: point.x - centroid.x, y: point.y - centroid.y }));
  const split = (tipB - tipA + SAMPLES) % SAMPLES;
  const axis = { x: points[split].x - points[0].x, y: points[split].y - points[0].y };
  // Both edges of a crescent bulge the same way, so compare the A-to-B half with the
  // B-to-A half to find which one lies further to the +y side of the tip-to-tip axis.
  const offAxis = (point: Point) => (axis.x * (point.y - points[0].y) - axis.y * (point.x - points[0].x)) / Math.hypot(axis.x, axis.y);
  const average = (list: Point[]) => list.reduce((sum, point) => sum + offAxis(point), 0) / Math.max(1, list.length);
  const side = Math.sign(average(points.slice(1, split)) - average(points.slice(split + 1))) || 1;
  // Which way the crescent as a whole bows away from its tip-to-tip axis.
  const bulge = Math.sign(average(points.slice(1))) || 1;

  return { points, centroid, split, side, bulge, axisAngle: Math.atan2(axis.y, axis.x), span: Math.hypot(axis.x, axis.y) };
}

// A thick ink ribbon with one soft bend, stretched along its flight and gently flexing.
// Same point count and tip alignment as the crescent outline, and it bows the same way.
function ribbonPoints(outline: { split: number; side: number; bulge: number; span: number }, time: number, phase: number): Point[] {
  const { split, side, bulge, span } = outline;
  const length = span * 1.15;
  const bend = bulge * length * (0.12 + 0.06 * Math.sin(time * 4 + phase));
  const at = (along: number, edge: number) => {
    const ripple = length * 0.025 * Math.sin(along * Math.PI * 2 - time * 5 + phase);
    const half = 17 * Math.sin(Math.PI * along) ** 0.55 + 1;
    return { x: (along - 0.5) * length, y: bend * Math.sin(Math.PI * along) + ripple + edge * side * half };
  };
  return Array.from({ length: SAMPLES }, (_, index) =>
    index <= split ? at(index / split, 1) : at(1 - (index - split) / (SAMPLES - split), -1));
}

// Closed Catmull-Rom spline through the points, as cubic Beziers.
function smoothClosedPath(points: Point[]) {
  const count = points.length;
  let path = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let index = 0; index < count; index += 1) {
    const p0 = points[(index - 1 + count) % count];
    const p1 = points[index];
    const p2 = points[(index + 1) % count];
    const p3 = points[(index + 2) % count];
    path += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(2)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(2)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(2)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return `${path}Z`;
}

type DockTarget = { x: number; y: number; scale: number } | null;

function measureDockTarget(frame: HTMLElement): DockTarget {
  const target = Array.from(document.querySelectorAll<SVGElement>("[data-v2-brand-mark] svg"))
    .find((element) => element.getBoundingClientRect().width > 0);
  if (!target) return null;

  const to = target.getBoundingClientRect();
  const from = frame.getBoundingClientRect();
  // The hero rests 10px low while the entrance is pending; land where it settles.
  const section = target.closest("section");
  const transform = section ? getComputedStyle(section).transform : "none";
  const settleY = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;

  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - settleY - (from.top + from.height / 2),
    scale: to.width / from.width,
  };
}

export function V2Entrance() {
  const [exiting, setExiting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);
  const glintClipId = `${useId()}-glint-clip`;
  const glintGradientId = `${useId()}-glint-gradient`;

  const finish = useCallback((skipped = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    timelineRef.current?.kill();

    const complete = () => {
      document.documentElement.dataset.v2Entrance = "complete";
      const main = document.querySelector<HTMLElement>("#v2-main");
      if (main) main.inert = false;
    };

    if (!skipped) {
      complete();
      return;
    }

    setExiting(true);
    window.setTimeout(complete, 180);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    if (root.dataset.v2Entrance !== "pending" || !overlay) return;

    const main = document.querySelector<HTMLElement>("#v2-main");
    if (main) main.inert = true;

    const ctx = gsap.context(() => {
      const frame = overlay.querySelector<HTMLElement>("[data-intro='frame']");
      if (!frame) return;

      const box = frame.getBoundingClientRect();
      const unit = box.width / VIEW_WIDTH;
      const center = `${RU_CENTER.x} ${RU_CENTER.y}`;
      let dock: DockTarget = null;

      const pieces = PIECES.flatMap(({ name, startAngle, delay }, index) => {
        const path = overlay.querySelector<SVGPathElement>(`path[data-intro='${name}']`);
        if (!path) return [];

        const outline = sampleOutline(path);
        const offset = { x: outline.centroid.x - RU_CENTER.x, y: outline.centroid.y - RU_CENTER.y };
        const endAngle = Math.atan2(offset.y, offset.x);
        const endRadius = Math.hypot(offset.x, offset.y);
        // Sweep clockwise round the centre at least three quarters of a turn.
        let sweep = (((endAngle - startAngle) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (sweep < Math.PI * 1.5) sweep += Math.PI * 2;
        const margin = outline.span * 0.6 + 40;

        return [{
          path,
          finalPath: path.getAttribute("d") ?? "",
          outline,
          delay,
          phase: index * 2.1,
          startAngle,
          sweep,
          endAngle,
          endRadius,
          startRadiusX: window.innerWidth / 2 / unit + margin,
          startRadiusY: window.innerHeight / 2 / unit + margin,
        }];
      });

      const angleEase = gsap.parseEase("back.out(0.8)");
      const formEase = gsap.parseEase("power2.inOut");
      const flight = { time: 0 };

      // Where a piece's centre is on its inward spiral at progress u. The angle starts from
      // rest, so each piece first comes straight in from the middle of its own edge before
      // curving into the swirl; the wobble is zero at both ends for the same reason.
      const spiral = (piece: (typeof pieces)[number], u: number) => {
        const angle = piece.startAngle + piece.sweep * angleEase(u ** 2.5);
        const shrink = 1 - (1 - u) ** 2.4;
        const wobble = 1 + 0.32 * Math.sin(u * Math.PI * 4 + piece.phase) * u * (1 - u);
        const radiusX = (piece.endRadius + (piece.startRadiusX - piece.endRadius) * (1 - shrink)) * wobble;
        const radiusY = (piece.endRadius + (piece.startRadiusY - piece.endRadius) * (1 - shrink)) * wobble;
        return { angle, x: RU_CENTER.x + Math.cos(angle) * radiusX, y: RU_CENTER.y + Math.sin(angle) * radiusY };
      };

      // Each frame: a liquid ribbon flies round the centre and curls into its crescent.
      const render = () => {
        pieces.forEach((piece) => {
          const u = clamp01((flight.time - piece.delay) / (FLIGHT - 0.14));
          const position = spiral(piece, u);
          const ahead = spiral(piece, Math.min(1, u + 0.01));
          const heading = u < 1 ? Math.atan2(ahead.y - position.y, ahead.x - position.x) : 0;
          const form = formEase(clamp01((u - 0.4) / 0.5));
          const spin = position.angle - piece.endAngle;
          const worm = ribbonPoints(piece.outline, flight.time, piece.phase);
          const wormAngle = lerpAngle(heading, spin + piece.outline.axisAngle, form);

          const points = piece.outline.points.map((target, index) => {
            const from = rotatePoint(worm[index], wormAngle);
            const to = rotatePoint(target, spin);
            return { x: position.x + from.x + (to.x - from.x) * form, y: position.y + from.y + (to.y - from.y) * form };
          });
          piece.path.setAttribute("d", smoothClosedPath(points));
        });
      };

      render();
      gsap.set("[data-intro='pieces']", { fill: FILL_INK_ON_CREAM });
      gsap.set("[data-intro='pulse']", { svgOrigin: center });
      gsap.set("[data-intro='glint']", { x: -40 });
      gsap.set("[data-intro='iris']", { "--iris-radius": 150 });
      gsap.set(frame, { visibility: "visible" });

      // A short delay lets hydration finish first, so the flight doesn't stutter.
      const timeline = gsap.timeline({ delay: 0.3, onComplete: () => finish(false) });
      timelineRef.current = timeline;

      timeline
        .to(flight, {
          time: FLIGHT,
          duration: FLIGHT,
          ease: "none",
          onUpdate: render,
          // Land on the exact logo paths.
          onComplete: () => pieces.forEach(({ path, finalPath }) => path.setAttribute("d", finalPath)),
        }, 0)
        // Lock beat.
        .to("[data-intro='pulse']", { scale: 1.03, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, LOCK)
        .to("[data-intro='glint']", { x: 560, duration: 0.6, ease: "power2.inOut" }, LOCK)
        // The cream closes like an iris, inverting the mark as it passes over it.
        .call(() => { overlay.dataset.surface = "dark"; }, undefined, LOCK + 0.6)
        .to("[data-intro='iris']", { "--iris-radius": 0, duration: 0.6, ease: "power2.inOut" }, LOCK + 0.35)
        .to("[data-intro='pieces']", { fill: FILL_HEADER_INK, duration: 0.25, ease: "power1.out" }, LOCK + 0.85)
        // Dock into the header while the page fades up underneath. The frame's transform
        // isolates the mark's blend mode, so this must wait until the iris has closed.
        .call(() => {
          dock = measureDockTarget(frame);
          root.dataset.v2Entrance = "revealing";
        }, undefined, LOCK + 1.1)
        .to(overlay, { backgroundColor: "rgba(0, 0, 0, 0)", duration: 0.55, ease: "power2.inOut" }, LOCK + 1.1)
        .to(frame, {
          x: () => dock?.x ?? 0,
          y: () => dock?.y ?? 0,
          scale: () => dock?.scale ?? 0.7,
          autoAlpha: () => (dock ? 1 : 0),
          duration: 0.6,
          ease: "power3.inOut",
        }, LOCK + 1.1);
    }, overlay);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      ctx.revert();
      timelineRef.current = null;
      window.removeEventListener("keydown", handleKeyDown);
      if (main) main.inert = false;
    };
  }, [finish]);

  return (
    <div
      aria-label="Portfolio introduction"
      aria-modal="true"
      className={`${styles.entrance}${exiting ? ` ${styles.exiting}` : ""}`}
      data-surface="light"
      ref={overlayRef}
      role="dialog"
    >
      <div aria-hidden="true" className={styles.iris} data-intro="iris" />

      <div aria-hidden="true" className={styles.frame} data-intro="frame">
        <svg className={styles.mark} focusable="false" viewBox={RU_VIEW_BOX}>
          <g data-intro="pulse">
            <g data-intro="pieces">
              <path d={RU_STEM} data-intro="stem" />
              <path d={RU_TOP_ARC} data-intro="top-arc" />
              <path d={RU_BOTTOM_ARC} data-intro="bottom-arc" />
            </g>
          </g>
        </svg>

        <svg className={styles.glint} focusable="false" viewBox={RU_VIEW_BOX}>
          <defs>
            <clipPath id={glintClipId}>
              <path d={RU_STEM} />
              <path d={RU_TOP_ARC} />
              <path d={RU_BOTTOM_ARC} />
            </clipPath>
            <linearGradient id={glintGradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#8bdbc9" stopOpacity="0" />
              <stop offset="0.5" stopColor="#8bdbc9" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8bdbc9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#${glintClipId})`}>
            <g transform="skewX(-20)">
              <rect data-intro="glint" fill={`url(#${glintGradientId})`} height="320" width="80" x="0" y="60" />
            </g>
          </g>
        </svg>
      </div>

      <button className={styles.skip} onClick={() => finish(true)} type="button">
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
