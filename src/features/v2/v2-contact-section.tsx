"use client";

import { profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { RuMark } from "./brand/ru-mark";
import { contactHref } from "./closing/closing-content";
import { useSectionEntrance } from "./scroll/use-section-entrance";
import { V2ContactFaqs } from "./closing/v2-contact-faqs";
import { V2Finale } from "./closing/v2-finale";
import { homeNavItems } from "./nav/v2-home-nav";
import { V2SectionLink } from "./nav/v2-section-link";
import styles from "./v2-contact-section.module.css";
import introStyles from "./scroll/v2-section-intro.module.css";

const socialIcons = { github: Github, linkedin: Linkedin };
const socialLabels = { github: "GitHub", linkedin: "LinkedIn" };
const socialLinks = profileLinks.filter(
  (link): link is typeof link & { label: keyof typeof socialIcons } =>
    link.label === "github" || link.label === "linkedin",
);

export function V2ContactSection() {
  const entranceRef = useSectionEntrance();
  return (
    <div className={styles.section} data-v2-reveal-root ref={entranceRef}>
      <section aria-labelledby="v2-contact-faq-heading" className={styles.questions}>
        <div className={introStyles.intro} data-v2-reveal="heading">
          <h2 className={introStyles.headline} id="v2-contact-faq-heading">Before we start.</h2>
        </div>
        <V2ContactFaqs />
      </section>

      <V2Finale
        actionHref={contactHref}
        actionLabel="Start a project"
        headingId="v2-contact-heading"
        headline="Have an idea?"
        id="v2-contact"
        lede="Built around how you work, from the first idea to launch."
      />

      <footer className={styles.footer} data-v2-reveal="copy">
        <div className={styles.identity}>
          <Link aria-label={`${siteConfig.name} — home`} className={styles.brand} href="/"><RuMark /></Link>
          <nav aria-label="Contact profiles" className={styles.socials}>
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.label];
              return (
                <a
                  aria-label={socialLabels[link.label]}
                  href={link.href}
                  key={link.label}
                  rel={link.external ? "noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.6} />
                </a>
              );
            })}
          </nav>
        </div>
        <nav aria-label="Footer" className={styles.footerLinks}>
          {homeNavItems.map((item) => item.section
            ? <V2SectionLink href={item.href} key={item.label} section={item.section}>{item.label}</V2SectionLink>
            : <a href={item.href} key={item.label}>{item.label}</a>)}
          <Link href="/v2/projects">All projects</Link>
        </nav>
        <a aria-label={`Email Remar at ${siteConfig.email}`} className={styles.email} href={contactHref}>
          <span aria-hidden="true" className={styles.emailWindow}>
            <span className={styles.emailLabel}>Email Remar</span>
            <span className={styles.emailAddress}>{siteConfig.email}</span>
          </span>
          <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.5} />
        </a>
      </footer>
    </div>
  );
}
