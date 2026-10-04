import { Reveal } from '@/components/home/motion/reveal';
import { formatNoteDate } from '@/lib/journal';
import { INote } from '@/types';
import { Calendar, CheckCircle2, CornerDownRight, Layers } from 'lucide-react';

export function NotesHero({
  notes,
  activeCategoryCount,
  referencedNotesCount,
}: {
  notes: INote[];
  activeCategoryCount: number;
  referencedNotesCount: number;
}) {
  return (
    <>
      {/* Header Hero Section */}
      <Reveal className="max-w-3xl min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 font-mono text-[0.6875rem] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-signal animate-pulse" />
          <span className="text-foreground font-medium">STUDY NOTES</span>
          <span className="text-muted-foreground/60">{'//'}</span>
          <span>VERIFIED ARCHIVE</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-7xl break-words">
          Study notes
        </h1>
        <p className="mt-4 sm:mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Handwritten architectural takeaways, debugging notes, and engineering patterns
          documented while studying technical references and building playground specimens.
        </p>
      </Reveal>

      {/* Instrument Metrics Strip */}
      <Reveal delay={0.06}>
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 min-w-0">
          <div className="rounded-lg bg-card p-3.5 sm:p-5 transition-colors border border-line/40 min-w-0">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="label-mono">Completed</span>
              <CheckCircle2 className="size-4 text-signal-ink shrink-0" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums tracking-tight sm:text-3xl text-foreground">
              {notes.length}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground truncate">
              curated insights
            </p>
          </div>

          <div className="rounded-lg bg-card p-3.5 sm:p-5 transition-colors border border-line/40 min-w-0">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="label-mono">Topics</span>
              <Layers className="size-4 text-iris-ink shrink-0" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums tracking-tight sm:text-3xl text-foreground">
              {activeCategoryCount}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground truncate">
              knowledge domains
            </p>
          </div>

          <div className="rounded-lg bg-card p-3.5 sm:p-5 transition-colors border border-line/40 min-w-0">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="label-mono">Referenced</span>
              <CornerDownRight className="size-4 text-muted-foreground shrink-0" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums tracking-tight sm:text-3xl text-foreground">
              {referencedNotesCount}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground truncate">
              attached to blogs
            </p>
          </div>

          <div className="rounded-lg bg-card p-3.5 sm:p-5 transition-colors border border-line/40 min-w-0">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="label-mono">Latest session</span>
              <Calendar className="size-4 text-muted-foreground shrink-0" />
            </div>
            <p className="mt-2 font-mono text-xs sm:text-sm font-semibold tabular-nums text-foreground truncate">
              {notes[0]?.createdAt ? formatNoteDate(notes[0].createdAt) : '—'}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground truncate">
              most recent log
            </p>
          </div>
        </div>
      </Reveal>
    </>
  );
}
