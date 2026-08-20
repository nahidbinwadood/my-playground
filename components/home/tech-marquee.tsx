// Readout strip under the hero: the real stack this site runs on, with the
// version actually installed. The list is rendered twice so the CSS marquee
// (translateX -50%) loops seamlessly; the second copy is aria-hidden so screen
// readers hear the stack once. Hovering the track pauses it.
const stack: { name: string; version?: string }[] = [
  { name: 'Next.js', version: '16' },
  { name: 'React', version: '19' },
  { name: 'TypeScript', version: '5' },
  { name: 'Tailwind CSS', version: '4' },
  { name: 'Zod', version: '4' },
  { name: 'React Hook Form', version: '7' },
  { name: 'Motion', version: '12' },
  { name: 'TanStack Table', version: '8' },
  { name: 'TipTap', version: '3' },
  { name: 'dnd-kit', version: '6' },
  { name: 'Recharts', version: '2' },
  { name: 'shadcn/ui' },
];

function StackList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-stretch"
      aria-hidden={duplicate || undefined}
    >
      {stack.map((item) => (
        <li
          key={item.name}
          className="flex shrink-0 items-baseline gap-2 whitespace-nowrap border-l border-line px-5 py-3 sm:px-7 sm:py-3.5"
        >
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-foreground">
            {item.name}
          </span>
          {item.version ? (
            <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
              {item.version}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function TechMarquee() {
  return (
    <section
      aria-label="Stack this site runs on"
      className="border-y border-line bg-surface"
    >
      <div className="flex items-stretch">
        <p className="label-mono hidden shrink-0 items-center border-r border-line px-5 py-3 sm:flex sm:py-3.5">
          Stack
        </p>

        <div className="relative min-w-0 flex-1 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <StackList />
            <StackList duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
