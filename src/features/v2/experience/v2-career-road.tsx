import Image from "next/image";
import styles from "./v2-career-roadmap.module.css";

export function V2CareerRoad() {
  return (
    <picture className={styles.scenery}>
      <source media="(max-width: 1024px)" srcSet="/v2/experience/rock-road-mobile.webp" />
      <Image src="/v2/experience/rock-road-desktop.webp" alt="" width={1586} height={992} unoptimized className={styles.sceneryImage} />
    </picture>
  );
}

export function V2CareerPin() {
  return <span aria-hidden="true" className={styles.pin}>
    <span className={styles.beacon} />
    <span className={styles.stem} />
    <span className={styles.base} />
  </span>;
}
