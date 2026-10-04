'use client';

import { useMemo, useState } from 'react';
import { IBlog, ICategory, INote } from '@/types';
import CategoryLabel from '@/components/common/category-label';
import { NoteReadingDialog } from '@/components/common/note-reading-dialog';
import { cleanMarkdownSnippet, readingMinutes } from '@/lib/utils';
import { formatNoteDate } from '@/lib/journal';
import {
  ArrowRight,
  Clock,
  CornerDownRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './motion/reveal';
import Link from 'next/link';

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
        <div className="relative overflow-hidden rounded-[24px] bg-card p-6 text-center sm:p-16">
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
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background shadow-xs'
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
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-foreground text-background shadow-xs'
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

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6 min-w-0">
        {/* Lead Note — prominent magazine hero card */}
        {leadNote && (
          <div className={`min-w-0 ${otherNotes.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <Reveal className="h-full">
              <article
                onClick={() => setReadingNote(leadNote)}
                className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] sm:rounded-[24px] bg-card p-5 sm:p-7 lg:p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-brand/35"
              >
                {/* Accent notch on top-left edge */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1.5 w-20 sm:w-24 bg-brand transition-all duration-300 group-hover:w-36"
                />

                <div className="min-w-0">
                  {/* Top metadata strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium text-brand-ink">
                        <Sparkles className="size-3" />
                        LATEST INSIGHT
                      </span>
                      <CategoryLabel
                        category={categoryById.get(leadNote.category)}
                      />
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {`${readingMinutes(leadNote.content, 180)} min read`}
                      </span>
                      <span>•</span>
                      <span>{formatNoteDate(leadNote.createdAt)}</span>
                    </div>
                  </div>

                  {/* Title with word-break protection */}
                  <h3 className="mt-4 sm:mt-6 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-ink break-words">
                    {leadNote.title}
                  </h3>

                  {/* Highlight excerpt well with cleaned teaser */}
                  {leadNote.description ? (
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3 break-words">
                      {leadNote.description}
                    </p>
                  ) : null}

                  {leadNote.content && (
                    <div className="mt-4 sm:mt-6 rounded-[14px] sm:rounded-[16px] bg-surface/80 p-3.5 sm:p-4.5 font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 border-l-2 border-brand/50 break-words">
                      {cleanMarkdownSnippet(leadNote.content, 220)}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/25 pt-4 sm:mt-8 sm:pt-5">
                  {leadNote.blog ? (
                    <div className="flex min-w-0 max-w-[220px] sm:max-w-none items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <CornerDownRight className="size-3.5 shrink-0 text-brand-ink" />
                      <span className="truncate">
                        Paired with {blogById.get(leadNote.blog)?.title || 'Reference'}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground/80">
                      Standalone takeaway
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-xs font-medium text-foreground transition-colors group-hover:bg-brand group-hover:text-black shrink-0">
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
          <div className="min-w-0 grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {otherNotes.slice(0, 2).map((note, index) => {
              const blog = note.blog ? blogById.get(note.blog) : undefined;
              return (
                <Reveal key={note.id} delay={0.06 * (index + 1)} className="h-full min-w-0">
                  <article
                    onClick={() => setReadingNote(note)}
                    className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] sm:rounded-[24px] bg-card p-4.5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-border"
                  >
                    <div className="min-w-0">
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

                      {/* Title with word-break protection */}
                      <h4 className="mt-3.5 font-display text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-ink break-words">
                        {note.title}
                      </h4>

                      {/* Snippet */}
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 break-words">
                        {note.description || cleanMarkdownSnippet(note.content, 140)}
                      </p>
                    </div>

                    {/* Card bottom */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/25 pt-3.5">
                      <span className="truncate font-mono text-xs text-muted-foreground/80 max-w-[180px]">
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
      <NoteReadingDialog
        note={readingNote}
        open={Boolean(readingNote)}
        onOpenChange={(open) => !open && setReadingNote(null)}
        category={readingNote ? categoryById.get(readingNote.category) : undefined}
        blog={readingBlog}
      />
    </>
  );
}
