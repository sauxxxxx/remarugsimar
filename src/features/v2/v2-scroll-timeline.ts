export const STAGE_SETTLE_UNITS = 2.4;
export const PROJECT_INTERVAL_UNITS = 1.5;

const CLOSING_REVEAL_OFFSET_UNITS = 0.42;
const CLOSING_SETTLE_OFFSET_UNITS = 1.28;
const ABOUT_REVEAL_OFFSET_UNITS = 0.72;
const ABOUT_SETTLE_OFFSET_UNITS = 1.95;
const REST_REVEAL_OFFSET_UNITS = 0.9;
const REST_SETTLE_OFFSET_UNITS = 2.3;
const CONTACT_REVEAL_OFFSET_UNITS = 1.7;
const CONTACT_SETTLE_OFFSET_UNITS = 2.95;
const CONTACT_HOLD_UNITS = 1.25;

export function getProjectSettleUnit(index: number) {
  return STAGE_SETTLE_UNITS + index * PROJECT_INTERVAL_UNITS;
}

export function getLastProjectSettleUnit(projectCount: number) {
  return getProjectSettleUnit(Math.max(0, projectCount - 1));
}

export function getClosingRevealUnit(projectCount: number) {
  return getLastProjectSettleUnit(projectCount) + CLOSING_REVEAL_OFFSET_UNITS;
}

export function getClosingSettleUnit(projectCount: number) {
  return getLastProjectSettleUnit(projectCount) + CLOSING_SETTLE_OFFSET_UNITS;
}

export function getAboutRevealUnit(projectCount: number) {
  return getClosingSettleUnit(projectCount) + ABOUT_REVEAL_OFFSET_UNITS;
}

export function getAboutSettleUnit(projectCount: number) {
  return getClosingSettleUnit(projectCount) + ABOUT_SETTLE_OFFSET_UNITS;
}

export function getRestRevealUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + REST_REVEAL_OFFSET_UNITS;
}

export function getRestSettleUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + REST_SETTLE_OFFSET_UNITS;
}

export function getContactRevealUnit(projectCount: number) {
  return getRestSettleUnit(projectCount) + CONTACT_REVEAL_OFFSET_UNITS;
}

export function getContactSettleUnit(projectCount: number) {
  return getRestSettleUnit(projectCount) + CONTACT_SETTLE_OFFSET_UNITS;
}

export function getProjectScrollUnits(projectCount: number) {
  return getContactSettleUnit(projectCount) + CONTACT_HOLD_UNITS;
}
