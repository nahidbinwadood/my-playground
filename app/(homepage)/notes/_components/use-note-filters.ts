'use client';

import { useMemo, useState } from 'react';
import { ICategory, INote } from '@/types';

export type NoteSortOrder = 'newest' | 'oldest';

export function useNoteFilters(notes: INote[], categories: ICategory[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>('newest');

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
  const spotlightNote =
    isDefaultView && filteredNotes.length > 0 ? filteredNotes[0] : null;
  const standardNotes =
    isDefaultView && filteredNotes.length > 1
      ? filteredNotes.slice(1)
      : filteredNotes;

  const hasActiveFilter = selectedCategory !== 'ALL' || Boolean(searchQuery);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');

  return {
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
  };
}
