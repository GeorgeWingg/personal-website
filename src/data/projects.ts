export type ProjectStatus = "WIP" | "Shipped" | "Concept";

export interface Project {
  title: string;
  blurb: string;
  status: ProjectStatus;
  href?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Website",
    blurb: "The site you're looking at right now – built with Next.js 15, the App Router and Tailwind CSS.",
    status: "Shipped",
    href: "https://example.com", // placeholder – replace with real URL later
  },
  {
    title: "AI-native Notes",
    blurb: "An experiment in leverage-first knowledge work. Embeds GPT-4o inside every writing surface.",
    status: "WIP",
  },
  {
    title: "Goals Engine",
    blurb: "A tiny tool that tracks weekly goals and nudges me when I fall behind.",
    status: "Concept",
  },
];

