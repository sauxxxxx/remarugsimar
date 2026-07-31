"use client";

import { Blocks, Bug } from "lucide-react";

export type GameId = "bug-hunter" | "stack-builder";

type GameLibraryProps = {
  onClose: () => void;
  onSelect: (game: GameId) => void;
};

const GAMES = [
  {
    description: "Build stable layers and keep the software stack deployable.",
    icon: Blocks,
    id: "stack-builder",
    meta: "01 / SYSTEM PUZZLE",
    title: "Stack Builder",
  },
  {
    description: "Defend live services, repair incidents, and keep production online.",
    icon: Bug,
    id: "bug-hunter",
    meta: "02 / SYSTEM SURVIVAL",
    title: "Bug Hunter",
  },
] satisfies Array<{
  description: string;
  icon: typeof Blocks;
  id: GameId;
  meta: string;
  title: string;
}>;

export function GameLibrary({ onClose, onSelect }: GameLibraryProps) {
  return (
    <section aria-labelledby="game-library-title" className="game-library">
      <header>
        <span>REMAR.OS / INTERACTIVE LAB</span>
        <h2 id="game-library-title">Select a simulation.</h2>
        <p>Two small systems games built around engineering under pressure.</p>
      </header>
      <div className="game-library__grid">
        {GAMES.map((game) => {
          const Icon = game.icon;
          return (
            <button
              data-game={game.id}
              key={game.id}
              onClick={() => onSelect(game.id)}
              type="button"
            >
              <span className="game-library__preview">
                <Icon aria-hidden="true" />
                <i /><i /><i />
              </span>
              <span>{game.meta}</span>
              <strong>{game.title}<i>↗</i></strong>
              <small>{game.description}</small>
            </button>
          );
        })}
      </div>
      <footer>
        <span><kbd>esc</kbd> close</span>
        <button onClick={onClose} type="button">return to portfolio ↙</button>
      </footer>
    </section>
  );
}
