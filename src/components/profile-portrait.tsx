import Image from "next/image";
import profileImage from "../../my_img-trimmed.png";

export function ProfilePortrait() {
  return (
    <div className="profile-editorial__portrait">
      <Image
        alt="Remar Ugsimar"
        className="profile-editorial__portrait-image"
        fill
        priority
        sizes="(max-width: 767px) 52vw, 320px"
        src={profileImage}
      />
    </div>
  );
}
