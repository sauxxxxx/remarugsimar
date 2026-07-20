"use client";

import { Gamepad2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => () => {
    if (pageLockRef.current) restorePage(pageLockRef.current);
  }, []);

  function lockPage() {
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
  }

  function openGame() {
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      lockPage();
      dialog.showModal();
    });
  }

  function closeGame() {
    dialogRef.current?.close();
  }

  function handleClosed() {
    if (pageLockRef.current) {
      restorePage(pageLockRef.current);
      pageLockRef.current = null;
    }
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        aria-label="Open Stack Builder game"
        className="stack-builder-trigger"
        onClick={openGame}
        ref={triggerRef}
        title="Stack Builder"
        type="button"
      >
        <Gamepad2 aria-hidden="true" size={13} strokeWidth={1.5} />
      </button>
      <dialog
        aria-labelledby="stack-builder-title"
        className="stack-builder-dialog"
        onClose={handleClosed}
        ref={dialogRef}
      >
        {isOpen && <StackBuilderGame onClose={closeGame} />}
      </dialog>
    </>
  );
}
