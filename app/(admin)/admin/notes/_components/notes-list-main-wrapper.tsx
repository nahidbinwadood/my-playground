'use client';

import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { INote, ICategory } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRefreshContext } from '@/providers/refresh-provider';
import { TBlogOption } from '../types';
import NotesListSkeleton from './notes-list-skeleton';
import NotesListStats from './notes-list-stats';
import NotesCardContainer from './notes-card-container';

const NotesListMainWrapper = ({
  notes,
  blogs,
  categories,
  notesUnavailable,
  blogsUnavailable,
  categoriesUnavailable,
}: {
  notes: INote[];
  blogs: TBlogOption[];
  categories: ICategory[];
  notesUnavailable: boolean;
  blogsUnavailable: boolean;
  categoriesUnavailable: boolean;
}) => {
  const { isRefreshing } = useRefreshContext();

  // An edit or a delete refetches this list; the cards on screen are stale for
  // that window, so the skeleton stands in for them.
  if (isRefreshing) {
    return <NotesListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header row: title/breadcrumbs on the left, the one signal action on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Notes"
          subtitle="Every takeaway you have written, bodies included. Notes stay private — nothing here is published."
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Notes' },
          ]}
          className="mb-0"
        />
        <Button className="shrink-0" asChild>
          <Link href="/admin/notes/create-note">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Log a note
          </Link>
        </Button>
      </div>

      {notesUnavailable ? (
        // A failed fetch must not read as an empty journal — say the data is
        // missing rather than showing zero rows.
        <div className="rounded-[14px] bg-surface px-5 py-10 text-center">
          <p className="text-sm font-medium text-warn-ink">Could not load notes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The API did not respond, so this feed is empty because the data is
            missing, not because nothing has been written.
          </p>
        </div>
      ) : (
        <>
          {/* Counts derived from the rows below */}
          <NotesListStats notes={notes} />

          <NotesCardContainer
            notes={notes}
            blogs={blogs}
            categories={categories}
            blogsUnavailable={blogsUnavailable}
            categoriesUnavailable={categoriesUnavailable}
          />
        </>
      )}
    </div>
  );
};

export default NotesListMainWrapper;
