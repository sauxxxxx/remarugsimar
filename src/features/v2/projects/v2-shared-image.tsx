"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, type MouseEvent, useEffect, useRef } from "react";
import { SHARED_IMAGE_NAME } from "./v2-shared-image-name";

// A project screenshot morphs between pages with the View Transitions API: from a gallery
// card into the case-study hero, from the hero back into its card, and from a case study's
// "Next project" preview into the next hero. Unsupported browsers and reduced motion
// simply navigate.
const HERO_SELECTOR = "[data-v2-hero-image]";

let finishPending: (() => void) | null = null;
let returnSlug: string | null = null;

function canTransition() {
  return typeof document !== "undefined"
    && "startViewTransition" in document
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function navigateWithSharedImage(
  router: ReturnType<typeof useRouter>,
  href: string,
  source: HTMLElement | null,
) {
  if (!canTransition() || !source) {
    router.push(href);
    return;
  }
  // Only one element per page may carry the shared name.
  document.querySelectorAll<HTMLElement>(HERO_SELECTOR).forEach((hero) => {
    if (hero !== source) hero.style.viewTransitionName = "none";
  });
  source.style.viewTransitionName = SHARED_IMAGE_NAME;

  const transition = document.startViewTransition(() => new Promise<void>((resolve) => {
    const done = () => {
      window.clearTimeout(timeout);
      finishPending = null;
      resolve();
    };
    const timeout = window.setTimeout(done, 1600);
    finishPending = done;
    router.push(href);
  }));
  transition.finished.finally(() => {
    if (source.isConnected) source.style.viewTransitionName = "";
  });
}

/** Called by the destination page once its image is in place. */
function markReady() {
  finishPending?.();
}

/**
 * A link that morphs the element marked [data-v2-shared-image] inside it (or the page's hero,
 * with `fromHero`) into the destination page. `returnTo` names the gallery card to land on.
 */
export function V2SharedImageLink({ fromHero = false, href, onClick, returnTo, ...rest }: ComponentProps<typeof Link> & {
  fromHero?: boolean;
  href: string;
  returnTo?: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    returnSlug = returnTo ?? null;
    const source = fromHero
      ? document.querySelector<HTMLElement>(HERO_SELECTOR)
      : ref.current?.querySelector<HTMLElement>("[data-v2-shared-image]") ?? null;
    navigateWithSharedImage(router, href, source);
  }

  return <Link {...rest} href={href} onClick={handleClick} ref={ref} />;
}

/** On a case study: release the transition once the hero screenshot has decoded. */
export function V2HeroImageReady() {
  useEffect(() => {
    let cancelled = false;
    const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
    // Arriving by the morph, the hero is already in place, so it skips its own fade-in.
    if (hero && finishPending) hero.dataset.v2Arrived = "true";
    const image = hero?.querySelector("img");
    const decoded = image ? image.decode().catch(() => undefined) : Promise.resolve();
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 700));
    Promise.race([decoded, timeout]).then(() => {
      if (!cancelled) markReady();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

/** On the gallery: when returning from a case study, land on that project's card. */
export function useGalleryReturn() {
  useEffect(() => {
    const slug = returnSlug;
    returnSlug = null;
    const card = slug ? document.querySelector<HTMLElement>(`[data-v2-card-image="${slug}"]`) : null;
    if (card) {
      card.scrollIntoView({ block: "center", behavior: "instant" });
      card.style.viewTransitionName = SHARED_IMAGE_NAME;
      window.setTimeout(() => { card.style.viewTransitionName = ""; }, 1400);
    }
    markReady();
  }, []);
}
