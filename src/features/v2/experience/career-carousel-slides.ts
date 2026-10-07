/** Positions each real project around the active slide without duplicating links. */
export function getCareerSlideOffset(projectIndex: number, activeIndex: number, count: number) {
  if (count <= 1) return 0;
  const offset = (projectIndex - activeIndex + count) % count;
  return offset === count - 1 ? -1 : offset;
}
