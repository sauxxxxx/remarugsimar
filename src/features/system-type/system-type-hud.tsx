"use client";

import { useEffect, useRef, useState } from "react";
import { systemTypeWpm } from "./system-type-engine";
import type { SystemTypeState } from "./system-type.types";

function useAnimatedNumber(target: number, duration = 320) {
  const [displayed, setDisplayed] = useState(target);
  const displayedRef = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayedRef.current = target;
      setDisplayed(target);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const from = displayedRef.current;
    const change = target - from;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = from + change * eased;
      displayedRef.current = next;
      setDisplayed(next);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, target]);

  return displayed;
}

function Metric({
  emphasis,
  label,
  pulseKey,
  value,
}: {
  emphasis?: "integrity" | "score";
  label: string;
  pulseKey?: number;
  value: string;
}) {
  return (
    <div className={emphasis ? `system-type-metric is-${emphasis}` : "system-type-metric"}>
      <dt>{label}</dt>
      <dd key={pulseKey}>{value}</dd>
      <i aria-hidden="true"><b /><b /><b /><b /><b /><b /><b /></i>
    </div>
  );
}

export function SystemTypeHud({ state }: { state: SystemTypeState }) {
  const animatedIntegrity = useAnimatedNumber(state.health, 240);
  const animatedScore = useAnimatedNumber(state.score, 420);
  const integrityState = state.health <= 25 ? "critical" : state.health <= 55 ? "warning" : "stable";

  return (
    <header className="system-type-header" data-integrity={integrityState}>
      <div className="system-type-heading">
        <span>02 / SYSTEM.TYPE</span>
        <h2 id="system-type-title">Production defense</h2>
        <p>{"// PROTECT THE PRODUCTION LINE"}</p>
      </div>
      <dl aria-label="Production metrics">
        <Metric emphasis="integrity" label="integrity" value={`${Math.round(animatedIntegrity)}%`} />
        <Metric label="wpm" value={String(systemTypeWpm(state))} />
        <Metric label="accuracy" value={`${Math.round(state.accuracy)}%`} />
        <Metric label="combo" pulseKey={state.combo} value={String(state.combo)} />
        <Metric emphasis="score" label="score" value={Math.round(animatedScore).toLocaleString()} />
      </dl>
    </header>
  );
}
