'use client';

import { Reveal } from '@/components/home/motion/reveal';
import type { ReactNode } from 'react';
import { ShowcaseIndex, ShowcaseJumpBar } from './_components/showcase-nav';
import {
  specimenCount,
  specimenGroups,
  specimenNavGroups,
} from './_components/showcase-registry';
import { Specimen } from './_components/specimen';

// Kept for the legacy showcase preview/sidebar components that still type
// against this shape.
export type ComponentItem = {
  id: string;
  name: string;
  category: string;
  component: ReactNode;
  code: string;
};

export default function ComponentsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="border-b border-line pb-10">
        <p className="label-mono">/components</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
          Specimen sheet
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every primitive this site is built from, running live in the theme you
          are reading in. Type in the fields, open the dialogs, drag the slider —
          nothing here is a screenshot.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
          <div>
            <dt className="label-mono">Specimens</dt>
            <dd className="mt-1.5 font-mono text-2xl font-semibold tabular-nums tracking-tight">
              {specimenCount}
            </dd>
          </div>
          <div>
            <dt className="label-mono">Groups</dt>
            <dd className="mt-1.5 font-mono text-2xl font-semibold tabular-nums tracking-tight">
              {specimenNavGroups.length}
            </dd>
          </div>
          <div>
            <dt className="label-mono">Source</dt>
            <dd className="mt-1.5 font-mono text-2xl font-semibold tracking-tight">
              components/ui
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 border-b border-line pb-6 xl:hidden">
        <ShowcaseJumpBar groups={specimenNavGroups} />
      </div>

      <div className="mt-12 grid gap-12 sm:mt-16 xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-16">
        <ShowcaseIndex groups={specimenNavGroups} />

        <div className="min-w-0 space-y-20 sm:space-y-28">
          {specimenGroups.map((group) => (
            <Reveal key={group.id}>
              <section
                id={group.id}
                aria-labelledby={`${group.id}-heading`}
                className="scroll-mt-28"
              >
                <div className="border-b border-line pb-5">
                  <p className="label-mono">/components#{group.id}</p>
                  <h2
                    id={`${group.id}-heading`}
                    className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {group.name}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {group.blurb}
                  </p>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <Specimen
                      key={item.id}
                      name={item.name}
                      source={item.source}
                      note={item.note}
                      className={item.wide ? 'sm:col-span-2' : undefined}
                    >
                      {item.demo}
                    </Specimen>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
