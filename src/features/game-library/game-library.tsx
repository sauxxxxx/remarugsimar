"use client";

export type GameId = "stack-builder" | "system-type";

type GameLibraryProps = {
  onClose: () => void;
  onSelect: (game: GameId) => void;
};

const GAMES = [
  {
    code: "01",
    description: "Build a stable software stack before production collapses.",
    id: "stack-builder",
    meta: "SYSTEM PUZZLE",
    title: "Stack Builder",
  },
  {
    code: "02",
    description: "Type through incoming incidents and defend the deployment layer.",
    id: "system-type",
    meta: "TYPING SHOOTER",
    title: "System.Type",
  },
] satisfies Array<{
  code: string;
  description: string;
  id: GameId;
  meta: string;
  title: string;
}>;

export function GameLibrary({ onClose, onSelect }: GameLibraryProps) {
  return (
    <section aria-labelledby="game-library-title" className="game-library">
      <header>
        <span>GAME.LIST / 02</span>
        <h2 id="game-library-title">Select a simulation.</h2>
        <button onClick={onClose} type="button"><kbd>esc</kbd> close</button>
      </header>
      <div className="game-library-grid">
        {GAMES.map((game) => (
          <button key={game.id} onClick={() => onSelect(game.id)} type="button">
            <span>{game.code}</span>
            <div aria-hidden="true" data-game={game.id}>
              {game.id === "stack-builder" ? (
                <><i /><i /><i /><i /><i /></>
              ) : (
                <><b /><i /><i /><i /></>
              )}
            </div>
            <small>{game.meta}</small>
            <strong>{game.title}<i>↗</i></strong>
            <p>{game.description}</p>
          </button>
        ))}
      </div>
      <footer>Two experiments in systems thinking, built for the browser.</footer>
    </section>
  );
}
