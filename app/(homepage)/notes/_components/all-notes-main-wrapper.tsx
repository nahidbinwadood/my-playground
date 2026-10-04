'use client';

import { useMemo, useState } from 'react';
import { IBlog, ICategory, INote } from '@/types';
import { NoteReadingDialog } from '@/components/common/note-reading-dialog';
import { useNoteFilters } from './use-note-filters';
import { useCopyNote } from './use-copy-note';
import { NotesHero } from './notes-hero';
import { NotesToolbar, NotesViewMode } from './notes-toolbar';
import { NotesEmptyState } from './notes-empty-state';
import { NotesSpotlightCard } from './notes-spotlight-card';
import { NoteGridCard } from './note-grid-card';
import { NoteListRow } from './note-list-row';

export default function AllNotesMainWrapper({
  notes = [],
  categories = [],
  blogs = [],
}: {
  notes: INote[];
  categories: ICategory[];
  blogs: IBlog[];
}) {
  const [viewMode, setViewMode] = useState<NotesViewMode>('grid');
  const [viewingNote, setViewingNote] = useState<INote | null>(null);
  const { copiedId, handleCopy } = useCopyNote();
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOrder,
    toggleSortOrder,
    activeCategories,
    referencedNotesCount,
    filteredNotes,
    isDefaultView,
    spotlightNote,
    standardNotes,
    hasActiveFilter,
    resetFilters,
  } = useNoteFilters(notes, categories);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const blogById = useMemo(
    () => new Map(blogs.map((b) => [b.id, b])),
    [blogs]
  );

  const viewingBlog = viewingNote?.blog
    ? blogById.get(viewingNote.blog)
    : undefined;

  // The spotlight takes slot #01 on the default view, so the rest start at #02.
  const indexLabelFor = (i: number) =>
    `#${String((isDefaultView ? i + 2 : i + 1)).padStart(2, '0')}`;

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <NotesHero
          notes={notes}
          activeCategoryCount={activeCategories.length}
          referencedNotesCount={referencedNotesCount}
        />

        {/* Toolbar: Category Filters, Search & Controls */}
        <NotesToolbar
          notes={notes}
          activeCategories={activeCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onToggleSortOrder={toggleSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasActiveFilter={hasActiveFilter}
          onReset={resetFilters}
          resultCount={filteredNotes.length}
        />

        {/* Empty State */}
        {filteredNotes.length === 0 ? (
          <NotesEmptyState
            hasNotes={notes.length > 0}
            hasActiveFilter={hasActiveFilter}
            onReset={resetFilters}
          />
        ) : (
          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8 min-w-0">
            {/* Spotlight Lead Note (Featured on default view) */}
            {spotlightNote && (
              <NotesSpotlightCard
                note={spotlightNote}
                category={categoryById.get(spotlightNote.category)}
                blog={
                  spotlightNote.blog
                    ? blogById.get(spotlightNote.blog)
                    : undefined
                }
                isCopied={copiedId === spotlightNote.id}
                onOpen={setViewingNote}
                onCopy={handleCopy}
              />
            )}

            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
                {standardNotes.map((note, i) => (
                  <NoteGridCard
                    key={note.id}
                    note={note}
                    index={i}
                    indexLabel={indexLabelFor(i)}
                    category={categoryById.get(note.category)}
                    blog={note.blog ? blogById.get(note.blog) : undefined}
                    isCopied={copiedId === note.id}
                    onOpen={setViewingNote}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            ) : (
              /* List / Spec View */
              <div className="overflow-hidden rounded-xl border border-line/40 bg-card min-w-0">
                <div className="divide-y divide-line/40">
                  {standardNotes.map((note, i) => (
                    <NoteListRow
                      key={note.id}
                      note={note}
                      indexLabel={indexLabelFor(i)}
                      category={categoryById.get(note.category)}
                      blog={note.blog ? blogById.get(note.blog) : undefined}
                      isCopied={copiedId === note.id}
                      onOpen={setViewingNote}
                      onCopy={handleCopy}
                    />
                  ))}
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
