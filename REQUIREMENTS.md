# Portfolio Website Requirements

## 1. Project Overview

Build a typography-first personal portfolio for a software engineer or digital creator. The site should combine the restrained, editorial quality of [Bryl Lim](https://bryllim.com/) with the clear project storytelling and professional presentation of [Ryan Fitzgerald](https://ryanfitzgerald.ca/).

The result must feel clean, quiet, premium, and engineering-focused. Visual hierarchy should come from typography, spacing, content, and subtle motion rather than decorative effects.

## 2. Project Goals

- Present the portfolio owner, capabilities, selected work, experience, and contact details clearly.
- Make project case studies the strongest proof of expertise.
- Deliver a fast, accessible, responsive, and SEO-friendly experience.
- Keep content easy to maintain through typed data and MDX.
- Establish an architecture that can grow without creating monolithic components or tightly coupled services.
- Encourage visitors to view work, download a résumé, or start a conversation.

## 3. Target Audience

- Hiring managers and recruiters
- Potential clients and collaborators
- Engineering and design peers
- Founders and product teams seeking technical expertise

## 4. Technology Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 15 | App Router, routing, rendering, metadata, and API endpoints |
| UI | React 19 | Component-based user interface |
| Language | TypeScript | Type safety across content, UI, and services |
| Styling | Tailwind CSS v4 | Responsive styling and design tokens |
| Components | shadcn/ui + Radix UI | Accessible UI primitives where needed |
| Animation | Motion | Subtle transitions and interaction feedback |
| Icons | Lucide React | Consistent interface and social icons |
| Fonts | Geist Sans + Geist Mono | Primary typography system |
| Content | MDX | Project case studies and long-form content |
| Backend | Next.js API Routes and Server Actions | Contact and server-side workflows |
| Database | Supabase/PostgreSQL (optional) | Structured or dynamic data if required later |
| Email | Resend | Contact-form delivery and acknowledgement |
| Storage | Cloudflare R2 | Project images, résumé, and downloadable assets |
| Analytics | Vercel Analytics or Plausible | Privacy-conscious traffic and conversion insights |
| Version Control | GitHub | Source control and collaboration |
| Deployment | Vercel | Preview and production deployments |
| Domain | Hostinger-managed domain | DNS configuration for the production URL |

## 5. Design Direction

### 5.1 Visual Principles

- Typography-first and content-led
- Editorial, minimal, and intentionally understated
- Left-aligned layouts with a strong reading rhythm
- Compact text blocks balanced by generous section spacing
- Mostly neutral colors with one restrained accent color
- Thin borders, subtle dividers, and low-elevation surfaces
- Minimal use of cards; content should not feel boxed in unnecessarily
- No excessive gradients, glass effects, oversized decoration, or ornamental animation
- Dark mode may be included if it receives the same design and accessibility care as light mode

### 5.2 Layout

- Use a centered page container with a maximum readable width.
- Use a narrower measure for long-form text and a wider measure for project media.
- Preserve clear vertical rhythm between major sections.
- Let project imagery and case-study content expand beyond the body copy where useful.
- Maintain consistent alignment across navigation, headings, metadata, and footer content.
- Adapt gracefully from mobile through large desktop screens without horizontal overflow.

### 5.3 Color Requirements

Exact values should be defined as semantic design tokens during implementation.

- Background: warm or neutral near-white
- Foreground: near-black rather than absolute black
- Muted foreground: accessible neutral gray
- Border: subtle neutral gray
- Accent: one restrained brand color used sparingly
- Focus: highly visible keyboard-focus color
- Dark mode, if supported, must use equivalent semantic tokens rather than inverted hardcoded colors

All meaningful text and interactive states must meet WCAG 2.2 AA contrast requirements.

## 6. Typography System

### 6.1 Font Families

- **Geist Sans:** all display text, headings, navigation, buttons, form controls, and body copy.
- **Geist Mono:** metadata such as years, technology stacks, categories, labels, and small technical details.
- Fonts must be loaded through `next/font` and exposed through global design tokens.
- Font fallbacks must prevent layout failure if a web font does not load.

### 6.2 Type Scale

| Element | Desktop Size | Weight | Line Height | Letter Spacing |
| --- | ---: | ---: | ---: | ---: |
| Display/Hero | 64px | 700 | 1.05 | -0.05em |
| H1 | 48px | 700 | 1.1 | -0.04em |
| H2 | 32px | 650 | 1.2 | -0.03em |
| H3 | 22px | 600 | 1.3 | Normal |
| H4 | 18px | 600 | 1.4 | Normal |
| Body Large | 18px | 400 | 1.75 | 0 |
| Body | 16px | 400 | 1.7 | 0 |
| Small | 14px | 400 | 1.6 | 0 |
| Caption | 12px | 500 | 1.5 | Slightly increased when used as a label |

Notes:

- Use responsive `clamp()` values for display and major headings so mobile typography remains balanced.
- Use 400 for body copy, 500 for navigation and controls, 600 for subheadings and project titles, and 700 for hero and primary page headings.
- Avoid using bold weight for emphasis inside normal body copy unless semantically necessary.
- Keep prose at approximately 60-75 characters per line.

## 7. Information Architecture

### 7.1 Required Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage with introduction, selected work, profile summary, and contact call to action |
| `/work` | Complete project index with concise metadata |
| `/work/[slug]` | MDX-powered project case study |
| `/about` | Biography, approach, capabilities, experience, and résumé link |
| `/contact` | Contact details and accessible contact form |
| `/api/contact` | Validated server endpoint if the form is not implemented entirely with a Server Action |

Optional routes may include `/writing`, `/writing/[slug]`, or a custom not-found page once the core portfolio is complete.

### 7.2 Global Navigation

- Display the portfolio owner's name or wordmark.
- Link to Work, About, and Contact.
- Indicate the current section accessibly.
- Include a compact mobile navigation pattern.
- Keep primary contact access visible without overpowering the navigation.
- Support full keyboard operation and predictable focus order.

## 8. Page Requirements

### 8.1 Homepage

The homepage must include:

1. A concise hero introduction stating the owner's name, discipline, and value proposition.
2. One primary action to view selected work and one secondary contact or résumé action.
3. A selected-work section containing approximately three to six projects.
4. A short profile or working-principles section.
5. A compact capabilities or technology summary.
6. A clear contact call to action.
7. A footer with email, relevant social links, location or timezone if desired, and copyright information.

### 8.2 Work Index

- List projects in a calm editorial layout rather than a dense dashboard grid.
- Show project title, short description, role, year, and selected technologies.
- Use optimized cover imagery when it materially improves the presentation.
- Make the entire project entry easy to discover without relying on inaccessible nested links.
- Support featured and non-featured project ordering through content metadata.

### 8.3 Project Case Study

Each case study should support:

- Title and concise project summary
- Cover image or visual preview
- Role, year, client or context, duration, and technology metadata
- Problem or opportunity
- Constraints and responsibilities
- Process and key decisions
- Implementation or solution
- Outcomes, impact, and measurable results when available
- Image gallery, captions, and optional video embeds
- Relevant live-site and source-code links
- Previous/next project navigation
- Final contact call to action

Case studies must remain readable even when images or optional metadata are absent.

### 8.4 About Page

- Professional biography written in first person
- Current focus and working approach
- Core capabilities and selected technology experience
- Career or experience timeline using Geist Mono for dates
- Optional portrait with meaningful alternative text or empty alt text when decorative
- Downloadable résumé link
- Contact call to action

### 8.5 Contact Page

- Display a direct email option in addition to the form.
- Collect name, email address, optional company, and message.
- Include clear labels, instructions, validation, and error messages.
- Provide pending, success, and failure states without losing entered content unnecessarily.
- Use a server-side validation schema and sanitize untrusted input.
- Send submissions through Resend.
- Include spam protection such as a honeypot and rate limiting; add CAPTCHA only if abuse warrants it.
- Do not expose email provider keys or other secrets to the browser.

## 9. Content Model

Project MDX frontmatter should support the following shape:

```ts
type Project = {
  title: string;
  slug: string;
  summary: string;
  year: number;
  role: string;
  technologies: string[];
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  order: number;
  client?: string;
  duration?: string;
  liveUrl?: string;
  repositoryUrl?: string;
  publishedAt?: string;
};
```

Content requirements:

- Content and presentation must remain separate.
- Frontmatter must be validated during development or build time.
- Image alternative text and meaningful captions must live with the content.
- Draft content must not appear in production.
- Project ordering must be explicit and deterministic.
- External links must be identified where context is unclear and use safe link attributes.

## 10. Component and Code Architecture

Use the Next.js App Router with Server Components by default. Add Client Components only where browser state, event handlers, or animation require them.

Suggested organization:

```text
src/
  app/
    (site)/
    api/
  components/
    layout/
    sections/
    projects/
    ui/
  content/
    projects/
  features/
    contact/
  lib/
    content/
    email/
    validation/
  styles/
  types/
```

Architecture rules:

- Keep UI, business logic, content parsing, validation, and third-party integrations separate.
- Give each module one clear responsibility.
- Reuse primitives without creating abstractions before they are needed.
- Avoid barrel files that introduce circular dependencies or obscure module ownership.
- Keep all files below the hard limit of 600 lines; plan a split as files approach 500 lines.
- Keep secrets and privileged clients in server-only modules.
- Use shadcn/ui selectively for interactive primitives, not as a visual design substitute.

## 11. Motion and Interaction

- Motion should reinforce hierarchy and state, not compete with content.
- Use short opacity and transform transitions for page sections, navigation, and project previews.
- Keep typical interface transitions between 150ms and 300ms.
- Avoid large parallax effects, scroll hijacking, cursor replacements, and continuous decorative movement.
- Respect `prefers-reduced-motion` and provide a functionally equivalent reduced-motion experience.
- Links, buttons, form fields, and project entries must have clear hover, focus, active, pending, and disabled states where applicable.

## 12. Responsive Requirements

- Design mobile-first from a minimum supported viewport width of 320px.
- Provide intentional layouts for mobile, tablet, laptop, and wide desktop sizes.
- Reduce display typography fluidly on smaller screens.
- Stack project metadata without harming reading order.
- Ensure media stays within its container and retains an appropriate aspect ratio.
- Ensure tap targets are at least 44 by 44 CSS pixels where practical.
- Do not hide essential content or functionality on small screens.

## 13. Accessibility Requirements

- Target WCAG 2.2 Level AA.
- Use semantic landmarks and a logical heading hierarchy.
- Include a keyboard-accessible skip link.
- Make all functionality operable using a keyboard.
- Keep focus visible and unobscured.
- Provide useful image alternative text and captions.
- Associate form errors with their fields and announce submission results.
- Do not rely on color alone to communicate state.
- Use ARIA only where native HTML semantics are insufficient.
- Test with automated tooling and manual keyboard navigation.

## 14. Performance Requirements

- Target Lighthouse scores of 90 or higher for Performance, Accessibility, Best Practices, and SEO on representative production pages.
- Target Core Web Vitals in the “good” range: LCP at or below 2.5s, INP at or below 200ms, and CLS at or below 0.1 at the 75th percentile.
- Use `next/image` with correct dimensions, responsive sizes, and modern formats.
- Load only the font weights used by the interface.
- Minimize client-side JavaScript and third-party scripts.
- Lazy-load below-the-fold media and non-critical embeds.
- Cache static content and use static generation for portfolio pages where practical.

## 15. SEO and Sharing

- Provide unique titles and descriptions for every page.
- Use Next.js Metadata APIs and a consistent title template.
- Generate canonical URLs, `sitemap.xml`, and `robots.txt`.
- Provide Open Graph and social-sharing metadata with project-specific images.
- Add appropriate Person and CreativeWork/Article structured data where useful.
- Use descriptive URLs and stable project slugs.
- Ensure the production domain uses HTTPS and redirects consistently to one canonical host.

## 16. Analytics and Privacy

- Use either Vercel Analytics or Plausible, not both by default.
- Track only useful, privacy-conscious events such as project views, résumé downloads, outbound project links, and successful contact submissions.
- Never send contact-form content or other personal data to analytics.
- Add a privacy notice if collected data, cookies, or regional requirements make one necessary.

## 17. Security and Reliability

- Store credentials in environment variables and document required variable names in `.env.example`.
- Validate all server inputs and return safe, user-readable errors.
- Rate-limit public mutation endpoints.
- Configure security headers appropriate to deployed assets and third-party services.
- Do not render unsanitized user-provided HTML.
- Log server failures without exposing secrets or personal message content.
- Provide a friendly not-found page and graceful fallback states for missing content or media.

## 18. Deployment Requirements

- Use GitHub as the source repository.
- Enable Vercel preview deployments for pull requests or branches.
- Deploy the production branch to Vercel.
- Configure the Hostinger-managed domain through DNS to the Vercel project.
- Add environment variables independently for local, preview, and production environments.
- Verify contact email, redirects, metadata, analytics, and asset delivery on the production domain.
- Document Cloudflare R2 CORS and allowed-host settings if R2 is enabled.

## 19. Testing and Quality Gates

Before release:

- Run formatting, linting, type checking, and production build checks.
- Add unit tests for content parsing, validation, and other non-trivial logic.
- Add integration tests for the contact submission workflow.
- Add end-to-end smoke tests for navigation, project routes, keyboard access, and form states.
- Check layouts at common breakpoints and at 200% browser zoom.
- Verify there are no broken internal links, missing images, or missing metadata.
- Confirm that no source file exceeds 600 lines.

## 20. MVP Scope

The first production release includes:

- Responsive global layout and navigation
- Homepage
- Work index
- At least three MDX project case studies
- About page
- Contact page with Resend integration and spam protection
- Résumé download
- Responsive images and project media
- SEO metadata, sitemap, robots rules, and social images
- One analytics provider
- Accessibility, performance, and cross-browser verification
- Vercel deployment with the production domain configured

The following are explicitly optional after MVP:

- Supabase-backed content or administration
- Writing or journal section
- Full CMS
- Advanced project filters or search
- Newsletter subscription
- Multiple languages
- Theme switching
- Complex page transitions or experimental interactions

## 21. Definition of Done

The portfolio is complete when:

- All MVP routes and content are implemented and production-ready.
- The visual result follows the defined typography, spacing, and minimal editorial direction.
- All primary workflows work on current Chrome, Safari, Firefox, and Edge versions.
- The site is usable with a keyboard, reduced motion, and common assistive technologies.
- Contact submissions are validated, protected, delivered, and recover gracefully from errors.
- Content authors can add a project through a documented MDX file without changing page components.
- Quality checks pass with no TypeScript, lint, build, or broken-link errors.
- No code file exceeds 600 lines.
- The production deployment is connected to the canonical domain and has verified metadata, analytics, and monitoring.

