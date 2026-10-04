'use client';

import { Reveal } from '@/components/home/motion/reveal';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function NotesEmptyState({
  hasNotes,
  hasActiveFilter,
  onReset,
}: {
  hasNotes: boolean;
  hasActiveFilter: boolean;
  onReset: () => void;
}) {
  return (
    <Reveal delay={0.12}>
      <div className="mt-12 rounded-lg bg-card px-6 py-16 text-center border border-line/40">
        <FileText className="mx-auto size-9 text-muted-foreground/60" />
        <p className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
          {!hasNotes ? 'No published notes yet' : 'No notes match your query'}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {!hasNotes
            ? 'Study notes are kept private in draft while being written. Completed takeaways will be published here.'
            : 'Try selecting a different topic category or clearing your current search keywords.'}
        </p>
        {hasActiveFilter && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="mt-6 rounded-sm text-xs font-mono cursor-pointer"
          >
            Clear filters
          </Button>
        )}
      </div>
    </Reveal>
  );
}
