import Image from "next/image";
import styles from "./v2-hero-artwork.module.css";

function PaperContours() {
  return (
    <svg
      aria-hidden="true"
      className={styles.contours}
      preserveAspectRatio="none"
      viewBox="0 0 560 760"
    >
      <g>
        <path d="M18 702C80 650 74 595 142 554C203 517 270 547 313 495C353 447 323 391 372 348C410 316 471 334 541 292" />
        <path d="M7 668C61 625 72 572 130 532C191 490 260 523 295 466C328 413 298 365 349 321C395 281 465 301 552 248" />
        <path d="M28 739C103 680 103 622 164 588C228 552 291 579 338 530C388 478 357 425 408 387C448 357 500 370 556 342" />
        <path d="M44 610C99 572 111 521 165 487C220 452 275 478 315 429C354 381 334 342 378 300C416 264 466 261 535 218" />
        <path d="M96 757C139 700 191 676 244 679C316 683 342 625 389 589C435 553 491 572 558 532" />
        <path d="M32 528C82 491 96 442 143 411C195 376 249 402 283 355C320 305 300 270 344 229C393 185 456 197 532 156" />
        <path d="M10 472C61 439 73 395 126 361C180 327 233 352 266 308C303 258 279 222 326 181C371 143 433 153 511 112" />
      </g>
    </svg>
  );
}

function OrbitMark() {
  return (
    <div aria-hidden="true" className={styles.orbitMark}>
      <svg viewBox="0 0 120 120">
        <defs>
          <path
            d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
            id="v2-orbit-path"
          />
        </defs>
        <text>
          <textPath href="#v2-orbit-path">BUILD / LEARN / SHIP / REPEAT / </textPath>
        </text>
      </svg>
      <span>&#10035;</span>
    </div>
  );
}

export function V2HeroArtwork() {
  return (
    <div aria-hidden="true" className={styles.stage}>
      <div className={styles.paperCollage}>
        <span className={styles.backSheet} />
        <span className={styles.frontSheet} />
        <PaperContours />
        <span className={styles.hatch} />
        <span className={styles.foldLine} />
      </div>

      <div className={styles.portraitFrame}>
        <Image
          alt=""
          className={styles.portrait}
          height={1537}
          priority
          sizes="(max-width: 720px) 94vw, (max-width: 1200px) 620px, 700px"
          src="/v2/remar-profile-side-cutout-v2.png"
          width={1023}
        />
      </div>

      <OrbitMark />
    </div>
  );
}
