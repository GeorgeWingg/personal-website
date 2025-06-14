interface SectionProps {
  id?: string;
  className?: string;
  title: string;
  children: React.ReactNode;
}

export default function Section({ id, className = "", title, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`}
    >
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">{title}</h2>
      {children}
    </section>
  );
}

