import Image from "next/image";
import { TranslatedText } from "@/features/translation/translation-provider";
import type { ProjectScreenshot } from "@/lib/portfolio-data";

type ProjectGalleryProps = {
  screenshots: readonly ProjectScreenshot[];
};

export function ProjectGallery({ screenshots }: ProjectGalleryProps) {
  if (!screenshots.length) return null;

  return (
    <section aria-labelledby="project-gallery-heading" className="case-study__gallery" id="gallery">
      <header className="case-study__gallery-header">
        <div>
          <span>04</span>
          <h2 id="project-gallery-heading"><TranslatedText text="Project gallery" /></h2>
        </div>
        <p>{screenshots.length} screens</p>
      </header>

      <div className="case-study__gallery-grid">
        {screenshots.map((screenshot, index) => (
          <figure key={screenshot.src}>
            <div className="case-study__gallery-image">
              <Image
                alt={screenshot.alt}
                fill
                loading="lazy"
                sizes="(max-width: 767px) calc(100vw - 40px), 52vw"
                src={screenshot.src}
              />
            </div>
            <figcaption>{String(index + 1).padStart(2, "0")} / {screenshot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
