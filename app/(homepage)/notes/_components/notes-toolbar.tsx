'use client';

import { Reveal } from '@/components/home/motion/reveal';
import { Button } from '@/components/ui/button';
import { ICategory, INote } from '@/types';
import { ArrowUpDown, LayoutGrid, List, Search, X } from 'lucide-react';
import { NoteSortOrder } from './use-note-filters';

export type NotesViewMode = 'grid' | 'list';

export function NotesToolbar({
  notes,
  activeCategories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  hasActiveFilter,
  onReset,
  resultCount,
}: {
  notes: INote[];
  activeCategories: ICategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: NoteSortOrder;
  onToggleSortOrder: () => void;
  viewMode: NotesViewMode;
  onViewModeChange: (mode: NotesViewMode) => void;
  hasActiveFilter: boolean;
  onReset: () => void;
  resultCount: number;
}) {
  return (
    <Reveal delay={0.1}>
      <div className="mt-8 sm:mt-10 flex flex-col gap-3.5 rounded-xl border border-line/50 bg-card p-3 sm:p-4 min-w-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => onSelectCategory('ALL')}
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
                  onClick={() => onSelectCategory(cat.id)}
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

            {hasActiveFilter && (
              <button
                type="button"
                onClick={onReset}
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 w-full rounded-sm bg-surface pl-8.5 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
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
                onClick={onToggleSortOrder}
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
                  onClick={() => onViewModeChange('grid')}
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
                  onClick={() => onViewModeChange('list')}
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
            Showing {resultCount} matching result{resultCount === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </Reveal>
  );
}
