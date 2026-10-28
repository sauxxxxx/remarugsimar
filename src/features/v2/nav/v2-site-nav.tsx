"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { RuMark } from "../brand/ru-mark";
import { type V2SectionKey, V2SectionLink } from "./v2-section-link";
import styles from "./v2-site-nav.module.css";

export type V2NavItem = {
  label: string;
  href: string;
  /** Homepage section to jump to through the shared navigation event. */
  section?: V2SectionKey;
  /** Element whose position marks this item active while scrolling. */
  activeWhen?: string;
};

type V2SiteNavProps = {
  items: readonly V2NavItem[];
  /** contact: open the contact form (about this subject) instead of following href. */
  cta: { label: string; href: string; section?: V2SectionKey; contact?: string };
  brandHref: string;
  brandSection?: V2SectionKey;
  /** Item that is always marked current on this page. */
  currentLabel?: string;
  /** Scroll distance before the bar may appear; "hero" means about one screen. */
  revealAfter?: "hero" | number;
};

// A compact glass bar that appears once the page has moved past its opening, hides while
// you scroll down and returns as soon as you scroll up. On phones it opens a full menu.
export function V2SiteNav({ brandHref, brandSection, cta, currentLabel, items, revealAfter = 160 }: V2SiteNavProps) {
  const [shown, setShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | undefined>(currentLabel);
  const { scrollYProgress } = useScroll();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on the way down, return on the way up, never over the page's own opening. The
  // direction comes from the reader's input, not the scroll position, so the project snap
  // and section jumps (which scroll by themselves) don't hide the bar.
  useEffect(() => {
    const pastOpening = () =>
      window.scrollY >= (revealAfter === "hero" ? window.innerHeight * 0.85 : revealAfter);
    const intend = (down: boolean) => setShown(!down && pastOpening());
    let touchY = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 2) intend(event.deltaY > 0);
    };
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchY;
      if (Math.abs(y - touchY) > 8) {
        intend(y < touchY);
        touchY = y;
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End"].includes(event.key) || (event.key === " " && !event.shiftKey)) intend(true);
      else if (["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey)) intend(false);
    };
    const onScroll = () => { if (!pastOpening()) setShown(false); };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [revealAfter]);

  // The item whose section has most recently passed the middle of the screen is current.
  useEffect(() => {
    const tracked = items.filter((item) => item.activeWhen);
    if (!tracked.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight * 0.5;
      let current: string | undefined;
      for (const item of tracked) {
        const element = document.querySelector(item.activeWhen!);
        if (element && element.getBoundingClientRect().top <= middle) current = item.label;
      }
      setActive(current ?? currentLabel);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items, currentLabel]);

  // The phone menu: lock the page, focus the first link, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    // The page scrolls on <html>, so that is where the lock goes.
    const root = document.documentElement;
    const { overflow } = root.style;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const visible = shown || menuOpen;

  const renderLink = (item: V2NavItem, className: string, onClick?: () => void) => {
    const current = active === item.label;
    const props = {
      "aria-current": current ? ("location" as const) : undefined,
      children: item.label,
      className: `${className} ${current ? styles.current : ""}`,
      href: item.href,
      onClick,
    };
    if (item.section) return <V2SectionLink key={item.label} section={item.section} {...props} />;
    if (item.href.startsWith("/")) return <Link key={item.label} {...props} />;
    return <a key={item.label} {...props} />;
  };

  const brand = brandSection
    ? <V2SectionLink aria-label="Back to the top" className={styles.brand} href={brandHref} section={brandSection}><RuMark /></V2SectionLink>
    : <Link aria-label="Remar Ugsimar home" className={styles.brand} href={brandHref}><RuMark /></Link>;
  const ctaContent = <>{cta.label} <ArrowUpRight aria-hidden="true" size={16} /></>;

  return (
    <>
      <header className={styles.bar} data-shown={visible} inert={!visible || undefined}>
        {brand}
        <nav aria-label="Site" className={styles.links}>
          {items.map((item) => renderLink(item, styles.link))}
        </nav>
        {cta.section
          ? <V2SectionLink className={styles.cta} href={cta.href} section={cta.section}>{ctaContent}</V2SectionLink>
          : <a className={styles.cta} data-v2-contact={cta.contact} href={cta.href}>{ctaContent}</a>}
        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          ref={toggleRef}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <motion.span aria-hidden="true" className={styles.progress} style={{ scaleX: scrollYProgress }} />
      </header>

      <div
        aria-label="Menu"
        aria-modal="true"
        className={styles.menu}
        data-open={menuOpen}
        hidden={!menuOpen}
        id={menuId}
        ref={menuRef}
        role="dialog"
      >
        <nav aria-label="Site menu" className={styles.menuLinks}>
          {items.map((item) => renderLink(item, styles.menuLink, closeMenu))}
        </nav>
        {cta.section
          ? <V2SectionLink className={styles.menuCta} href={cta.href} onClick={closeMenu} section={cta.section}>{ctaContent}</V2SectionLink>
          : <a className={styles.menuCta} data-v2-contact={cta.contact} href={cta.href} onClick={closeMenu}>{ctaContent}</a>}
      </div>
    </>
  );
}
