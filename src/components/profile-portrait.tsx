import Image from "next/image";
import { TranslatedText } from "@/features/translation/translation-provider";
import profileImage from "../../my_img.png";

export function ProfilePortrait() {
  return (
    <div className="portrait">
      <Image
        alt="Remar Ugsimar"
        className="portrait__image"
        fill
        priority
        sizes="(max-width: 767px) calc(100vw - 48px), 260px"
        src={profileImage}
      />
      <div className="availability portrait__availability">
        <span aria-hidden="true" className="availability__dot" />
        <TranslatedText text="Available for work" />
      </div>
    </div>
  );
}
