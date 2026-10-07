import type { StaticImageData } from "next/image";
import scoutScreen from "../../../../public/v2/screens/scout.png";
import accountingScreen from "../../../../public/v2/screens/joyno-accounting.png";
import hadsanScreen from "../../../../public/v2/screens/hadsan.png";
import casatoonScreen from "../../../../public/projects/roarly-dashboard.webp";
import syncScreen from "../../../../public/projects/joynosync-dashboard.webp";
import nxoneScreen from "../../../../public/projects/nxone-home.webp";
import sharksScreen from "../../../../public/projects/sharks-tail-home.webp";
import roarlyWebsiteScreen from "../../../../public/projects/roarly-website-home.webp";
import joynoWebsiteScreen from "../../../../public/projects/joyno-inc-home.webp";
import shukeyScreen from "../../../../public/v2/screens/shukey-home.jpg";

type CaseStudyContent = {
  screen: StaticImageData;
  categoryLabel: string;
  screenAlt: string;
  caption: string;
  featuresTitle: string;
  features: readonly { title: string; description: string }[];
};

const caseStudies: Record<string, CaseStudyContent> = {
  scout: {
    screen: scoutScreen,
    categoryLabel: "CRM & lead discovery",
    screenAlt: "Scout sales overview with pipeline stages and today's follow-ups",
    caption: "Sales overview: pipeline progress and the next follow-up in one place.",
    featuresTitle: "From finding a lead to following it up.",
    features: [
      { title: "Lead discovery, built in", description: "Find businesses and keep their lead records in the same CRM used for outreach." },
      { title: "A connected sales workflow", description: "Pipelines and funnels track progress, while the overview keeps upcoming follow-ups visible." },
    ],
  },
  "joyno-accounting": {
    screen: accountingScreen,
    categoryLabel: "Accounting software",
    screenAlt: "Joyno Accounting dashboard showing revenue, expenses, balances, and recent activity",
    caption: "An overview of financial activity and the administration around it.",
    featuresTitle: "The numbers and the work behind them.",
    features: [
      { title: "Financial visibility", description: "Revenue, expenses, income, assets, and balances share one financial overview." },
      { title: "Connected administration", description: "Accounting and administration modules bring the team's required workflows into an internal system." },
    ],
  },
  casatoon: {
    screen: casatoonScreen,
    categoryLabel: "AI animation workspace",
    screenAlt: "CasaToon's earlier Roarly AI dashboard with creation tools, credits, and recent projects",
    caption: "The earlier Roarly AI interface, now CasaToon.",
    featuresTitle: "A workspace for the whole creative process.",
    features: [
      { title: "Creation around projects", description: "Story ideas, characters, scenes, and assets stay connected through the animation workflow." },
      { title: "Progress without losing context", description: "Creation tools, credits, and recent work help users keep track of production activity." },
    ],
  },
  joynosync: {
    screen: syncScreen,
    categoryLabel: "CRM & sales operations",
    screenAlt: "JoynoSync dashboard with sales activity, lead distribution, and upcoming tasks",
    caption: "Sales activity and team coordination in a shared workspace.",
    featuresTitle: "Customer progress meets daily operations.",
    features: [
      { title: "Sales in context", description: "Lead management, pipelines, funnels, and call performance connect customer activity with the team's work." },
      { title: "A shared operational view", description: "Attendance, tasks, and project management support the coordination around each sales day." },
    ],
  },
  "the-beach-park-hadsan": {
    screen: hadsanScreen,
    categoryLabel: "Hospitality website",
    screenAlt: "The Beach Park Hadsan homepage with beach photography and stay-planning controls",
    caption: "A destination introduction with stay planning close at hand.",
    featuresTitle: "Get a feel for the place. Plan a stay.",
    features: [
      { title: "A destination-led introduction", description: "Beach photography sets the atmosphere, with focused navigation keeping the experience clear." },
      { title: "A clear booking entry point", description: "Arrival, departure, and guest selection sit directly alongside the destination introduction." },
    ],
  },
  "nxone-dc-inc": {
    screen: nxoneScreen,
    categoryLabel: "Corporate website",
    screenAlt: "NxOne DC Inc. homepage introducing its data-center and AI-infrastructure vision",
    caption: "A focused introduction to NxOne's infrastructure vision.",
    featuresTitle: "A clear story for a complex business.",
    features: [
      { title: "Positioning before complexity", description: "The company introduction and service structure explain NxOne's data-center and AI-infrastructure direction." },
      { title: "A direct path to the team", description: "Expert contact gives potential partners a clear next step. WordPress and Elementor support maintainable publishing." },
    ],
  },
  "shukey-philippines": {
    screen: shukeyScreen,
    categoryLabel: "Service business website",
    screenAlt: "Shukey Philippines homepage with its store photograph, service introduction, and Find a Branch action",
    caption: "Services and branch discovery on the Shukey Philippines homepage.",
    featuresTitle: "Find the right service. Find a branch.",
    features: [
      { title: "Services made easy to explore", description: "Key, lock, shoe, and bag services have clear entry points, supported by store photography and focused navigation." },
      { title: "A next step close at hand", description: "Find a Branch actions connect the service introduction with practical branch information and customer contact." },
    ],
  },
  "the-sharks-tail": {
    screen: sharksScreen,
    categoryLabel: "Dive resort website",
    screenAlt: "The Shark's Tail resort homepage introducing its Malapascua diving destination",
    caption: "Diving, accommodation, and destination information in one resort website.",
    featuresTitle: "Explore the destination. Plan the visit.",
    features: [
      { title: "Diving and staying together", description: "Diving experiences and accommodation content help visitors understand the resort and its Malapascua setting." },
      { title: "Information before inquiry", description: "The resort story, location details, and booking information support the decisions guests make before a stay." },
    ],
  },
  "roarly-website": {
    screen: roarlyWebsiteScreen,
    categoryLabel: "Product website",
    screenAlt: "Roarly product website homepage",
    caption: "The product website supporting the Roarly platform.",
    featuresTitle: "A website that connects to the product.",
    features: [
      { title: "Focused product communication", description: "Responsive pages introduce the product through a custom-built web experience." },
      { title: "Application-connected functionality", description: "Custom frontend interactions and MySQL-backed features support behavior beyond static marketing content." },
    ],
  },
  "joyno-inc": {
    screen: joynoWebsiteScreen,
    categoryLabel: "Corporate BPO website",
    screenAlt: "Joyno Inc. corporate website homepage",
    caption: "A company destination for services, leadership, and career information.",
    featuresTitle: "One company. Two important audiences.",
    features: [
      { title: "A clear introduction for clients", description: "Company and service content communicate Joyno's BPO offering and business identity." },
      { title: "A view into the team", description: "Leadership, culture, and career content introduce the company to potential team members." },
    ],
  },
};

export function getV2CaseStudyContent(slug: string): CaseStudyContent {
  const content = caseStudies[slug];
  if (!content) throw new Error(`Missing V2 case study content: ${slug}`);
  return content;
}
