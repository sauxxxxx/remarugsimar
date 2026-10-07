import Image from "next/image";
import styles from "./v2-career-roadmap.module.css";

const logos: Record<string, { file: string; monochrome?: boolean }> = {
  "Vue.js": { file: "vue" }, "Node.js": { file: "node" },
  "Flutter": { file: "flutter" },
  "Supabase": { file: "supabase" }, "Firebase": { file: "firebase" },
  "WordPress": { file: "wordpress", monochrome: true }, "Elementor": { file: "elementor", monochrome: true },
  "JavaScript": { file: "javascript" }, "Tailwind CSS": { file: "tailwind" },
};

export function V2CareerTools({ technologies }: { technologies: readonly string[] }) {
  return (
    <div className={styles.toolGroup}>
      <p className={styles.eyebrow}>Tools &amp; skills</p>
      <ul className={styles.tools}>
        {technologies.map((tool) => {
          const logo = logos[tool];
          return <li key={tool} className={logo ? styles.tool : styles.skill}>
            {logo && <Image src={`/v2/experience/tools/${logo.file}.svg`} alt="" width={28} height={28} className={logo.monochrome ? styles.monochrome : undefined} />}
            <span>{tool}</span>
          </li>;
        })}
      </ul>
    </div>
  );
}
