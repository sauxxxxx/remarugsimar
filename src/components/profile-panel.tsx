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
        <header className="profile-editorial__topline">
          <span>01 / profile</span>
          <div className="availability profile-editorial__availability">
            <span aria-hidden="true" className="availability__dot" />
            <TranslatedText text="Available for work" />
          </div>
        </header>

        <div className="profile-editorial__hero">
          <div className="profile-editorial__copy">
            <div className="profile-editorial__identity">
              <h1 id="profile-name">
                <span>Remar</span>
                <span>Ugsimar</span>
              </h1>
              <p>
                <TranslatedText text={profileCopy.title} />
              </p>
            </div>

            <div className="profile-editorial__statement">
              <p>
                <TranslatedText text={profileCopy.introduction} />
              </p>

              <p>
                <TranslatedText text={profileCopy.availability} />
              </p>

              <div className="profile-editorial__actions">
                <a className="profile-editorial__action--primary" href="#projects">
                  <TranslatedText text="Selected projects" />
                  <span aria-hidden="true">↓</span>
                </a>
                <a href="#contact">
                  <TranslatedText text="start a conversation" />
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <nav aria-label="Profile links" className="profile-editorial__socials">
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

          <ProfilePortrait />
        </div>

        <ProfileStats />

        <ProfileNavigation />

        <footer className="profile-editorial__footer">
          <div className="profile-utilities">
            <ThemeToggle />
            <PortfolioSearch includeGame />
            <LanguageSelector />
            <StackBuilderLauncher />
          </div>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </footer>
      </div>
    </aside>
  );
}
