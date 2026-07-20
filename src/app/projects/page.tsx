import type { Metadata } from "next";
import Link from "next/link";
import { ExpandedProjectCard } from "@/components/expanded-project-card";
import { SitePageHeader } from "@/components/site-page-header";
import { TranslatedText } from "@/features/translation/translation-provider";
import { projects } from "@/lib/portfolio-data";
import { siteConfig, socialImage } from "@/lib/site-config";

const projectsDescription =
  "Selected SaaS products, CRM systems, AI applications, and websites built by Remar Ugsimar.";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsDescription,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/projects",
    siteName: `${siteConfig.name} Portfolio`,
    title: `Projects — ${siteConfig.name}`,
    description: projectsDescription,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects — ${siteConfig.name}`,
    description: projectsDescription,
    images: [socialImage.url],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <a className="skip-link" href="#all-projects">Skip to projects</a>
      <main className="projects-page">
        <SitePageHeader backHref="/#projects" />
        <section className="projects-page__intro" id="all-projects">
          <div className="projects-page__eyebrow">
            <span aria-hidden="true" />
            <TranslatedText text="all projects" />
            <span>~ {projects.length}</span>
          </div>
          <h1><TranslatedText text="Projects" /></h1>
          <p><TranslatedText text="Selected work across SaaS, CRM, AI, and the web—designed and built for real business needs." /></p>
        </section>

        <section aria-label="Project case studies" className="expanded-projects">
          {projects.map((project, index) => (
            <ExpandedProjectCard index={index} key={project.slug} project={project} />
          ))}
        </section>

        <footer className="projects-page__footer">
          <p><TranslatedText text="Have a project in mind?" /></p>
          <a href="mailto:jarinaremar13@gmail.com">jarinaremar13@gmail.com</a>
          <Link href="/">← <TranslatedText text="back to portfolio" /></Link>
        </footer>
      </main>
    </>
  );
}
