"use client";

import { profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { RuMark } from "./brand/ru-mark";
import { contactHref } from "./closing/closing-content";
import { useSectionEntrance } from "./scroll/use-section-entrance";
import { V2ContactFaqs } from "./closing/v2-contact-faqs";
import styles from "./v2-contact-section.module.css";

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
        <h2 data-v2-reveal="heading" id="v2-contact-faq-heading">Before we start</h2>
        <V2ContactFaqs />
      </section>

      <footer aria-labelledby="v2-contact-heading" className={styles.footer} data-v2-reveal="copy" id="v2-contact">
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
          <h2 id="v2-contact-heading">Have an idea?</h2>
        </div>
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
