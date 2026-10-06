import { useSpring } from "motion/react";
import type { PointerEvent } from "react";

type Bounds = Pick<DOMRect, "left" | "top" | "width" | "height">;

export function getLabPointer(clientX: number, clientY: number, bounds: Bounds, limit: number) {
  if (bounds.width <= 0 || bounds.height <= 0 || !Number.isFinite(clientX + clientY)) {
    return { x: 0, y: 0 };
  }
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));
  return {
    x: clamp((clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)) * limit,
    y: clamp((clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)) * limit,
  };
}

export function useLabPointer(limit: number, disabled: boolean) {
  const spring = { stiffness: 180, damping: 24, mass: 0.5 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const reset = () => { x.set(0); y.set(0); };
  const move = (event: PointerEvent<HTMLElement>) => {
    if (disabled) return;
    const point = getLabPointer(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect(), limit);
    x.set(point.x);
    y.set(point.y);
  };

  return {
    x, y,
    events: {
      onPointerMove: move,
      onPointerDown: move,
      onPointerUp: reset,
      onPointerLeave: reset,
      onPointerCancel: reset,
      onBlurCapture: reset,
      onFocusCapture: () => {
        if (disabled) return;
        x.set(limit * 0.18);
        y.set(-limit * 0.18);
      },
    },
  };
}
