import Image from "next/image";
import { toolLogos } from "../brand/v2-tool-logos";
import styles from "./v2-career-roadmap.module.css";

export function V2CareerTools({ technologies }: { technologies: readonly string[] }) {
  return (
    <div className={styles.toolGroup}>
      <p className={styles.eyebrow}>Tools &amp; skills</p>
      <ul className={styles.tools}>
        {technologies.map((tool) => {
          const logo = toolLogos[tool];
          return <li key={tool} className={logo ? styles.tool : styles.skill}>
            {logo && <Image src={`/v2/experience/tools/${logo.file}.svg`} alt="" width={28} height={28} className={logo.monochrome ? styles.monochrome : undefined} />}
            <span>{tool}</span>
          </li>;
        })}
      </ul>
    </div>
  );
}
