"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./portfolio-version-switch.module.css";

type PortfolioVersion = "v1" | "v2";

type PortfolioVersionSwitchProps = {
  className?: string;
  currentVersion: PortfolioVersion;
};

const portfolioViews = [
  { href: "/?intro=1", label: "Current", version: "v2" },
  { href: "/v1", label: "Classic", version: "v1" },
] as const;

export function PortfolioVersionSwitch({
  className,
  currentVersion,
}: PortfolioVersionSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.root} ${className ?? ""}`} ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label="Choose portfolio view"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        title="Portfolio view"
        type="button"
      >
        <span aria-hidden="true" className={styles.markers}>
          <i />
          <i />
          <i />
        </span>
      </button>

      {isOpen ? (
        <nav aria-label="Portfolio view" className={styles.menu} id={menuId}>
          <p className={styles.menuHeading}>
            Portfolio view <span>02</span>
          </p>
          <div className={styles.options}>
            {portfolioViews.map((view) => {
              const content = (
                <>
                  <span className={styles.optionLabel}>{view.label}</span>
                  <span className={styles.optionVersion}>{view.version}</span>
                  {view.version === currentVersion ? (
                    <span aria-hidden="true" className={styles.currentMark}>✓</span>
                  ) : null}
                </>
              );

              return view.version === currentVersion ? (
                <span
                  aria-current="page"
                  className={`${styles.option} ${styles.currentOption}`}
                  key={view.version}
                >
                  {content}
                </span>
              ) : (
                <a className={styles.option} href={view.href} key={view.version}>
                  {content}
                </a>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
