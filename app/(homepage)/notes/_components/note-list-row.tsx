'use client';

import CategoryLabel from '@/components/common/category-label';
import { Button } from '@/components/ui/button';
import { formatNoteDate } from '@/lib/journal';
import { IBlog, ICategory, INote } from '@/types';
import { Check, Copy } from 'lucide-react';

export function NoteListRow({
  note,
  indexLabel,
  category,
  blog,
  isCopied,
  onOpen,
  onCopy,
}: {
  note: INote;
  indexLabel: string;
  category: ICategory | undefined;
  blog: IBlog | undefined;
  isCopied: boolean;
  onOpen: (note: INote) => void;
  onCopy: (note: INote, e?: React.MouseEvent) => void;
}) {
  return (
    <article
      onClick={() => onOpen(note)}
      className="group flex flex-col gap-3 p-3.5 sm:p-4 cursor-pointer sm:flex-row sm:items-center sm:justify-between sm:gap-6 hover:bg-muted/40 transition-colors min-w-0"
    >
      <div className="flex items-start gap-2.5 sm:items-center min-w-0 flex-1">
        <span className="font-mono text-xs text-muted-foreground/70 w-8 shrink-0">
          {indexLabel}
        </span>
        <CategoryLabel category={category} />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(note);
            }}
            className="cursor-pointer text-left font-display font-medium text-foreground hover:underline text-sm truncate max-w-lg block"
          >
            {note.title}
          </button>
          {blog && (
            <p className="font-mono text-[0.6875rem] text-muted-foreground truncate">
              Ref: {blog.title}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatNoteDate(note.createdAt)}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onCopy(note, e)}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-sm bg-surface text-muted-foreground hover:text-foreground"
          >
            {isCopied ? <Check className="size-3 text-signal-ink" /> : <Copy className="size-3" />}
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(note);
            }}
            className="h-7 rounded-sm px-2.5 font-mono text-xs cursor-pointer"
          >
            Open
          </Button>
        </div>
      </div>
    </article>
  );
}
