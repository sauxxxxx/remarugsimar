import type { Metadata } from "next";
import { socialImage } from "@/lib/site-config";
import { careerDocuments, careerProfile, type CareerDocumentKind } from "./career-content";

export function careerMetadata(kind: CareerDocumentKind): Metadata {
  const document = careerDocuments[kind];
  const title = `${document.label} - ${careerProfile.name}`;
  return {
    title: document.label,
    description: `${document.description} ${careerProfile.name}, ${careerProfile.title}, ${careerProfile.location}.`,
    alternates: { canonical: document.path },
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile", url: document.path, title,
      description: document.description, images: [socialImage],
    },
    twitter: { card: "summary_large_image", title, description: document.description, images: [socialImage.url] },
  };
}
