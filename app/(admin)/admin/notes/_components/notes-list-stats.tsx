'use client';

import { getJournalStats } from '@/lib/journal';
import { cn } from '@/lib/utils';
import { INote } from '@/types';

const NotesListStats = ({ notes }: { notes: INote[] }) => {
  const journal = getJournalStats(notes);
  const completedCount = notes.filter((n) => n.status === 'COMPLETE').length;
  const draftCount = notes.filter((n) => (n.status ?? 'DRAFT') === 'DRAFT').length;
  const attachedCount = notes.filter((note) => Boolean(note.blog)).length;

  const notesStats = [
    {
      label: 'All notes',
      value: journal.totalNotes,
      hint: 'Total logged',
      color: 'text-foreground',
    },
    {
      label: 'Completed',
      value: completedCount,
      hint: 'Public on /notes',
      color: 'text-signal-ink',
      dot: 'bg-signal',
    },
    {
      label: 'In Draft',
      value: draftCount,
      hint: 'Private in-progress',
      color: 'text-warn-ink',
      dot: 'bg-warn',
    },
    {
      label: 'This month',
      value: journal.entriesThisMonth,
      hint: journal.monthLabel,
      color: 'text-foreground',
    },
    {
      label: 'Attached',
      value: attachedCount,
      hint: 'Linked to blogs',
      color: 'text-foreground',
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {notesStats.map((item) => (
        <div
          key={item.label}
          className="rounded-[14px] bg-surface px-5 py-4 sm:py-5 transition-colors hover:bg-muted/40"
        >
          <dt className="flex items-center gap-1.5 label-mono">
            {item.dot && (
              <span
                className={cn('size-1.5 rounded-full shrink-0', item.dot)}
                aria-hidden="true"
              />
            )}
            <span>{item.label}</span>
          </dt>
          <dd className="mt-2">
            <span
              className={cn(
                'block font-mono text-3xl font-semibold tracking-tight tabular-nums',
                item.color
              )}
            >
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
