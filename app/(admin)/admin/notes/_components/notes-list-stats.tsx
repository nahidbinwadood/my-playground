'use client';

import { getJournalStats } from '@/lib/journal';
import { INote } from '@/types';

const NotesListStats = ({ notes }: { notes: INote[] }) => {
  // Same derivation the dashboard uses, so the month count here and the month
  // count there can never disagree.
  const journal = getJournalStats(notes);

  // Every number is derived from the rows below it.
  const notesStats: { label: string; value: number; hint: string }[] = [
    {
      label: 'All notes',
      value: journal.totalNotes,
      hint: 'Newest first in the table',
    },
    {
      label: 'This month',
      value: journal.entriesThisMonth,
      hint: journal.monthLabel,
    },
    {
      label: 'Attached',
      value: notes.filter((note) => Boolean(note.blog)).length,
      hint: 'Linked to reference material',
    },
  ];

  return (
    <dl className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {notesStats.map((item) => (
        <div key={item.label} className="px-5 py-4 sm:py-5">
          <dt className="label-mono">{item.label}</dt>
          <dd className="mt-2">
            <span className="block font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {item.value}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {item.hint}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default NotesListStats;
