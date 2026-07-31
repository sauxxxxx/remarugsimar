"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { BUG_HUNTER_LEVELS } from "./bug-hunter.data";

type MenuView = "credits" | "levels" | "main" | "settings";

type BugHunterMenuProps = {
  hasSave: boolean;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onNewGame: (levelIndex: number) => void;
};

export function BugHunterMenu({
  hasSave,
  onBack,
  onClose,
  onContinue,
  onNewGame,
}: BugHunterMenuProps) {
  const [view, setView] = useState<MenuView>("main");
  const [effects, setEffects] = useState(true);
  const [screenShake, setScreenShake] = useState(true);

  return (
    <section className="bug-hunter-menu" data-effects={effects || undefined}>
      <div aria-hidden="true" className="bug-hunter-menu__scene" />
      <div aria-hidden="true" className="bug-hunter-menu__scanlines" />
      <div className="bug-hunter-menu__panel">
        <header>
          <span>PRODUCTION SECURITY CONSOLE / BUILD 07.31</span>
          <p>LIVE SYSTEM // INCIDENT RESPONSE REQUIRED</p>
        </header>

        <div className="bug-hunter-menu__title">
          <span>BUG HUNTER</span>
          <h2>SYSTEM FAILURE</h2>
          <p>Keep production alive. Eliminate defects. Ship the patch.</p>
        </div>

        {view === "main" ? (
          <nav aria-label="Bug Hunter menu" className="bug-hunter-menu__actions">
            <button disabled={!hasSave} onClick={onContinue} type="button">
              <span>01</span>Continue
              {!hasSave ? <small>no save</small> : null}
            </button>
            <button onClick={() => onNewGame(0)} type="button">
              <span>02</span>New Game
            </button>
            <button onClick={() => setView("levels")} type="button">
              <span>03</span>Level Select
            </button>
            <button onClick={() => setView("settings")} type="button">
              <span>04</span>Settings
            </button>
            <button onClick={() => setView("credits")} type="button">
              <span>05</span>Credits
            </button>
            <button onClick={onClose} type="button">
              <span>06</span>Exit
            </button>
          </nav>
        ) : null}

        {view === "levels" ? (
          <div className="bug-hunter-level-select">
            <div className="bug-hunter-subscreen__heading">
              <div>
                <span>DEPLOYMENT TARGET</span>
                <h3>Level Select</h3>
              </div>
              <button onClick={() => setView("main")} type="button">back</button>
            </div>
            <div className="bug-hunter-level-select__grid">
              {BUG_HUNTER_LEVELS.map((level, index) => (
                <button
                  key={level.id}
                  onClick={() => onNewGame(index)}
                  style={{ "--level-accent": level.tint } as CSSProperties}
                  type="button"
                >
                  <span>{level.code}</span>
                  <strong>{level.name}</strong>
                  <small>{level.objective}</small>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === "settings" ? (
          <div className="bug-hunter-subscreen">
            <div className="bug-hunter-subscreen__heading">
              <div>
                <span>LOCAL CONFIG</span>
                <h3>Settings</h3>
              </div>
              <button onClick={() => setView("main")} type="button">back</button>
            </div>
            <button
              aria-pressed={effects}
              className="bug-hunter-setting"
              onClick={() => setEffects((current) => !current)}
              type="button"
            >
              <span><strong>Infrastructure effects</strong><small>Data flow and status lighting</small></span>
              <i>{effects ? "ON" : "OFF"}</i>
            </button>
            <button
              aria-pressed={screenShake}
              className="bug-hunter-setting"
              onClick={() => setScreenShake((current) => !current)}
              type="button"
            >
              <span><strong>Failure feedback</strong><small>Critical-state screen response</small></span>
              <i>{screenShake ? "ON" : "OFF"}</i>
            </button>
            <p>Controls: WASD / arrows move · E repair · 1–4 equipment · space fire · P pause.</p>
          </div>
        ) : null}

        {view === "credits" ? (
          <div className="bug-hunter-subscreen">
            <div className="bug-hunter-subscreen__heading">
              <div>
                <span>PROJECT CREDITS</span>
                <h3>Built for production.</h3>
              </div>
              <button onClick={() => setView("main")} type="button">back</button>
            </div>
            <dl className="bug-hunter-credits">
              <div><dt>Design & engineering</dt><dd>Remar Ugsimar</dd></div>
              <div><dt>Runtime</dt><dd>React / TypeScript</dd></div>
              <div><dt>Systems</dt><dd>Deterministic simulation, save state, responsive HUD</dd></div>
              <div><dt>Mission</dt><dd>Keep software useful, stable, and alive.</dd></div>
            </dl>
          </div>
        ) : null}

        <footer>
          <button onClick={onBack} type="button">← game.list</button>
          <span>ESC CLOSES PORTFOLIO OVERLAY</span>
        </footer>
      </div>
    </section>
  );
}
