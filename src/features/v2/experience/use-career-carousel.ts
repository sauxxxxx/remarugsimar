import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

export function useCareerCarousel(count: number) {
  const [index, setIndex] = useState(0);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const move = (direction: number) => {
    if (count > 1) setIndex((current) => (current + direction + count) % count);
  };

  return {
    index,
    move,
    onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (count < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    },
    swipe: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType !== "mouse" && event.isPrimary) {
          start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        }
      },
      onPointerCancel() { start.current = null; },
      onPointerUp(event: PointerEvent<HTMLDivElement>) {
        const origin = start.current;
        start.current = null;
        if (!origin || origin.id !== event.pointerId || count < 2) return;
        const dx = event.clientX - origin.x;
        const dy = event.clientY - origin.y;
        if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          suppressClickUntil.current = Date.now() + 400;
          move(dx < 0 ? 1 : -1);
        }
      },
      onClickCapture(event: MouseEvent<HTMLDivElement>) {
        if (Date.now() < suppressClickUntil.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
    },
  };
}
