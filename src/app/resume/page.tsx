import { CareerDocument } from "@/features/career/career-document";
import { careerMetadata } from "@/features/career/career-metadata";

export const metadata = careerMetadata("resume");

export default function ResumePage() {
  return <CareerDocument kind="resume" />;
}
