const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function getProcessScrollFrame(units: number, count: number, entryDistance: number, activeArrival = 0.8) {
  const progress = clamp(units, 0, count - 1);
  const arrivals = Array.from({ length: count }, (_, index) =>
    index === 0 ? 1 : clamp((progress - index + 0.65) / 0.65, 0, 1),
  );
  let activeIndex = 0;
  const cards = arrivals.map((arrival, index) => {
    if (arrival >= activeArrival) activeIndex = index;
    const covered = arrivals.slice(index + 1).reduce((total, next) => total + next, 0);
    return {
      y: (1 - arrival) * entryDistance - covered * 10,
      scale: 1 - covered * 0.035,
      opacity: arrival > 0 ? 1 : 0,
    };
  });
  return { activeIndex, cards };
}

export function getProcessScrollGeometry(viewportHeight: number, contentHeight: number, cardHeight: number, count: number) {
  const stepDistance = Math.max(360, viewportHeight * 0.85);
  const entryDistance = viewportHeight / 2 + cardHeight / 2 + 24;
  return {
    enabled: viewportHeight >= contentHeight + 64,
    stepDistance,
    runwayHeight: viewportHeight + (count - 1 + 0.45) * stepDistance,
    entryDistance,
    activeArrival: clamp(1 - cardHeight / (2 * entryDistance), 0.5, 0.95),
  };
}
