/* eslint-disable @next/next/no-html-link-for-pages -- Version changes must reload so entrance boot scripts run before hydration. */

type PortfolioVersionSwitchProps = {
  className?: string;
  currentVersion: "v1" | "v2";
};

export function PortfolioVersionSwitch({
  className,
  currentVersion,
}: PortfolioVersionSwitchProps) {
  return (
    <nav
      aria-label="Portfolio version"
      className={className}
    >
      {currentVersion === "v1" ? (
        <span aria-current="page">V1</span>
      ) : (
        <a href="/">V1</a>
      )}
      {currentVersion === "v2" ? (
        <span aria-current="page">V2</span>
      ) : (
        <a href="/v2?intro=1">V2</a>
      )}
    </nav>
  );
}
