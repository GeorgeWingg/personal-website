import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Personal Website",
    description: "This site. Built with Next.js and Tailwind CSS.",
    status: "WIP",
  },
  {
    title: "Goals App",
    description: "Small task tracking experiment.",
    status: "Concept",
  },
  {
    title: "AI Workflows",
    description: "Exploring AI-native leverage systems.",
    status: "WIP",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl py-16 space-y-20 font-sans">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">George</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Building tiny web toys & exploring AI-native systems.
        </p>
      </header>

      <section id="about" className="space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p>
          I’m a developer who enjoys crafting fast and expressive web
          experiences. Currently experimenting with leverage through AI-native
          systems.
        </p>
      </section>

      <section id="projects" className="space-y-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section id="music" className="space-y-4">
        <h2 className="text-2xl font-semibold">Music Taste</h2>
        <p>
          Favourite artists: Radiohead, Autechre, Tame Impala… (dynamic charts
          coming soon!)
        </p>
      </section>

      <footer className="pt-8 border-t text-center">
        <a
          href="mailto:hi@example.com"
          className="hover:underline mr-4"
        >
          Email
        </a>
        <a
          href="https://github.com/example"
          className="hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
