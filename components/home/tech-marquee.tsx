// Infinite auto-scrolling strip of the tech stack. The list is rendered twice
// so the CSS marquee (translateX -50%) loops seamlessly. Pauses on hover.
const tech = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind CSS 4',
  'Zod',
  'React Hook Form',
  'tiptap',
  'dnd-kit',
  'Recharts',
  'shadcn/ui',
];

export function TechMarquee() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Built with a modern stack
      </p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {[...tech, ...tech].map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border bg-background px-5 py-2 text-sm font-medium shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
