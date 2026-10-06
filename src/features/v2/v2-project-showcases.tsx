import { v2Projects } from "./projects/v2-project-data";
import { V2ProjectShowcase, type V2ShowcaseProps } from "./projects/v2-project-showcase";

export const projectShowcases = v2Projects.map((project, index) => {
  function Showcase(props: V2ShowcaseProps) {
    return <V2ProjectShowcase {...props} index={index} project={project} />;
  }
  return Showcase;
});
