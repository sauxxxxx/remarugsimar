export const STAGE_SETTLE_UNITS = 2.4;
export const PROJECT_INTERVAL_UNITS = 1.5;

const CLOSING_REVEAL_OFFSET_UNITS = 0.42;
const CLOSING_SETTLE_OFFSET_UNITS = 1.28;
const WHAT_I_DO_REVEAL_OFFSET_UNITS = 0.72;
const WHAT_I_DO_SETTLE_OFFSET_UNITS = 1.95;
const ABOUT_REVEAL_OFFSET_UNITS = 0.9;
const ABOUT_SETTLE_OFFSET_UNITS = 2.1;
const EXPERIENCE_REVEAL_OFFSET_UNITS = 1.35;
const EXPERIENCE_SETTLE_OFFSET_UNITS = 2.55;
const CONTACT_REVEAL_OFFSET_UNITS = 1.45;

export function getProjectSettleUnit(index: number) {
  return STAGE_SETTLE_UNITS + index * PROJECT_INTERVAL_UNITS;
}

export function getActiveProjectIndex(progress: number, projectCount: number, scrollUnits: number) {
  const nearest = Math.round((progress * scrollUnits - STAGE_SETTLE_UNITS) / PROJECT_INTERVAL_UNITS);
  return Math.max(0, Math.min(projectCount - 1, nearest));
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
  return getWhatIDoSettleUnit(projectCount) + ABOUT_REVEAL_OFFSET_UNITS;
}

export function getAboutSettleUnit(projectCount: number) {
  return getWhatIDoSettleUnit(projectCount) + ABOUT_SETTLE_OFFSET_UNITS;
}

export function getWhatIDoRevealUnit(projectCount: number) {
  return getClosingSettleUnit(projectCount) + WHAT_I_DO_REVEAL_OFFSET_UNITS;
}

export function getWhatIDoSettleUnit(projectCount: number) {
  return getClosingSettleUnit(projectCount) + WHAT_I_DO_SETTLE_OFFSET_UNITS;
}

export function getExperienceRevealUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + EXPERIENCE_REVEAL_OFFSET_UNITS;
}

export function getExperienceSettleUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + EXPERIENCE_SETTLE_OFFSET_UNITS;
}

export function getContactRevealUnit(projectCount: number) {
  return getExperienceSettleUnit(projectCount) + CONTACT_REVEAL_OFFSET_UNITS;
}

export function getProjectScrollUnits(projectCount: number) {
  // End the sticky sequence on the settled Glimpse, then scroll the page normally.
  return getClosingSettleUnit(projectCount) + 0.9;
}
