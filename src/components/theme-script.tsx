const themeScript = `
  (function () {
    try {
      var storedTheme = localStorage.getItem("portfolio-theme");
      var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      var theme = storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : systemTheme;

      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
