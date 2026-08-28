const entranceScript = `
  (function () {
    var root = document.documentElement;
    var storageKey = "portfolio-signature-intro-seen-v3";
    var isV1Page = window.location.pathname === "/v1";
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isV1Page || prefersReducedMotion) return;

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "true");
    } catch (_) {}

    root.dataset.portfolioEntrance = "pending";

    window.setTimeout(function () {
      delete root.dataset.portfolioEntrance;
    }, 4200);
  })();
`;

export function EntranceScript() {
  return <script dangerouslySetInnerHTML={{ __html: entranceScript }} />;
}
