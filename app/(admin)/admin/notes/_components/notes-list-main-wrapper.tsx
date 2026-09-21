'use client';

import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { INote, ICategory } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { TBlogOption } from '../types';
import NotesListSkeleton from './notes-list-skeleton';
import NotesListStats from './notes-list-stats';
import NotesTableContainer from './notes-table-container';

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
  const [isPending] = useTransition();

  if (isPending) {
    return <NotesListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header row: title/breadcrumbs on the left, the one signal action on the right */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
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
        <div className="rounded-lg border border-border bg-card px-5 py-10 text-center">
          <p className="text-sm font-medium text-warn-ink">Could not load notes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The API did not respond, so this table is empty because the data is
            missing, not because nothing has been written.
          </p>
        </div>
      ) : (
        <>
          {/* Counts derived from the rows below */}
          <NotesListStats notes={notes} />

          <NotesTableContainer
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
