"use client";

import { type V2NavItem, V2SiteNav } from "./v2-site-nav";

export const homeNavItems: readonly V2NavItem[] = [
  { label: "Work", href: "#v2-projects", section: "work", activeWhen: "#v2-projects" },
  { label: "Services", href: "#v2-what-i-do", section: "services", activeWhen: "#v2-what-i-do" },
  { label: "About", href: "#v2-about", section: "about", activeWhen: "#v2-about" },
  { label: "Contact", href: "#v2-contact", section: "contact", activeWhen: "[aria-labelledby=\"v2-contact-faq-heading\"]" },
];

/** The homepage's floating navigation; it appears once the hero is behind you. */
export function V2HomeNav() {
  return (
    <V2SiteNav
      brandHref="#v2-main"
      brandSection="top"
      cta={{ label: "Let's talk", href: "#v2-contact", section: "contact" }}
      items={homeNavItems}
      revealAfter="hero"
    />
  );
}
