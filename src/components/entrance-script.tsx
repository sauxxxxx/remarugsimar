const entranceScript = `
  (function () {
    var root = document.documentElement;
    var storageKey = "portfolio-signature-intro-seen-v3";
    var isHomePage = window.location.pathname === "/";
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isHomePage || prefersReducedMotion) return;

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "true");
    } catch (_) {}

    root.dataset.portfolioEntrance = "pending";

    window.setTimeout(function () {
      delete root.dataset.portfolioEntrance;
    }, 8500);
  })();
`;

export function EntranceScript() {
  return <script dangerouslySetInnerHTML={{ __html: entranceScript }} />;
}
