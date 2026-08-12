const entranceBootScript = `
  (function () {
    var root = document.documentElement;
    var storageKey = "portfolio-v2-intro-seen-v1";
    var query = new URLSearchParams(window.location.search);
    var forceReplay = query.has("intro");
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      root.dataset.v2Entrance = "complete";
      return;
    }

    try {
      if (!forceReplay && window.sessionStorage.getItem(storageKey)) {
        root.dataset.v2Entrance = "complete";
        return;
      }
      window.sessionStorage.setItem(storageKey, "true");
    } catch (_) {}

    root.dataset.v2Entrance = "pending";

    window.setTimeout(function () {
      if (root.dataset.v2Entrance === "pending") {
        root.dataset.v2Entrance = "complete";
      }
    }, 6500);
  })();
`;

export function V2EntranceBoot() {
  return <script dangerouslySetInnerHTML={{ __html: entranceBootScript }} />;
}
