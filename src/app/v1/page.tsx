import type { Metadata } from "next";
import { AboutPanel } from "@/components/about-panel";
import { EntranceTransition } from "@/components/entrance-transition";
import { FocusModeShell } from "@/components/focus-mode-shell";
import { ProfilePanel } from "@/components/profile-panel";
import { TranslatedText } from "@/features/translation/translation-provider";
import { siteConfig, socialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Portfolio V1` },
  description: siteConfig.description,
  alternates: { canonical: "/v1" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/v1",
    siteName: `${siteConfig.name} Portfolio`,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [socialImage.url],
  },
};

export default function PortfolioV1Page() {
  return (
    <>
      <EntranceTransition />
      <a className="skip-link" href="#about">
        <TranslatedText text="Skip to about" />
      </a>
      <FocusModeShell profile={<ProfilePanel />} content={<AboutPanel />} />
    </>
  );
}
