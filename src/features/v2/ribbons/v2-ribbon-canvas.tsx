"use client";

import type { MotionValue } from "motion/react";
import { Mesh, Program, Renderer, Triangle, Vec2, Vec3 } from "ogl";
import { useEffect, useRef } from "react";

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Chrome-silk ribbons: each one is a slowly undulating centre line that twists
// along its length. Where it turns edge-on it narrows into a bright specular
// streak; where it faces the viewer it widens into a dimmer satin band.
const fragment = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uLift;
uniform float uSlope;
uniform float uIntensity;
uniform vec3 uTint;
uniform float uTintAmount;
uniform float uStretch;

float ribbon(vec2 p, float seed, float offset, float t) {
  float x = p.x + uPointer.x * 0.06 * (0.6 + seed * 0.2);
  float centre = offset + uLift
    + x * uSlope
    + 0.16 * sin(x * 1.25 + t * 0.32 + seed * 2.1)
    + 0.07 * sin(x * 2.6 - t * 0.24 + seed * 4.3)
    + 0.025 * sin(x * 5.3 + t * 0.45 + seed * 1.7)
    + uPointer.y * 0.025;
  float twist = sin(x * (1.6 + seed * 0.18) + seed * 3.7 - t * 0.38);
  float edgeOn = 1.0 - abs(twist);
  float width = 0.006 + 0.085 * abs(twist);
  float offsetY = p.y - centre;
  float across = offsetY / width;
  float inside = 1.0 - smoothstep(0.82, 1.0, abs(across));

  // Dark glossy body with a soft sheen that rolls along the length.
  float sheen = 0.5 + 0.5 * sin(x * 3.1 + seed * 5.0 + t * 0.55);
  float face = pow(clamp(1.0 - abs(across + 0.4 * twist), 0.0, 1.0), 3.0) * sheen;
  // Crisp rim light along the edge that faces up, as on polished metal.
  float rimSide = twist > 0.0 ? 0.78 : -0.78;
  float rim = exp(-pow((across - rimSide) * 7.0, 2.0)) * (0.35 + 0.65 * sheen);
  // A sharp flash where the ribbon turns edge-on.
  float flash = pow(edgeOn, 14.0) * exp(-across * across * 6.0);
  float body = inside * (0.02 + 0.16 * face + 0.75 * rim + 2.4 * flash);
  float halo = exp(-abs(offsetY) * 48.0) * (0.01 + 0.18 * pow(edgeOn, 10.0));
  return body + halo;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  p.x /= uStretch;
  float t = uTime;
  float light = 0.0;
  light += ribbon(p, 0.0, 0.28, t) * 1.0;
  light += ribbon(p, 1.0, 0.17, t * 0.92) * 0.85;
  light += ribbon(p, 2.0, 0.39, t * 1.06) * 0.7;
  light += ribbon(p, 3.0, 0.06, t * 0.85) * 0.5;
  light += ribbon(p, 4.0, 0.47, t * 1.12) * 0.4;
  light *= uIntensity;

  // Soft filmic roll-off, with a faint cool cast in the highlights, then the tint.
  vec3 colour = vec3(1.0) - exp(-vec3(light) * vec3(1.05, 1.08, 1.12) * 1.6);
  colour *= mix(vec3(1.0), uTint, uTintAmount);
  gl_FragColor = vec4(colour, 1.0);
}
`;

export type V2RibbonCanvasProps = {
  active?: boolean;
  className?: string;
  /** Scroll-driven offset added to the flow, so the ribbons move as the page scrolls. */
  flow?: MotionValue<number>;
  /** Overall brightness; 1 is the hero. */
  intensity?: number;
  /** Shifts every ribbon up (+) or down (-), in units of the canvas height. */
  lift?: number;
  /** How steeply the ribbons climb from left to right. */
  slope?: number;
  /** Time scale; 1 is the hero. */
  speed?: number;
  /** Widens the waves horizontally, for short, wide strips. */
  stretch?: number;
  tint?: readonly [number, number, number];
  tintAmount?: number;
};

export function V2RibbonCanvas({
  active = true,
  className,
  flow,
  intensity = 1,
  lift = 0,
  slope = 0.16,
  speed = 1,
  stretch = 1,
  tint = [1, 1, 1],
  tintAmount = 0,
}: V2RibbonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const wakeRef = useRef<() => void>(() => {});
  const [tintR, tintG, tintB] = tint;

  useEffect(() => {
    activeRef.current = active;
    wakeRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio || 1, 1.5), alpha: false, antialias: false });
    } catch {
      return; // No WebGL: the area stays plain black.
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uPointer: { value: new Vec2() },
        uLift: { value: lift },
        uSlope: { value: slope },
        uIntensity: { value: intensity },
        uTint: { value: new Vec3(tintR, tintG, tintB) },
        uTintAmount: { value: tintAmount },
        uStretch: { value: stretch },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let visible = true;
    let frame = 0;
    let last = performance.now();
    // Start mid-flow so the first frame already looks composed.
    let elapsed = 6;

    const draw = () => {
      const scrollFlow = reducedMotion.matches ? 0 : flow?.get() ?? 0;
      program.uniforms.uTime.value = elapsed + scrollFlow;
      program.uniforms.uPointer.value.set(pointer.x, pointer.y);
      renderer.render({ scene: mesh });
    };

    const resize = () => {
      renderer.setSize(parent.clientWidth, parent.clientHeight);
      program.uniforms.uResolution.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
      draw();
    };

    const running = () => visible && activeRef.current && !document.hidden && !reducedMotion.matches;

    const tick = (now: number) => {
      frame = 0;
      if (!running()) return;
      elapsed += (Math.min(now - last, 50) / 1000) * speed;
      last = now;
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || !running()) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth - 0.5;
      pointer.targetY = 0.5 - event.clientY / window.innerHeight;
    };

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(parent);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    viewObserver.observe(canvas);
    document.addEventListener("visibilitychange", wake);
    reducedMotion.addEventListener("change", wake);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    resize();
    wake();

    return () => {
      cancelAnimationFrame(frame);
      wakeRef.current = () => {};
      sizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      reducedMotion.removeEventListener("change", wake);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [flow, intensity, lift, slope, speed, stretch, tintR, tintG, tintB, tintAmount]);

  return <canvas className={className} ref={canvasRef} />;
}
