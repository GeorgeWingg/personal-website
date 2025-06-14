import Section from "./Section";

export default function MusicSection() {
  return (
    <Section id="music" title="Music I’m Into (coming soon)">
      <p className="text-base leading-relaxed max-w-prose">
        In the near future this section will pull my listening stats from
        Last.fm and render some tasty visualizations. Until then, here are a
        few artists on repeat:
      </p>
      <ul className="mt-4 list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
        <li>Aphex Twin</li>
        <li>Khruangbin</li>
        <li>LCD Soundsystem</li>
        <li>Caribou</li>
        <li>Daft Punk</li>
      </ul>
    </Section>
  );
}

