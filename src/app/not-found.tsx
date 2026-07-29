import Link from "next/link";
import { SitePageHeader } from "@/components/site-page-header";

export default function NotFound() {
  return (
    <main className="projects-page content-page">
      <SitePageHeader />
      <section className="projects-page__intro">
        <div className="projects-page__eyebrow">
          <span aria-hidden="true" />
          not found
          <span>404</span>
        </div>
        <h1>This page does not exist.</h1>
        <p>The address may have changed, or the page may have been removed.</p>
        <Link className="case-study__hero-link" href="/">
          return to portfolio <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
