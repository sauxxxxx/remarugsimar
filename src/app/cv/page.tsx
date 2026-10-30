import { CareerDocument } from "@/features/career/career-document";
import { careerMetadata } from "@/features/career/career-metadata";

export const metadata = careerMetadata("cv");

export default function CvPage() {
  return <CareerDocument kind="cv" />;
}
