export const STAGE_SETTLE_UNITS = 2.4;
export const PROJECT_INTERVAL_UNITS = 1.5;

const CLOSING_REVEAL_OFFSET_UNITS = 0.42;
const CLOSING_SETTLE_OFFSET_UNITS = 1.28;
const ABOUT_REVEAL_OFFSET_UNITS = 0.72;
const ABOUT_SETTLE_OFFSET_UNITS = 1.95;
const WHAT_I_DO_REVEAL_OFFSET_UNITS = 0.9;
const WHAT_I_DO_SETTLE_OFFSET_UNITS = 2.1;
const EXPERIMENTS_REVEAL_OFFSET_UNITS = 1.35;
const EXPERIMENTS_SETTLE_OFFSET_UNITS = 2.55;
const EXPERIENCE_REVEAL_OFFSET_UNITS = 1.35;
const EXPERIENCE_SETTLE_OFFSET_UNITS = 2.55;
const CONTACT_REVEAL_OFFSET_UNITS = 1.45;
const CONTACT_SETTLE_OFFSET_UNITS = 2.7;
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

export function getWhatIDoRevealUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + WHAT_I_DO_REVEAL_OFFSET_UNITS;
}

export function getWhatIDoSettleUnit(projectCount: number) {
  return getAboutSettleUnit(projectCount) + WHAT_I_DO_SETTLE_OFFSET_UNITS;
}

export function getExperimentsRevealUnit(projectCount: number) {
  return getWhatIDoSettleUnit(projectCount) + EXPERIMENTS_REVEAL_OFFSET_UNITS;
}

export function getExperimentsSettleUnit(projectCount: number) {
  return getWhatIDoSettleUnit(projectCount) + EXPERIMENTS_SETTLE_OFFSET_UNITS;
}

export function getExperienceRevealUnit(projectCount: number) {
  return getExperimentsSettleUnit(projectCount) + EXPERIENCE_REVEAL_OFFSET_UNITS;
}

export function getExperienceSettleUnit(projectCount: number) {
  return getExperimentsSettleUnit(projectCount) + EXPERIENCE_SETTLE_OFFSET_UNITS;
}

export function getContactRevealUnit(projectCount: number) {
  return getExperienceSettleUnit(projectCount) + CONTACT_REVEAL_OFFSET_UNITS;
}

export function getContactSettleUnit(projectCount: number) {
  return getExperienceSettleUnit(projectCount) + CONTACT_SETTLE_OFFSET_UNITS;
}

export function getProjectScrollUnits(projectCount: number) {
  return getContactSettleUnit(projectCount) + CONTACT_HOLD_UNITS;
}
