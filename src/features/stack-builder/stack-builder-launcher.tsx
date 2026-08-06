"use client";

import { Gamepad2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameLibrary, type GameId } from "@/features/game-library/game-library";
import { SystemTypeGame } from "@/features/system-type/system-type-game";
import { StackBuilderGame } from "./stack-builder-game";

type PageLock = {
  overflow: string;
  position: string;
  scrollContainer: HTMLElement | null;
  scrollContainerOverflowY: string;
  scrollContainerScrollTop: number;
  scrollY: number;
  top: string;
  width: string;
};

function restorePage(lock: PageLock) {
  const { style } = document.body;
  const rootStyle = document.documentElement.style;
  const previousScrollBehavior = rootStyle.scrollBehavior;
  style.overflow = lock.overflow;
  style.position = lock.position;
  style.top = lock.top;
  style.width = lock.width;
  if (lock.scrollContainer) {
    lock.scrollContainer.style.overflowY = lock.scrollContainerOverflowY;
    lock.scrollContainer.scrollTop = lock.scrollContainerScrollTop;
  }
  rootStyle.scrollBehavior = "auto";
  window.scrollTo(0, lock.scrollY);
  rootStyle.scrollBehavior = previousScrollBehavior;
}

export function StackBuilderLauncher() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pageLockRef = useRef<PageLock | null>(null);
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const lockPage = useCallback(() => {
    if (pageLockRef.current) return;
    const { style } = document.body;
    const scrollContainer = document.querySelector<HTMLElement>(".about-panel");
    const scrollY = window.scrollY;
    pageLockRef.current = {
      overflow: style.overflow,
      position: style.position,
      scrollContainer,
      scrollContainerOverflowY: scrollContainer?.style.overflowY ?? "",
      scrollContainerScrollTop: scrollContainer?.scrollTop ?? 0,
      scrollY,
      top: style.top,
      width: style.width,
    };
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    if (scrollContainer) scrollContainer.style.overflowY = "hidden";
  }, []);

  const openGame = useCallback((game: GameId | null = null) => {
    setActiveGame(game);
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      lockPage();
      dialog.showModal();
    });
  }, [lockPage]);

  useEffect(() => () => {
    if (pageLockRef.current) restorePage(pageLockRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dialogRef.current?.close();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    function openRequestedGame(event: Event) {
      const requested = (event as CustomEvent<{ game?: GameId }>).detail?.game;
      openGame(requested ?? null);
    }
    window.addEventListener("portfolio:open-game", openRequestedGame);
    return () => window.removeEventListener("portfolio:open-game", openRequestedGame);
  }, [openGame]);

  function closeGame() {
    dialogRef.current?.close();
  }

  function handleClosed() {
    if (pageLockRef.current) {
      restorePage(pageLockRef.current);
      pageLockRef.current = null;
    }
    setIsOpen(false);
    setActiveGame(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        aria-label="Open portfolio games"
        className="stack-builder-trigger"
        onClick={() => openGame()}
        ref={triggerRef}
        title="Portfolio games"
        type="button"
      >
        <Gamepad2 aria-hidden="true" size={13} strokeWidth={1.5} />
      </button>
      <dialog
        aria-labelledby="game-dialog-title"
        className="stack-builder-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeGame();
        }}
        onClose={handleClosed}
        ref={dialogRef}
      >
        <h2 className="sr-only" id="game-dialog-title">Portfolio games</h2>
        {isOpen && activeGame === null ? (
          <GameLibrary onClose={closeGame} onSelect={setActiveGame} />
        ) : null}
        {isOpen && activeGame === "stack-builder" ? (
          <div className="game-stage">
            <button className="game-back-control" onClick={() => setActiveGame(null)} type="button">
              ← game.list
            </button>
            <StackBuilderGame onClose={closeGame} />
          </div>
        ) : null}
        {isOpen && activeGame === "system-type" ? (
          <SystemTypeGame onBack={() => setActiveGame(null)} onClose={closeGame} />
        ) : null}
      </dialog>
    </>
  );
}
