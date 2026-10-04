'use client';

import Link from 'next/link';
import { Reveal } from '@/components/home/motion/reveal';
import CategoryLabel from '@/components/common/category-label';
import { Button } from '@/components/ui/button';
import { formatNoteDate } from '@/lib/journal';
import { cleanMarkdownSnippet, readingMinutes } from '@/lib/utils';
import { IBlog, ICategory, INote } from '@/types';
import {
  BookOpen,
  Check,
  Clock,
  Copy,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';

export function NotesSpotlightCard({
  note,
  category,
  blog,
  isCopied,
  onOpen,
  onCopy,
}: {
  note: INote;
  category: ICategory | undefined;
  blog: IBlog | undefined;
  isCopied: boolean;
  onOpen: (note: INote) => void;
  onCopy: (note: INote, e?: React.MouseEvent) => void;
}) {
  return (
    <Reveal delay={0.08}>
      <div
        onClick={() => onOpen(note)}
        className="relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-line/40 bg-card p-4.5 sm:p-7 lg:p-8 transition-all hover:bg-card/90 min-w-0"
      >
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-8 items-start min-w-0">
          <div className="lg:col-span-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-sm bg-signal/15 px-2 py-0.5 font-mono text-[0.6875rem] font-semibold text-signal-ink">
                  <Sparkles className="size-3" />
                  #01 {'//'} LATEST TAKEAWAY
                </span>
                <CategoryLabel category={category} />
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {`${readingMinutes(note.content, 180)} min read`}
                </span>
              </div>

              <h2 className="mt-3.5 sm:mt-4 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground break-words">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(note);
                  }}
                  className="cursor-pointer text-left transition-colors hover:text-brand-ink focus-visible:outline-none"
                >
                  {note.title}
                </button>
              </h2>

              {note.description ? (
                <p className="mt-2.5 sm:mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base break-words">
                  {note.description}
                </p>
              ) : null}
            </div>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(note);
                }}
                className="h-8 gap-1.5 rounded-sm px-3.5 font-mono text-xs cursor-pointer"
              >
                <BookOpen className="size-3.5" />
                <span>Read Full Takeaway</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => onCopy(note, e)}
                className="h-8 gap-1.5 rounded-sm px-3 font-mono text-xs text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
              >
                {isCopied ? (
                  <Check className="size-3 text-signal-ink" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>

              {blog && (
                <Link
                  href={`/blogs/${blog.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-surface px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground max-w-full"
                >
                  <CornerDownRight className="size-3 shrink-0 text-muted-foreground" />
                  <span className="truncate max-w-[180px] sm:max-w-[220px]">
                    {blog.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Excerpt Well */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-lg sm:rounded-xl border border-line/40 bg-surface/70 p-4 sm:p-5 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-line/30">
              <span className="label-mono">Takeaway preview</span>
              <time
                dateTime={note.createdAt}
                className="font-mono text-xs tabular-nums text-muted-foreground"
              >
                {formatNoteDate(note.createdAt)}
              </time>
            </div>
            <p className="mt-3 line-clamp-5 font-sans text-xs sm:text-sm leading-relaxed text-foreground/80 break-words">
              {cleanMarkdownSnippet(note.content, 220)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(note);
              }}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-ink hover:underline self-start cursor-pointer"
            >
              <span>Open interactive reader</span>
              <CornerDownRight className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
