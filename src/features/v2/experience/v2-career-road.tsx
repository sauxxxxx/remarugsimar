import styles from "./v2-career-roadmap.module.css";

function Road({ path, width, branch = false }: { path: string; width: number; branch?: boolean }) {
  return (
    <g className={branch ? styles.sideRoad : undefined}>
      <path d={path} className={styles.roadShadow} strokeWidth={width + 12} />
      <path d={path} className={styles.roadEdge} strokeWidth={width + 3} />
      <path d={path} className={styles.asphalt} strokeWidth={width} />
      <path d={path} className={styles.lane} strokeWidth={1.8} />
    </g>
  );
}

export function V2CareerRoad() {
  return (
    <>
      <svg aria-hidden="true" className={styles.desktopRoad} viewBox="0 0 1280 425" preserveAspectRatio="none">
        <Road path="M 200 245 C 270 245 245 385 430 385 H 1230" width={26} branch />
        <Road path="M 30 245 H 200 C 350 245 350 125 510 125 H 590 C 770 125 770 300 920 300 H 1230" width={52} />
        <path className={styles.direction} d="M 1185 293 l 8 7 l -8 7 M 1204 293 l 8 7 l -8 7" />
      </svg>
      <svg aria-hidden="true" className={styles.mobileRoad} viewBox="0 0 140 440" preserveAspectRatio="none">
        <Road path="M 50 65 C 15 65 15 98 15 150 V 360 Q 15 410 60 410 H 110" width={13} branch />
        <Road path="M 50 15 V 90 C 50 145 100 125 100 190 C 100 255 50 235 50 300 V 370" width={32} />
      </svg>
    </>
  );
}

export function V2CareerPin() {
  return (
    <svg aria-hidden="true" className={styles.pin} viewBox="0 0 52 72">
      <path d="M 26 69 C 21 58 3 42 3 27 A 23 23 0 1 1 49 27 C 49 42 31 58 26 69 Z" />
      <circle cx="26" cy="27" r="9" />
      <circle className={styles.pinCenter} cx="26" cy="27" r="3" />
    </svg>
  );
}
