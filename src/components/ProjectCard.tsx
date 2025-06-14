import { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

const statusColorMap: Record<Project["status"], string> = {
  Shipped: "bg-green-600 text-white",
  WIP: "bg-amber-500 text-white",
  Concept: "bg-gray-600 text-white dark:bg-gray-700",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const Tag = (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColorMap[project.status]}`}
    >
      {project.status}
    </span>
  );

  const CardContent = (
    <div className="p-5 border border-gray-200 dark:border-white/10 rounded-lg hover:border-gray-400 transition-colors h-full flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {Tag}
      </div>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 flex-1">
        {project.blurb}
      </p>
    </div>
  );

  return project.href ? (
    <a href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {CardContent}
    </a>
  ) : (
    CardContent
  );
}