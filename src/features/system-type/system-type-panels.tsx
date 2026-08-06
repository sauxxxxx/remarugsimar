"use client";

import {
  SYSTEM_TYPE_OBJECTIVE,
  SYSTEM_TYPE_SCAN_DURATION,
  systemTypeRank,
  systemTypeScanMessage,
  systemTypeWpm,
} from "./system-type-engine";
import type { SystemTypeState } from "./system-type.types";

type Actions = {
  pause: () => void;
  restart: () => void;
  start: () => void;
};

function ReportMetric({ label, value }: { label: string; value: string | number }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

export function SystemTypeInputPanel({ state }: { state: SystemTypeState }) {
  const activeThreat = state.threats.find((threat) => threat.id === state.targetId);
  const activeWord = activeThreat?.word ?? "awaiting input";
  const typedLength = activeThreat?.typed ?? 0;
  return (
    <div className="system-type-input" data-active={Boolean(activeThreat)} aria-live="polite">
      <small><i /> INPUT STREAM</small>
      <p>
        <span>&gt;</span>{" "}
        <strong>{activeWord.slice(0, typedLength)}</strong>
        <b>{activeWord.slice(typedLength)}</b>
        <i>_</i>
      </p>
      <div className="system-type-input-meta">
        <small>WPM VECTOR: <strong>{state.combo >= 5 ? "ACCELERATED" : "STABLE"}</strong></small>
        <i aria-hidden="true"><b /><b /><b /><b /><b /><b /></i>
      </div>
    </div>
  );
}

export function SystemTypeObjective({ state }: { state: SystemTypeState }) {
  const progress = Math.min(100, state.eliminated / SYSTEM_TYPE_OBJECTIVE * 100);
  return (
    <aside className="system-type-objective" aria-label="Current objective">
      <span>OBJECTIVE</span>
      <strong>{state.eliminated} / {SYSTEM_TYPE_OBJECTIVE} THREATS ELIMINATED</strong>
      <p>Maintain production integrity and clear the deployment line.</p>
      <i aria-hidden="true"><b style={{ width: `${progress}%` }} /></i>
      <small>{systemTypeRank(state.eliminated)}</small>
    </aside>
  );
}

export function SystemTypeFeedback({ state }: { state: SystemTypeState }) {
  const feedback = state.feedback;
  if (!feedback || state.phase !== "running" || state.elapsed - feedback.at > 1500) return null;
  return (
    <div aria-live="assertive" className="system-type-feedback" data-tone={feedback.tone} key={feedback.id}>
      <span>{feedback.text}</span>
      {feedback.tone === "warning" ? <small>keep the line stable</small> : null}
    </div>
  );
}

export function SystemTypeStatePanel({ actions, state }: { actions: Actions; state: SystemTypeState }) {
  if (state.phase === "running") return null;
  if (state.phase === "scanning") {
    const progress = Math.min(100, state.scanElapsed / SYSTEM_TYPE_SCAN_DURATION * 100);
    return (
      <div className="system-type-scan" aria-live="polite">
        <span>INITIALIZING DEFENSE PROTOCOL</span>
        <strong>{systemTypeScanMessage(state.scanElapsed)}</strong>
        <i><b style={{ width: `${progress}%` }} /></i>
      </div>
    );
  }
  if (state.phase === "idle") {
    return (
      <div className="system-type-state system-type-deploy">
        <div className="system-type-deploy-status">
          <span>DEFENSE PROTOCOL / READY</span>
          <small><i /> system online</small>
        </div>
        <h3>Production needs an operator.</h3>
        <p>Identify incoming incidents and type their signatures before they breach the deployment line.</p>
        <ol aria-label="How to play">
          <li><b>01</b><span>lock target</span></li>
          <li><b>02</b><span>type signature</span></li>
          <li><b>03</b><span>contain threat</span></li>
        </ol>
        <button autoFocus onClick={actions.start} type="button">
          <span>enter / deploy system</span><b aria-hidden="true">→</b>
        </button>
      </div>
    );
  }
  if (state.phase === "paused") {
    return (
      <div className="system-type-state">
        <span>PROCESS SUSPENDED</span>
        <h3>Production defense paused.</h3>
        <button autoFocus onClick={actions.pause} type="button">p / resume</button>
      </div>
    );
  }

  const victory = state.phase === "victory";
  return (
    <div className="system-type-state system-type-report" data-result={victory ? "saved" : "lost"}>
      <span>PRODUCTION REPORT</span>
      <h3>{victory ? "Production line secured." : "System integrity lost."}</h3>
      <p>{victory ? "Shift complete. Every required threat was contained." : "The line collapsed, but the incident report is ready for your next deployment."}</p>
      <dl>
        <ReportMetric label="integrity" value={`${Math.round(state.health)}%`} />
        <ReportMetric label="threats" value={state.eliminated} />
        <ReportMetric label="highest combo" value={state.highestCombo} />
        <ReportMetric label="accuracy" value={`${state.accuracy.toFixed(1)}%`} />
        <ReportMetric label="wpm" value={systemTypeWpm(state)} />
        <ReportMetric label="rank" value={systemTypeRank(state.eliminated)} />
      </dl>
      <div><strong>{state.score.toLocaleString()}</strong><small>FINAL SCORE</small></div>
      <button autoFocus onClick={actions.restart} type="button">enter / redeploy</button>
    </div>
  );
}
