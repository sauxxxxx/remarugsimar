import type {
  IncidentKind,
  Point,
  RescueSystem,
  RescueTool,
} from "./production-rescue.types";

export const RESCUE_DURATION = 75;

export const INCIDENT_TOOL: Record<IncidentKind, RescueTool> = {
  fire: "wrench",
  hardware: "wrench",
  malware: "wrench",
};

export const INCIDENT_LABEL: Record<IncidentKind, string> = {
  fire: "overheating",
  hardware: "hardware fault",
  malware: "malware breach",
};

export const TOOL_LABEL: Record<RescueTool, string> = {
  ammo: "ammo pack",
  coffee: "coffee",
  gun: "bug gun",
  wrench: "repair wrench",
};

export const INITIAL_SYSTEMS: RescueSystem[] = [
  { age: 0, health: "healthy", id: "rack-a", incident: null, label: "Server A", x: 610, y: 290 },
  { age: 0, health: "healthy", id: "rack-b", incident: null, label: "Server B", x: 780, y: 290 },
  { age: 0, health: "healthy", id: "rack-c", incident: null, label: "Server C", x: 950, y: 290 },
  { age: 0, health: "healthy", id: "desk-west", incident: null, label: "West desk", x: 365, y: 625 },
  { age: 0, health: "healthy", id: "desk-east", incident: null, label: "East desk", x: 1160, y: 625 },
  { age: 0, health: "healthy", id: "network-core", incident: null, label: "Network core", x: 1120, y: 430 },
];

export const COFFEE_STATION: Point = { x: 205, y: 500 };

export const AMMO_PICKUP_SPAWNS: Point[] = [
  { x: 650, y: 520 },
  { x: 880, y: 520 },
  { x: 600, y: 850 },
  { x: 930, y: 850 },
];

export const PRODUCTION_RESCUE_COPY = {
  title: "Production Rescue",
  description: "Keep a live SaaS operation online through one very bad shift.",
  readyTitle: "Your shift starts now",
  readyText: "Match each incident with the right tool, intercept bugs, and survive the final outage.",
  start: "Start shift",
  resume: "Resume shift",
  restart: "Restart shift",
  won: "Production survived",
  lost: "Production is down",
} as const;
