"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { V2ContactDialog } from "../contact/v2-contact-dialog";
import { V2RibbonCanvas } from "../ribbons/v2-ribbon-canvas";
import styles from "./v2-finale.module.css";

const MINT: readonly [number, number, number] = [0.55, 0.86, 0.79];

// The closing panel used at the end of pages: a glass frame with ribbons behind the rock horizon.
// Its action opens the contact form; actionHref (email) is the fallback without JavaScript.
export function V2Finale({ actionHref, actionLabel, contactContext = "", headingId, headline, id, lede }: {
  actionHref: string;
  actionLabel: string;
  /** What the enquiry is about, shown in the form and the email subject. */
  contactContext?: string;
  headingId: string;
  headline: string;
  id?: string;
  lede: string;
}) {
  return (
    <section aria-labelledby={headingId} className={styles.finale} id={id}>
      <div aria-hidden="true" className={styles.ribbons}>
        <V2RibbonCanvas className={styles.canvas} lift={0.02} slope={-0.1} speed={0.7} tint={MINT} tintAmount={0.3} />
      </div>
      <Image
        alt=""
        aria-hidden="true"
        className={styles.rock}
        fill
        sizes="100vw"
        src="/v2/roarly-volcanic-rock-v2-cutout.webp"
      />
      <div className={styles.copy} data-v2-reveal="heading">
        <h2 className={styles.headline} id={headingId}>{headline}</h2>
        <p className={styles.lede}>{lede}</p>
        <a aria-haspopup="dialog" className={styles.action} data-v2-contact={contactContext} href={actionHref}>
          {actionLabel} <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </div>
      <V2ContactDialog />
    </section>
  );
}
