"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SystemTypeThreatKind } from "./system-type.types";

type SoundEvent = "impact" | "key" | "kill" | "mistake" | "refactor" | "scan" | "victory";

const MUTE_KEY = "system-type-muted";
const KIND_FREQUENCIES: Record<SystemTypeThreatKind, number> = {
  deadlock: 150,
  memory: 330,
  rollback: 420,
  runtime: 510,
  timeout: 230,
};

function initialMuted() {
  return typeof window !== "undefined" && localStorage.getItem(MUTE_KEY) === "true";
}

export function useSystemTypeAudio() {
  const [muted, setMuted] = useState(initialMuted);
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback((event: SoundEvent, kind: SystemTypeThreatKind = "runtime") => {
    if (muted) return;
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;

    function tone(frequency: number, duration: number, offset = 0, volume = 0.025, wave: OscillatorType = "sine") {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      oscillator.type = wave;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
    }

    if (event === "key") tone(690, 0.045, 0, 0.018, "square");
    if (event === "mistake") tone(115, 0.11, 0, 0.028, "sawtooth");
    if (event === "impact") {
      tone(82, 0.2, 0, 0.045, "sawtooth");
      tone(61, 0.25, 0.04, 0.025, "square");
    }
    if (event === "kill") {
      const base = KIND_FREQUENCIES[kind];
      tone(base, 0.08, 0, 0.032, kind === "deadlock" ? "square" : "triangle");
      tone(base * 1.5, 0.12, 0.055, 0.025, "sine");
    }
    if (event === "scan") {
      tone(260, 0.08, 0, 0.018, "sine");
      tone(390, 0.08, 0.68, 0.018, "sine");
      tone(620, 0.16, 1.52, 0.025, "sine");
    }
    if (event === "refactor") {
      [220, 330, 440, 660].forEach((frequency, index) => tone(frequency, 0.2, index * 0.055, 0.025, "triangle"));
    }
    if (event === "victory") {
      [330, 440, 550, 660].forEach((frequency, index) => tone(frequency, 0.32, index * 0.12, 0.03, "sine"));
    }
  }, [muted]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      localStorage.setItem(MUTE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => () => {
    const context = contextRef.current;
    contextRef.current = null;
    if (context && context.state !== "closed") void context.close();
  }, []);

  return { muted, play, toggleMuted };
}
