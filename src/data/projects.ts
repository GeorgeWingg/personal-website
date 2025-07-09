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
    href: "https://github.com/GeorgeWingg/personal-website",
  },
  {
    title: "Tetris AI Emulator",
    blurb: "Using heuristics to calculate the effectiveness of each move. An AI that plays Tetris optimally.",
    status: "WIP",
  },
  {
    title: "Goals App",
    blurb: "A web/mobile app that transforms user goals into structured Goal Trees, then uses AI agents to work on and progress them autonomously.",
    status: "WIP",
  },
];

