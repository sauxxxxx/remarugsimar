type TechnologyTagsProps = {
  label: string;
  technologies: readonly string[];
  variant?: "default" | "selected";
};

export function TechnologyTags({
  label,
  technologies,
  variant = "default",
}: TechnologyTagsProps) {
  return (
    <ul
      aria-label={label}
      className={`technology-tags${variant === "selected" ? " technology-tags--selected" : ""}`}
    >
      {technologies.map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
  );
}
