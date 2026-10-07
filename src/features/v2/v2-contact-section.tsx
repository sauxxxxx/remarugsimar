"use client";

import { profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { contactHref } from "./closing/closing-content";
import { useSectionEntrance } from "./scroll/use-section-entrance";
import { V2ContactFaqs } from "./closing/v2-contact-faqs";
import styles from "./v2-contact-section.module.css";

const socialIcons = { github: Github, linkedin: Linkedin, email: Mail };
const socialLabels = { github: "GitHub", linkedin: "LinkedIn", email: "Email" };
const socialLinks = profileLinks.filter((link) => link.label !== "resume");

export function V2ContactSection() {
  const entranceRef = useSectionEntrance();
  return (
    <div className={styles.section} data-v2-reveal-root ref={entranceRef}>
      <section aria-labelledby="v2-contact-heading" className={styles.contact} id="v2-contact">
        <div className={styles.invitation}>
          <h2 data-v2-reveal="heading" id="v2-contact-heading">Have a workflow<br className={styles.headlineBreak} /> worth improving?</h2>
          <p className={styles.support} data-v2-reveal="copy">Let&apos;s talk about what you need to build.</p>
          <a className={styles.cta} data-v2-reveal="visual" href={contactHref}>
            Discuss your project <ArrowUpRight aria-hidden="true" size={20} />
          </a>
          <div className={styles.details} data-v2-reveal="visual">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p>{siteConfig.location.city}, {siteConfig.location.country}</p>
          </div>
        </div>
        <V2ContactFaqs />
      </section>

      <footer className={styles.footer} data-v2-reveal="copy">
        <Link className={styles.brand} href="/"><strong>{siteConfig.name}</strong><span>Full-stack developer</span></Link>
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
                <Icon aria-hidden="true" size={22} strokeWidth={1.6} />
              </a>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
