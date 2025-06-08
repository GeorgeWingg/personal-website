import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  status: string;
  href?: string;
}

export default function ProjectCard({ title, description, status, href }: ProjectCardProps) {
  const content = (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{status}</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
