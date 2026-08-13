import type { Metadata } from "next";
import { V2Entrance } from "@/features/v2/v2-entrance";
import { V2EntranceBoot } from "@/features/v2/v2-entrance-boot";
import { V2ScrollExperience } from "@/features/v2/v2-scroll-experience";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "Remar Ugsimar — Portfolio V2" },
  description: `${siteConfig.name}'s experimental, motion-led portfolio.`,
  alternates: { canonical: "/v2" },
};

export default function PortfolioV2Page() {
  return (
    <>
      <V2EntranceBoot />
      <V2Entrance />
      <V2ScrollExperience />
    </>
  );
}
