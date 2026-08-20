'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export type NavGroup = { id: string; name: string; count: number };

// Tracks which group section is currently under the header so the index can
// mark it. Sections are read by id, so the anchors stay plain links.
function useActiveSection(groups: NavGroup[]) {
  const [active, setActive] = useState(groups[0]?.id ?? '');

  useEffect(() => {
    const sections = groups
      .map((group) => document.getElementById(group.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onscreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (onscreen[0]) setActive(onscreen[0].target.id);
      },
      { rootMargin: '-112px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groups]);

  return active;
}

// Sticky index down the left on xl. Real anchor navigation, not decoration.
export function ShowcaseIndex({ groups }: { groups: NavGroup[] }) {
  const active = useActiveSection(groups);

  return (
    <nav aria-label="Specimen groups" className="hidden xl:block">
      <div className="sticky top-28">
        <p className="label-mono">Index</p>
        <ul className="mt-4 border-l border-line">
          {groups.map((group) => {
            const isActive = active === group.id;
            return (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    '-ml-px flex items-baseline justify-between gap-3 border-l-2 py-2 pl-3 pr-2 font-mono text-xs transition-colors',
                    isActive
                      ? 'border-signal text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  )}
                >
                  <span className="tracking-tight">{group.name}</span>
                  <span className="tabular-nums text-[0.6875rem] text-muted-foreground">
                    {group.count}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// Same navigation below xl, laid out as a scrollable row of anchors.
export function ShowcaseJumpBar({ groups }: { groups: NavGroup[] }) {
  return (
    <nav
      aria-label="Specimen groups"
      className="hide-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 xl:hidden"
    >
      <ul className="flex w-max items-center gap-2 py-1">
        {groups.map((group) => (
          <li key={group.id}>
            <a
              href={`#${group.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs tracking-tight text-muted-foreground transition-colors hover:border-signal/40 hover:text-foreground"
            >
              {group.name}
              <span className="tabular-nums text-[0.6875rem]">
                {group.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
