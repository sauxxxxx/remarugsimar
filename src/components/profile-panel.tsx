import { LanguageSelector } from "@/features/translation/language-selector";
import { TranslatedText } from "@/features/translation/translation-provider";
import { StackBuilderLauncher } from "@/features/stack-builder/stack-builder-launcher";
import { PortfolioSearch } from "@/features/portfolio-search/portfolio-search";
import { profileCopy, profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { ProfileNavigation } from "./profile-navigation";
import { ProfilePortrait } from "./profile-portrait";
import { ProfileStats } from "./profile-stats";
import { ThemeToggle } from "./theme-toggle";

export function ProfilePanel() {
  return (
    <aside aria-labelledby="profile-name" className="profile-panel">
      <div className="profile-panel__content">
        <div className="profile-overview">
          <ProfilePortrait />

          <div className="profile-summary">
            <div className="identity">
              <h1 id="profile-name">Remar Ugsimar</h1>
              <p className="identity__title">
                <TranslatedText text={profileCopy.title} />
              </p>
            </div>

            <p className="profile-intro">
              <TranslatedText text={profileCopy.introduction} />
            </p>

            <p className="profile-availability">
              <TranslatedText text={profileCopy.availability} />
            </p>

            <div className="profile-actions">
              <a className="profile-actions__primary" href="#projects">
                <TranslatedText text="Selected projects" />
                <span aria-hidden="true">↓</span>
              </a>
              <a href="#contact">
                <TranslatedText text="start a conversation" />
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <nav aria-label="Profile links" className="profile-links">
              {profileLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <ProfileStats />

        <div className="profile-lower">
          <footer className="profile-footer">
            <div className="profile-utilities">
              <ThemeToggle />
              <PortfolioSearch includeGame />
              <LanguageSelector />
              <StackBuilderLauncher />
            </div>
            <p>
              <TranslatedText text={profileCopy.footer} />
            </p>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </footer>
          <ProfileNavigation />
        </div>
      </div>
    </aside>
  );
}
