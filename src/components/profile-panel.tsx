import { ArrowRight, FileText, Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { LanguageSelector } from "@/features/translation/language-selector";
import { TranslatedText } from "@/features/translation/translation-provider";
import { StackBuilderLauncher } from "@/features/stack-builder/stack-builder-launcher";
import { PortfolioSearch } from "@/features/portfolio-search/portfolio-search";
import { profileCopy, profileLinks } from "@/lib/portfolio-data";
import { PortfolioVersionSwitch } from "./portfolio-version-switch";
import { ProfileCompanion } from "./profile-companion";
import { ProfileNavigation } from "./profile-navigation";
import { ProfilePortrait } from "./profile-portrait";
import { ProfileStats } from "./profile-stats";
import { ThemeToggle } from "./theme-toggle";

const socialIcons = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  resume: FileText,
} as const;

const socialMessages = {
  email: "Send the project brief.",
  github: "Inspect the source code.",
  linkedin: "Connect with Remar.",
  resume: "Review the full résumé.",
} as const;

export function ProfilePanel() {
  return (
    <aside aria-labelledby="profile-name" className="profile-panel">
      <div className="profile-panel__content">
        <div className="profile-editorial__rail">
          <a aria-label="Back to profile" className="profile-editorial__brand" href="#about">
            <span>R</span><i>/</i>
          </a>

          <ProfileNavigation />

          <footer className="profile-editorial__rail-footer">
            <div className="profile-utilities">
              <ThemeToggle />
              <PortfolioSearch includeGame />
              <LanguageSelector />
              <StackBuilderLauncher />
            </div>
            <p>© 2026 Remar Ugsimar<br />All rights reserved.</p>
          </footer>
        </div>

        <div className="profile-editorial__main">
          <header className="profile-editorial__topline">
            <span>01 / profile</span>
            <i aria-hidden="true" />
            <PortfolioVersionSwitch
              className="profile-editorial__version-switch"
              currentVersion="v1"
            />
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

                <div className="availability profile-editorial__availability">
                  <span aria-hidden="true" className="availability__dot" />
                  <TranslatedText text="Available for work" />
                </div>

                <div className="profile-editorial__actions">
                  <a className="profile-editorial__action--primary" href="#projects">
                    <TranslatedText text="Selected projects" />
                    <ArrowRight aria-hidden="true" size={14} strokeWidth={1.5} />
                  </a>
                  <a href="#contact">
                    <TranslatedText text="start a conversation" />
                    <MessageSquare aria-hidden="true" size={13} strokeWidth={1.5} />
                  </a>
                </div>
              </div>

              <nav aria-label="Profile links" className="profile-editorial__socials">
                {profileLinks.map((link) => {
                  const Icon = socialIcons[link.label];

                  return (
                    <a
                      aria-label={link.label}
                      data-companion-message={socialMessages[link.label]}
                      href={link.href}
                      key={link.label}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      target={link.external ? "_blank" : undefined}
                      title={link.label}
                    >
                      <Icon aria-hidden="true" size={15} strokeWidth={1.55} />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            <ProfilePortrait />
          </div>

          <ProfileStats />
          <ProfileCompanion />
        </div>
      </div>
    </aside>
  );
}
