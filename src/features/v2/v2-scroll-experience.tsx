"use client";

import { useSyncExternalStore } from "react";
import { V2DesktopScrollExperience } from "./v2-desktop-scroll-experience";
import { V2MobileExperience } from "./v2-mobile-experience";

const mobileQuery = "(max-width: 1024px), (prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

// Render readable content on the server before the viewport is known.
function getServerSnapshot() { return true; }

export function V2ScrollExperience() {
  const mobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return mobile ? <V2MobileExperience /> : <V2DesktopScrollExperience />;
}
