"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useSyncExternalStore } from "react";
import { siteConfig } from "@/lib/site-config";
import { V2Finale } from "../closing/v2-finale";
import { V2SiteNav } from "../nav/v2-site-nav";
import { V2AmbientBackdrop } from "../ribbons/v2-ambient-backdrop";
import { getV2CaseStudyContent } from "./v2-case-study-content";
import { v2ProjectCatalogue } from "./v2-project-catalogue";
import { v2ProjectHref } from "./v2-project-data";
import { V2ProjectPageHeader } from "./v2-project-page-header";
import { useGalleryReturn, V2SharedImageLink } from "./v2-shared-image";
import styles from "./v2-project-gallery.module.css";

const compactQuery = "(max-width: 760px)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getCompact = () => window.matchMedia(compactQuery).matches;
const getServerCompact = () => false;

export function V2ProjectGallery() {
  const reduceMotion = useReducedMotion() ?? false;
  const compact = useSyncExternalStore(subscribe, getCompact, getServerCompact);
  const { scrollY } = useScroll();

  // The title drifts up at about two thirds of the page's speed.
  const titleY = useTransform(scrollY, [0, 900], [0, 300]);
  const still = reduceMotion;
  useGalleryReturn();
  // Scroll speed, normalised to -1..1 and eased, so the cards bend while the page moves
  // and relax back to flat once it stops.
  const velocity = useVelocity(scrollY);
  const speed = useSpring(
    useTransform(velocity, [-2600, 0, 2600], [-1, 0, 1], { clamp: true }),
    { stiffness: 140, damping: 26, mass: 0.6 },
  );

  // Eased wheel scrolling, so the cards glide and settle rather than step.
  useEffect(() => {
    if (still) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true, anchors: true });
    return () => lenis.destroy();
  }, [still]);

  return (
    <main className={`v2-portfolio-page ${styles.page}`}>
      <V2AmbientBackdrop />
      <a className={styles.skip} href="#v2-work">Skip to projects</a>
      <V2SiteNav
        brandHref="/"
        cta={{ label: "Let's talk", href: `mailto:${siteConfig.email}?subject=${encodeURIComponent("Project inquiry")}`, contact: "" }}
        currentLabel="All projects"
        items={[{ label: "Portfolio", href: "/" }, { label: "All projects", href: "/v2/projects" }]}
      />
      <div className={styles.container}>
        <V2ProjectPageHeader backHref="/" backLabel="Portfolio" editorial />
        <section aria-labelledby="v2-work-title" id="v2-work" tabIndex={-1}>
          <header className={styles.intro}>
            <motion.div className={styles.titleRow} style={still ? undefined : { y: titleY }}>
              <h1 id="v2-work-title">All projects.</h1>
              <div aria-hidden="true" className={styles.titleMeta}>
                <span>{v2ProjectCatalogue.length}</span>
                <ArrowDownRight size={40} strokeWidth={1.2} />
              </div>
            </motion.div>
            <p className={styles.summary}>Software and websites built around real workflows.</p>
          </header>

          <div className={styles.gallery}>
            {v2ProjectCatalogue.map((project, index) => (
              <GalleryCard
                compact={compact}
                speed={speed}
                index={index}
                key={project.slug}
                name={project.name}
                slug={project.slug}
                still={still}
              />
            ))}
          </div>
        </section>
      </div>

      <V2Finale
        actionHref={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Project inquiry")}`}
        actionLabel="Discuss your project"
        headingId="gallery-contact-title"
        headline="Have something in mind?"
        lede="Let's talk about what you need to build."
      />

      <div className={styles.container}>
        <footer className={styles.footer}>
          <Link href="/">Remar Ugsimar <span>Full-stack developer</span></Link>
          <nav aria-label="Footer" className={styles.footerLinks}>
            <Link href="/">Portfolio</Link>
            <a data-v2-contact="" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Project inquiry")}`}>Let&apos;s talk</a>
            <Link className={styles.textLink} href="/">Back to portfolio <ArrowUpRight aria-hidden="true" size={18} /></Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}

function GalleryCard({ compact, index, name, slug, speed, still }: {
  compact: boolean;
  index: number;
  name: string;
  slug: string;
  speed: MotionValue<number>;
  still: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { screen, screenAlt, categoryLabel } = getV2CaseStudyContent(slug);
  // While the page scrolls, cards bend as if on the inside of a curved wall: the further a
  // card is from the middle of the screen, and the faster the scroll, the more it leans,
  // shrinks and trails behind. At rest every card is flat.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // -1 = card at the top edge, 0 = centred, +1 = card at the bottom edge.
  const place = useTransform(scrollYProgress, [0, 1], [1, -1]);
  const maxTilt = compact ? 12 : 32;
  const rotateX = useTransform([place, speed], ([p, v]: number[]) => p * v * maxTilt);
  const scale = useTransform([place, speed], ([p, v]: number[]) => 1 - Math.abs(p * v) * (compact ? 0.06 : 0.14));
  const y = useTransform([place, speed], ([p, v]: number[]) => p * v * (compact ? 36 : 120));

  return (
    <motion.article
      className={styles.project}
      ref={ref}
      style={still ? undefined : { rotateX, scale, transformPerspective: 900, y }}
    >
      <V2SharedImageLink aria-label={`View ${name} case study`} className={styles.projectLink} href={v2ProjectHref(slug)}>
        <div className={styles.preview} data-v2-card-image={slug} data-v2-shared-image>
          <Image
            alt={screenAlt}
            priority={index < 2}
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1264px) calc((100vw - 96px) / 2), 50vw"
            src={screen}
          />
        </div>
        <div className={styles.projectCaption}>
          <MaskedLine still={still}><p>{categoryLabel}</p></MaskedLine>
          <MaskedLine delay={0.06} still={still}>
            <h2>
              <span aria-hidden="true" className={styles.titleArrow}><ArrowRight size={24} strokeWidth={1.4} /></span>
              <span>{name}</span>
            </h2>
          </MaskedLine>
        </div>
      </V2SharedImageLink>
    </motion.article>
  );
}

// A caption line that slides up into view from behind its own edge. The visible mask
// is what gets observed; the text inside starts clipped, so it can never trigger itself.
const lineVariants = {
  hidden: { y: "105%" },
  shown: { y: "0%" },
};

function MaskedLine({ children, delay = 0, still }: { children: ReactNode; delay?: number; still: boolean }) {
  if (still) return <>{children}</>;
  return (
    <motion.span
      className={styles.mask}
      initial="hidden"
      viewport={{ amount: 0.5, margin: "0px 0px -6% 0px" }}
      whileInView="shown"
    >
      <motion.span
        className={styles.maskInner}
        transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        variants={lineVariants}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
