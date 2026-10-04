'use client';

import Link from 'next/link';
import { Reveal } from '@/components/home/motion/reveal';
import CategoryLabel from '@/components/common/category-label';
import { Button } from '@/components/ui/button';
import { formatNoteDate } from '@/lib/journal';
import { cleanMarkdownSnippet, readingMinutes } from '@/lib/utils';
import { IBlog, ICategory, INote } from '@/types';
import { Check, Clock, Copy, CornerDownRight } from 'lucide-react';

export function NoteGridCard({
  note,
  index,
  indexLabel,
  category,
  blog,
  isCopied,
  onOpen,
  onCopy,
}: {
  note: INote;
  // Position in the rendered list — drives the staggered reveal delay.
  index: number;
  indexLabel: string;
  category: ICategory | undefined;
  blog: IBlog | undefined;
  isCopied: boolean;
  onOpen: (note: INote) => void;
  onCopy: (note: INote, e?: React.MouseEvent) => void;
}) {
  return (
    <Reveal delay={index * 0.03} className="h-full min-w-0">
      <article
        onClick={() => onOpen(note)}
        className="group relative flex h-full cursor-pointer flex-col justify-between rounded-xl border border-line/40 bg-card p-4.5 sm:p-5.5 transition-all duration-300 hover:-translate-y-1 hover:bg-card/90 hover:border-line"
      >
        <div className="min-w-0">
          {/* Card Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6875rem] font-semibold text-muted-foreground/75">
                {indexLabel}
              </span>
              <CategoryLabel category={category} />
            </div>

            <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
              {formatNoteDate(note.createdAt)}
            </span>
          </div>

          {/* Card Title */}
          <h3 className="mt-3.5 font-display text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-ink break-words">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(note);
              }}
              className="cursor-pointer text-left hover:underline focus-visible:outline-none"
            >
              {note.title}
            </button>
          </h3>

          {/* Content Excerpt in raised well */}
          <div className="mt-3 rounded-lg bg-surface/70 border border-line/30 p-3">
            <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground break-words font-sans">
              {note.description || cleanMarkdownSnippet(note.content, 140)}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-5 flex flex-col gap-2.5 border-t border-line/30 pt-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem]">
              <Clock className="size-3" />
              {`${readingMinutes(note.content, 180)} min read`}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => onCopy(note, e)}
                title="Copy note text"
                className="inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              >
                {isCopied ? (
                  <Check className="size-3 text-signal-ink" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(note);
                }}
                className="h-6 gap-1 rounded-sm px-2 font-mono text-[0.6875rem] text-foreground hover:bg-surface cursor-pointer"
              >
                <span>View</span>
                <CornerDownRight className="size-3" />
              </Button>
            </div>
          </div>

          {blog && (
            <Link
              href={`/blogs/${blog.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 truncate font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <CornerDownRight className="size-3 shrink-0" />
              <span className="truncate max-w-[200px]">{blog.title}</span>
            </Link>
          )}
        </div>
      </article>
    </Reveal>
  );
}
