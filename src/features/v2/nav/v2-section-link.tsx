"use client";

import type { ComponentProps, MouseEvent } from "react";

// Homepage sections the navigation can jump to. The desktop homepage pins several of them,
// so a plain #anchor would land at the wrong point; it listens for this event and scrolls
// itself. Anywhere nothing handles the event (phones, other pages) the anchor runs as usual.
export type V2SectionKey = "top" | "work" | "services" | "about" | "contact";
export const V2_NAVIGATE_EVENT = "v2:navigate";

export function requestSectionNavigation(key: V2SectionKey) {
  const event = new CustomEvent<V2SectionKey>(V2_NAVIGATE_EVENT, { cancelable: true, detail: key });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

export function V2SectionLink({ section, onClick, ...rest }: ComponentProps<"a"> & { section: V2SectionKey }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (requestSectionNavigation(section)) event.preventDefault();
  }
  return <a {...rest} onClick={handleClick} />;
}
