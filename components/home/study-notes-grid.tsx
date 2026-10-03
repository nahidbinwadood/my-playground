'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IBlog, ICategory, INote } from '@/types';
import CategoryLabel from '@/components/common/category-label';
import { JOURNAL_TIME_ZONE } from '@/lib/journal';
import {
  ArrowRight,
  Clock,
  CornerDownRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Reveal } from './motion/reveal';

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: JOURNAL_TIME_ZONE,
});

const formatNoteDate = (value?: string) =>
  value ? dateFmt.format(new Date(value)) : '—';

const estimateReadTime = (content?: string) => {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} min read`;
};

export function StudyNotesGrid({
  notes = [],
  categories = [],
  blogs = [],
}: {
  notes: INote[];
  categories: ICategory[];
  blogs: IBlog[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [readingNote, setReadingNote] = useState<INote | null>(null);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const blogById = useMemo(
    () => new Map(blogs.map((b) => [b.id, b])),
    [blogs]
  );

  // Active categories that have completed notes
  const activeCategories = useMemo(() => {
    const ids = new Set(notes.map((n) => n.category));
    return categories.filter((c) => ids.has(c.id));
  }, [notes, categories]);

  // Filter notes by selected category
  const filteredNotes = useMemo(() => {
    if (selectedCategory === 'ALL') return notes;
    return notes.filter((n) => n.category === selectedCategory);
  }, [notes, selectedCategory]);

  const displayedNotes = useMemo(() => filteredNotes.slice(0, 5), [filteredNotes]);
  const [leadNote, ...otherNotes] = displayedNotes;
  const readingBlog = readingNote?.blog
    ? blogById.get(readingNote.blog)
    : undefined;

  if (notes.length === 0) {
    return (
      <Reveal delay={0.08}>
        <div className="relative overflow-hidden rounded-[24px] bg-card p-10 text-center sm:p-16">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface">
            <FileText className="size-6 text-brand-ink" />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
            No published notes yet
          </h3>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Notes remain private in draft while being written. Completed takeaways will appear here once finalized.
          </p>
          <div className="mt-6">
            <Button variant="secondary" asChild>
              <Link href="/blogs">Explore reading list</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <>
      {/* Category filter pills */}
      {activeCategories.length > 1 && (
        <Reveal delay={0.04}>
          <div className="mb-8 flex flex-wrap items-center gap-1.5 sm:mb-10">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              All topics ({notes.length})
            </button>
            {activeCategories.map((cat) => {
              const count = notes.filter((n) => n.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-foreground text-background shadow-sm'
                      : 'bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </Reveal>
      )}

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Lead Note — prominent magazine hero card */}
        {leadNote && (
          <div className={otherNotes.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <Reveal className="h-full">
              <article
                onClick={() => setReadingNote(leadNote)}
                className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-1 hover:ring-brand/35 sm:p-9"
              >
                {/* Accent notch on top-left edge */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1.5 w-24 bg-brand transition-all duration-300 group-hover:w-36"
                />

                <div>
                  {/* Top metadata strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium text-brand-ink">
                        <Sparkles className="size-3" />
                        LATEST INSIGHT
                      </span>
                      <CategoryLabel
                        category={categoryById.get(leadNote.category)}
                      />
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {estimateReadTime(leadNote.content)}
                      </span>
                      <span>•</span>
                      <span>{formatNoteDate(leadNote.createdAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-ink sm:text-3xl lg:text-4xl">
                    {leadNote.title}
                  </h3>

                  {/* Highlight excerpt well */}
                  {leadNote.description ? (
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground line-clamp-3">
                      {leadNote.description}
                    </p>
                  ) : null}

                  {leadNote.content && (
                    <div className="mt-6 rounded-[16px] bg-surface/80 p-5 font-sans text-sm leading-relaxed text-muted-foreground line-clamp-3 border-l-2 border-brand/50">
                      {leadNote.content}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/25 pt-5 sm:mt-10">
                  {leadNote.blog ? (
                    <div className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <CornerDownRight className="size-3.5 shrink-0 text-brand-ink" />
                      <span className="truncate">
                        Paired with {blogById.get(leadNote.blog)?.title || 'Reference'}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground/70">
                      Standalone takeaway
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-xs font-medium text-foreground transition-colors group-hover:bg-brand group-hover:text-black">
                    <span>Read takeaway</span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Reveal>
          </div>
        )}

        {/* Side Stack — companion cards */}
        {otherNotes.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {otherNotes.slice(0, 2).map((note, index) => {
              const blog = note.blog ? blogById.get(note.blog) : undefined;
              return (
                <Reveal key={note.id} delay={0.06 * (index + 1)} className="h-full">
                  <article
                    onClick={() => setReadingNote(note)}
                    className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-1 hover:ring-border sm:p-7"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[0.6875rem] font-medium text-muted-foreground/70">
                            #{String(index + 2).padStart(2, '0')}
                          </span>
                          <CategoryLabel
                            category={categoryById.get(note.category)}
                          />
                        </div>
                        <time
                          dateTime={note.createdAt}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {formatNoteDate(note.createdAt)}
                        </time>
                      </div>

                      {/* Title */}
                      <h4 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-ink sm:text-xl">
                        {note.title}
                      </h4>

                      {/* Snippet */}
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {note.description || note.content}
                      </p>
                    </div>

                    {/* Card bottom */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/25 pt-4">
                      <span className="truncate font-mono text-xs text-muted-foreground/70">
                        {blog ? blog.title : 'Standalone'}
                      </span>

                      <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                        <span>Read</span>
                        <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Dialog Modal */}
      <Dialog
        open={Boolean(readingNote)}
        onOpenChange={(open) => !open && setReadingNote(null)}
      >
        <DialogContent className="hide-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {readingNote ? (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  <CategoryLabel
                    category={categoryById.get(readingNote.category)}
                  />
                  {readingBlog ? (
                    <Link
                      href={`/blogs/${readingBlog.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <CornerDownRight className="size-3 text-brand-ink" />
                      <span>{readingBlog.title}</span>
                    </Link>
                  ) : null}
                </div>
                <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {readingNote.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-3 font-mono text-xs tabular-nums text-muted-foreground">
                  <span>Logged {formatNoteDate(readingNote.createdAt)}</span>
                  <span>•</span>
                  <span>{estimateReadTime(readingNote.content)}</span>
                </DialogDescription>
              </DialogHeader>

              {readingNote.description ? (
                <div className="rounded-[14px] bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  {readingNote.description}
                </div>
              ) : null}

              {/* Full body */}
              <div className="overflow-hidden rounded-[16px] bg-surface">
                <div className="flex items-center justify-between bg-muted/40 px-5 py-2.5 text-xs font-mono text-muted-foreground">
                  <span>Takeaways & Notes</span>
                </div>
                <div className="hide-scrollbar max-h-96 overflow-y-auto px-6 py-5 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-sans">
                  {readingNote.content || '—'}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
