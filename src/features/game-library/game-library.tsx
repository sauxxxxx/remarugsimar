"use client";

import { Blocks, Siren } from "lucide-react";

export type GameId = "production-rescue" | "stack-builder";

type GameLibraryProps = {
  onSelect: (game: GameId) => void;
};

const GAMES = [
  {
    description: "Build stable layers and keep the software stack deployable.",
    icon: Blocks,
    id: "stack-builder",
    meta: "01 · puzzle",
    title: "Stack Builder",
  },
  {
    description: "Race across a live system and repair incidents before uptime reaches zero.",
    icon: Siren,
    id: "production-rescue",
    meta: "02 · 2D rescue",
    title: "Production Rescue",
  },
] satisfies Array<{
  description: string;
  icon: typeof Blocks;
  id: GameId;
  meta: string;
  title: string;
}>;

export function GameLibrary({ onSelect }: GameLibraryProps) {
  return (
    <section aria-labelledby="game-library-title" className="game-library">
      <header>
        <p>game.list / 02</p>
        <h2 id="game-library-title">Take a short break.</h2>
        <span>Two small games about keeping software alive.</span>
      </header>

      <div className="game-library__grid">
        {GAMES.map((game) => {
          const Icon = game.icon;
          return (
            <button key={game.id} onClick={() => onSelect(game.id)} type="button">
              <span className="game-library__preview" data-game={game.id}>
                <Icon aria-hidden="true" />
                <i />
                <i />
                <i />
              </span>
              <span className="game-library__meta">{game.meta}</span>
              <strong>{game.title}<span aria-hidden="true">↗</span></strong>
              <small>{game.description}</small>
            </button>
          );
        })}
      </div>

      <footer><kbd>esc</kbd> close</footer>
    </section>
  );
}
