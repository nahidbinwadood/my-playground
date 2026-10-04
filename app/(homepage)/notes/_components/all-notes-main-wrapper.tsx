'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IBlog, ICategory, INote } from '@/types';
import { Reveal } from '@/components/home/motion/reveal';
import CategoryLabel from '@/components/common/category-label';
import { NoteReadingDialog } from '@/components/common/note-reading-dialog';
import { cleanMarkdownSnippet, readingMinutes } from '@/lib/utils';
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CornerDownRight,
  FileText,
  Layers,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { formatNoteDate } from '@/lib/journal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AllNotesMainWrapper({
  notes = [],
  categories = [],
  blogs = [],
}: {
  notes: INote[];
  categories: ICategory[];
  blogs: IBlog[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewingNote, setViewingNote] = useState<INote | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const blogById = useMemo(
    () => new Map(blogs.map((b) => [b.id, b])),
    [blogs]
  );

  // Active categories that actually have complete notes
  const activeCategories = useMemo(() => {
    const ids = new Set(notes.map((n) => n.category));
    return categories.filter((c) => ids.has(c.id));
  }, [notes, categories]);

  // Notes attached to a blog
  const referencedNotesCount = useMemo(
    () => notes.filter((n) => Boolean(n.blog)).length,
    [notes]
  );

  // Filter & sort notes
  const filteredNotes = useMemo(() => {
    const list = notes.filter((note) => {
      const matchesCategory =
        selectedCategory === 'ALL' || note.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        (note.description && note.description.toLowerCase().includes(query)) ||
        note.content.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    return list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [notes, selectedCategory, searchQuery, sortOrder]);

  // Lead / featured note (when viewing All without search query)
  const isDefaultView = selectedCategory === 'ALL' && !searchQuery.trim();
  const spotlightNote = isDefaultView && filteredNotes.length > 0 ? filteredNotes[0] : null;
  const standardNotes = isDefaultView && filteredNotes.length > 1 ? filteredNotes.slice(1) : filteredNotes;

  const handleCopy = async (note: INote, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const textToCopy = `${note.title}\n\n${note.description ? note.description + '\n\n' : ''}${note.content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      toast.error('Copy failed — your browser blocked clipboard access');
      return;
    }
    setCopiedId(note.id);
    toast.success('Takeaway copied to clipboard');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const viewingBlog = viewingNote?.blog
    ? blogById.get(viewingNote.blog)
    : undefined;

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
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
                {activeCategories.length}
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

        {/* Toolbar: Category Filters, Search & Controls */}
        <Reveal delay={0.1}>
          <div className="mt-8 sm:mt-10 flex flex-col gap-3.5 rounded-xl border border-line/50 bg-card p-3 sm:p-4 min-w-0">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`cursor-pointer rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === 'ALL'
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  All ({notes.length})
                </button>
                {activeCategories.map((cat) => {
                  const count = notes.filter((n) => n.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-foreground text-background font-semibold'
                          : 'bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`font-mono text-[0.6875rem] ${isSelected ? 'text-background/80' : 'text-muted-foreground/75'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}

                {(selectedCategory !== 'ALL' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="cursor-pointer inline-flex items-center gap-1 rounded-sm px-2.5 py-1.5 font-mono text-[0.6875rem] text-warn-ink hover:underline"
                  >
                    <X className="size-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto min-w-0">
                <div className="relative w-full sm:w-64 min-w-0">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-full rounded-sm bg-surface pl-8.5 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                  {/* Sort Order Toggle */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
                    }
                    className="h-8 gap-1.5 rounded-sm bg-surface px-2.5 font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <ArrowUpDown className="size-3" />
                    <span className="capitalize">{sortOrder}</span>
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center rounded-sm bg-surface p-0.5">
                    <button
                      type="button"
                      aria-label="Grid view"
                      onClick={() => setViewMode('grid')}
                      className={`cursor-pointer rounded-[6px] p-1.5 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <LayoutGrid className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="List view"
                      onClick={() => setViewMode('list')}
                      className={`cursor-pointer rounded-[6px] p-1.5 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <List className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro search/filter feedback */}
            {searchQuery && (
              <p className="font-mono text-[0.6875rem] text-muted-foreground">
                Showing {filteredNotes.length} matching result{filteredNotes.length === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        {/* Empty State */}
        {filteredNotes.length === 0 ? (
          <Reveal delay={0.12}>
            <div className="mt-12 rounded-lg bg-card px-6 py-16 text-center border border-line/40">
              <FileText className="mx-auto size-9 text-muted-foreground/60" />
              <p className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                {notes.length === 0
                  ? 'No published notes yet'
                  : 'No notes match your query'}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {notes.length === 0
                  ? 'Study notes are kept private in draft while being written. Completed takeaways will be published here.'
                  : 'Try selecting a different topic category or clearing your current search keywords.'}
              </p>
              {(selectedCategory !== 'ALL' || searchQuery) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-6 rounded-sm text-xs font-mono cursor-pointer"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8 min-w-0">
            {/* Spotlight Lead Note (Featured on default view) */}
            {spotlightNote && (
              <Reveal delay={0.08}>
                <div
                  onClick={() => setViewingNote(spotlightNote)}
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
                          <CategoryLabel category={categoryById.get(spotlightNote.category)} />
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {`${readingMinutes(spotlightNote.content, 180)} min read`}
                          </span>
                        </div>

                        <h2 className="mt-3.5 sm:mt-4 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground break-words">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingNote(spotlightNote);
                            }}
                            className="cursor-pointer text-left transition-colors hover:text-brand-ink focus-visible:outline-none"
                          >
                            {spotlightNote.title}
                          </button>
                        </h2>

                        {spotlightNote.description ? (
                          <p className="mt-2.5 sm:mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base break-words">
                            {spotlightNote.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5">
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingNote(spotlightNote);
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
                          onClick={(e) => handleCopy(spotlightNote, e)}
                          className="h-8 gap-1.5 rounded-sm px-3 font-mono text-xs text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
                        >
                          {copiedId === spotlightNote.id ? (
                            <Check className="size-3 text-signal-ink" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                          <span>{copiedId === spotlightNote.id ? 'Copied' : 'Copy'}</span>
                        </Button>

                        {spotlightNote.blog && blogById.get(spotlightNote.blog) && (
                          <Link
                            href={`/blogs/${blogById.get(spotlightNote.blog)!.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-sm bg-surface px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground max-w-full"
                          >
                            <CornerDownRight className="size-3 shrink-0 text-muted-foreground" />
                            <span className="truncate max-w-[180px] sm:max-w-[220px]">
                              {blogById.get(spotlightNote.blog)!.title}
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
                          dateTime={spotlightNote.createdAt}
                          className="font-mono text-xs tabular-nums text-muted-foreground"
                        >
                          {formatNoteDate(spotlightNote.createdAt)}
                        </time>
                      </div>
                      <p className="mt-3 line-clamp-5 font-sans text-xs sm:text-sm leading-relaxed text-foreground/80 break-words">
                        {cleanMarkdownSnippet(spotlightNote.content, 220)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingNote(spotlightNote);
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
            )}

            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
                {standardNotes.map((note, i) => {
                  const blog = note.blog ? blogById.get(note.blog) : undefined;
                  const indexLabel = `#${String((isDefaultView ? i + 2 : i + 1)).padStart(2, '0')}`;
                  const isCopied = copiedId === note.id;

                  return (
                    <Reveal key={note.id} delay={i * 0.03} className="h-full min-w-0">
                      <article
                        onClick={() => setViewingNote(note)}
                        className="group relative flex h-full cursor-pointer flex-col justify-between rounded-xl border border-line/40 bg-card p-4.5 sm:p-5.5 transition-all duration-300 hover:-translate-y-1 hover:bg-card/90 hover:border-line"
                      >
                        <div className="min-w-0">
                          {/* Card Meta Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[0.6875rem] font-semibold text-muted-foreground/75">
                                {indexLabel}
                              </span>
                              <CategoryLabel category={categoryById.get(note.category)} />
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
                                setViewingNote(note);
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
                                onClick={(e) => handleCopy(note, e)}
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
                                  setViewingNote(note);
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
                })}
              </div>
            ) : (
              /* List / Spec View */
              <div className="overflow-hidden rounded-xl border border-line/40 bg-card min-w-0">
                <div className="divide-y divide-line/40">
                  {standardNotes.map((note, i) => {
                    const blog = note.blog ? blogById.get(note.blog) : undefined;
                    const indexLabel = `#${String((isDefaultView ? i + 2 : i + 1)).padStart(2, '0')}`;
                    const isCopied = copiedId === note.id;

                    return (
                      <article
                        key={note.id}
                        onClick={() => setViewingNote(note)}
                        className="group flex flex-col gap-3 p-3.5 sm:p-4 cursor-pointer sm:flex-row sm:items-center sm:justify-between sm:gap-6 hover:bg-muted/40 transition-colors min-w-0"
                      >
                        <div className="flex items-start gap-2.5 sm:items-center min-w-0 flex-1">
                          <span className="font-mono text-xs text-muted-foreground/70 w-8 shrink-0">
                            {indexLabel}
                          </span>
                          <CategoryLabel category={categoryById.get(note.category)} />

                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingNote(note);
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
                              onClick={(e) => handleCopy(note, e)}
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
                                setViewingNote(note);
                              }}
                              className="h-7 rounded-sm px-2.5 font-mono text-xs cursor-pointer"
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Public Note Detail Dialog (Full Takeaway Reader) */}
      <NoteReadingDialog
        note={viewingNote}
        open={Boolean(viewingNote)}
        onOpenChange={(open) => !open && setViewingNote(null)}
        category={viewingNote ? categoryById.get(viewingNote.category) : undefined}
        blog={viewingBlog}
      />
    </div>
  );
}
