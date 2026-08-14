import { motion, type MotionStyle, type MotionValue } from "motion/react";
import Image from "next/image";
import deviceStyles from "./v2-project-device.module.css";
import { V2ProjectCopy } from "./v2-project-copy";
import styles from "./v2-web-project-showcases.module.css";

type ShowcaseProps = {
  copyRevealProgress: MotionValue<number>;
  copyStyle?: MotionStyle;
  visualStyle?: MotionStyle;
};

type ProjectShowcase = {
  number: string;
  title: string;
  type: string;
  description: string;
  tags: string[];
  href: string;
  image: string;
  imageAlt: string;
  copyClassName: string;
  visualClassName: string;
};

const sharksTail: ProjectShowcase = {
  number: "04",
  title: "The Shark's Tail",
  type: "Dive resort website",
  description:
    "A responsive resort website that brings Malapascua's diving experiences, accommodations, and booking information into one destination.",
  tags: ["Wix", "Responsive design", "SEO"],
  href: "/projects/the-sharks-tail",
  image: "/v2/sharks-tail-browser-left-alpha-v3.webp",
  imageAlt: "The Shark's Tail resort website displayed in a real cinematic browser frame",
  copyClassName: styles.sharksTailCopy,
  visualClassName: styles.browserVisual,
};

const roarlyWebsite: ProjectShowcase = {
  number: "05",
  title: "Roarly Website",
  type: "Product website",
  description:
    "A custom product website combining focused marketing pages, interactive frontend behavior, and database-backed functionality.",
  tags: ["HTML", "CSS", "JavaScript"],
  href: "/projects/roarly-website",
  image: "/v2/roarly-website-laptop-left-alpha-v3.webp",
  imageAlt: "Roarly product website displayed on a real space-black laptop",
  copyClassName: styles.roarlyCopy,
  visualClassName: styles.laptopVisual,
};

const joynoInc: ProjectShowcase = {
  number: "06",
  title: "Joyno Inc.",
  type: "Corporate BPO website",
  description:
    "A corporate website presenting Joyno's BPO services, company philosophy, leadership, and Cebu operations.",
  tags: ["WordPress", "Elementor", "Responsive"],
  href: "/projects/joyno-inc",
  image: "/v2/joyno-inc-monitor-left-alpha-v3.webp",
  imageAlt: "Joyno Inc. corporate website displayed on a real all-in-one monitor",
  copyClassName: styles.joynoIncCopy,
  visualClassName: styles.monitorVisual,
};

function RasterProjectShowcase({
  project,
  copyRevealProgress,
  copyStyle,
  visualStyle,
}: ShowcaseProps & { project: ProjectShowcase }) {
  return (
    <>
      <V2ProjectCopy
        className={project.copyClassName}
        description={project.description}
        href={project.href}
        number={project.number}
        revealProgress={copyRevealProgress}
        style={copyStyle}
        tags={project.tags}
        title={project.title}
        type={project.type}
      />

      <motion.div
        className={`${deviceStyles.deviceStage} ${project.visualClassName}`}
        style={visualStyle}
      >
        <Image
          alt={project.imageAlt}
          className={styles.deviceImage}
          fill
          sizes="(max-width: 980px) 70vw, 1060px"
          src={project.image}
        />
      </motion.div>
    </>
  );
}

export function V2SharksTailShowcase(props: ShowcaseProps) {
  return <RasterProjectShowcase {...props} project={sharksTail} />;
}

export function V2RoarlyWebsiteShowcase(props: ShowcaseProps) {
  return <RasterProjectShowcase {...props} project={roarlyWebsite} />;
}

export function V2JoynoIncShowcase(props: ShowcaseProps) {
  return <RasterProjectShowcase {...props} project={joynoInc} />;
}
