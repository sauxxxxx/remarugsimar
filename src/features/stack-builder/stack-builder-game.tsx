"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsDown,
  Pause,
  RotateCw,
} from "lucide-react";
import { TranslatedText } from "@/features/translation/translation-provider";
import { STACK_BUILDER_COPY, TECH_NAMES } from "./stack-builder.constants";
import { useStackBuilderGame } from "./use-stack-builder-game";

type StackBuilderGameProps = {
  onClose: () => void;
};

function GameStatusCard({
  onStart,
  score,
  status,
}: {
  onStart: () => void;
  score: number;
  status: "ready" | "paused" | "gameover";
}) {
  const content = {
    ready: {
      detail: STACK_BUILDER_COPY.readyText,
      label: STACK_BUILDER_COPY.start,
      title: STACK_BUILDER_COPY.readyTitle,
    },
    paused: {
      detail: STACK_BUILDER_COPY.readyText,
      label: STACK_BUILDER_COPY.resume,
      title: STACK_BUILDER_COPY.paused,
    },
    gameover: {
      detail: `${STACK_BUILDER_COPY.score}: ${score.toLocaleString()}`,
      label: STACK_BUILDER_COPY.restart,
      title: STACK_BUILDER_COPY.gameOver,
    },
  }[status];

  return (
    <div className="stack-builder-status">
      <strong><TranslatedText text={content.title} /></strong>
      <span><TranslatedText text={content.detail} /></span>
      <button autoFocus onClick={onStart} type="button">
        <TranslatedText text={content.label} />
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

export function StackBuilderGame({ onClose }: StackBuilderGameProps) {
  const { actions, board, game, highScore } = useStackBuilderGame();
  const inactiveStatus = game.status === "playing" ? null : game.status;

  return (
    <section aria-labelledby="stack-builder-title" className="stack-builder">
      <h2 className="sr-only" id="stack-builder-title">{STACK_BUILDER_COPY.title}</h2>
      <button
        aria-label={STACK_BUILDER_COPY.close}
        className="stack-builder__mobile-close"
        onClick={onClose}
        type="button"
      >
        close
      </button>

      <dl className="stack-builder-stats">
        {[
          [STACK_BUILDER_COPY.score, game.score],
          [STACK_BUILDER_COPY.best, highScore],
          [STACK_BUILDER_COPY.lines, game.lines],
          [STACK_BUILDER_COPY.level, game.level],
        ].map(([label, value]) => (
          <div key={label}>
            <dt><TranslatedText text={String(label)} /></dt>
            <dd>{Number(value).toLocaleString()}</dd>
          </div>
        ))}
      </dl>

      <div className="stack-builder-layout">
        <div
          aria-label={`Stack Builder board. ${game.lines} lines cleared.`}
          className="stack-builder-board"
          role="img"
        >
          {board.flat().map((cell, index) => (
            <span
              className={cell ? `stack-builder-cell stack-builder-cell--${cell.active ? "active" : "settled"}` : "stack-builder-cell"}
              key={index}
            >
              {cell ? cell.tech : ""}
            </span>
          ))}
          {inactiveStatus && (
            <GameStatusCard
              onStart={inactiveStatus === "paused" ? actions.pause : actions.start}
              score={game.score}
              status={inactiveStatus}
            />
          )}
        </div>

        <div aria-label="Touch game controls" className="stack-builder-touch">
          <button aria-label="Move left" onClick={actions.moveLeft} type="button"><ArrowLeft /></button>
          <button aria-label="Rotate" onClick={actions.rotate} type="button"><RotateCw /></button>
          <button aria-label="Move right" onClick={actions.moveRight} type="button"><ArrowRight /></button>
          <button aria-label="Soft drop" onClick={actions.softDrop} type="button"><ArrowDown /></button>
          <button aria-label="Hard drop" onClick={actions.hardDrop} type="button"><ChevronsDown /></button>
          <button aria-label="Pause or resume" onClick={actions.pause} type="button"><Pause /></button>
        </div>

        <aside className="stack-builder-sidebar">
          <section>
            <h3><TranslatedText text={STACK_BUILDER_COPY.next} /></h3>
            <div
              aria-label={`${TECH_NAMES[game.nextPiece.tech]} piece`}
              className="stack-builder-next"
              style={{ gridTemplateColumns: `repeat(${game.nextPiece.shape[0].length}, 30px)` }}
            >
              {game.nextPiece.shape.flatMap((row, y) =>
                row.map((filled, x) => (
                  <span
                    className={filled ? "stack-builder-next__cell is-filled" : "stack-builder-next__cell"}
                    key={`${x}-${y}`}
                  >
                    {filled ? game.nextPiece.tech : ""}
                  </span>
                )),
              )}
            </div>
          </section>

          <section className="stack-builder-controls">
            <h3><TranslatedText text={STACK_BUILDER_COPY.controls} /></h3>
            <dl>
              <div><dt><TranslatedText text={STACK_BUILDER_COPY.move} /></dt><dd><kbd>←</kbd><kbd>→</kbd></dd></div>
              <div><dt><TranslatedText text={STACK_BUILDER_COPY.rotate} /></dt><dd><kbd>↑</kbd></dd></div>
              <div><dt><TranslatedText text={STACK_BUILDER_COPY.softDrop} /></dt><dd><kbd>↓</kbd></dd></div>
              <div><dt><TranslatedText text={STACK_BUILDER_COPY.hardDrop} /></dt><dd><kbd>space</kbd></dd></div>
              <div><dt><TranslatedText text={STACK_BUILDER_COPY.pause} /></dt><dd><kbd>P</kbd></dd></div>
            </dl>
          </section>
        </aside>
      </div>

      <p aria-live="polite" className="sr-only">
        {game.status}. {game.score} points. {game.lines} lines.
      </p>

      <footer className="stack-builder-shortcuts" aria-label="Game shortcuts">
        <span><kbd>P</kbd> pause</span>
        <span><kbd>esc</kbd> close</span>
      </footer>
    </section>
  );
}
