'use client';

import { deleteNoteAction } from '@/actions/note.action';
import { DataTable } from '@/components/tables/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { INote, ICategory } from '@/types';
import { Loader2, NotebookPen, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { TBlogOption } from '../types';
import { notesColumn } from './column';
import NoteFormDialog from './note-form-dialog';
import NoteViewDialog from './note-view-dialog';

const NotesTableContainer = ({
  notes,
  blogs,
  categories,
  blogsUnavailable,
  categoriesUnavailable,
}: {
  notes: INote[];
  blogs: TBlogOption[];
  categories: ICategory[];
  blogsUnavailable: boolean;
  categoriesUnavailable: boolean;
}) => {
  const [viewItem, setViewItem] = useState<INote | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [editItem, setEditItem] = useState<INote | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState<INote | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // the note carries only ids — resolve both against the lists the page loaded
  const blogTitleById = new Map(blogs.map((blog) => [blog.id, blog.title]));
  const categoryById = new Map(
    categories.map((category) => [category.id, category])
  );

  const handleDelete = () => {
    if (isPending || !deleteItem) return;

    startTransition(async () => {
      try {
        const response = await deleteNoteAction(deleteItem.id);

        if (response.success) {
          toast.success(response.message || 'Note deleted');
          router.refresh();
        } else {
          toast.error(response.message || 'Failed to delete the note');
        }
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete the note'
        );
      } finally {
        setDeleteItem(null);
        setDeleteOpen(false);
      }
    });
  };

  const hasNotes = notes.length > 0;

  return (
    <section>
      {hasNotes ? (
        <div
          aria-busy={isPending}
          className={cn(
            'transition-opacity duration-200',
            isPending && 'pointer-events-none opacity-60'
          )}
        >
          <DataTable
            columns={notesColumn({
              blogTitleById,
              categoryById,
              onView: (note) => {
                setViewItem(note);
                setViewOpen(true);
              },
              onEdit: (note) => {
                setEditItem(note);
                setEditOpen(true);
              },
              onDelete: (note) => {
                setDeleteItem(note);
                setDeleteOpen(true);
              },
            })}
            data={notes}
            tableTitle="All notes"
            tableDescription="Sort by any column header. Notes are private — nothing in this table is public."
            emptyMessage="No notes match this view."
          />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex flex-col items-center gap-4 px-5 py-16 text-center sm:px-8">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-muted-foreground"
            >
              <NotebookPen className="h-5 w-5" />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                No notes yet
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                Nothing has been written here. Every takeaway you log lands in
                this table, and the first one starts the streak.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/notes/create-note">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Log a note
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Read-only view — the eye in the row menu */}
      <NoteViewDialog
        note={viewItem}
        open={viewOpen}
        onOpenChange={setViewOpen}
        blogs={blogs}
        categoryById={categoryById}
        onEdit={(note) => {
          setEditItem(note);
          setEditOpen(true);
        }}
      />

      {/* Edit — prefilled, saves over the saved entry */}
      <NoteFormDialog
        note={editItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        blogs={blogs}
        categories={categories}
        blogsUnavailable={blogsUnavailable}
        categoriesUnavailable={categoriesUnavailable}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">
              Delete this note?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteItem?.title}&quot; will be removed for good, and the
              day it was logged loses its entry. There is no undo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep note</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-fail text-background hover:bg-fail/90"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Deleting
                </span>
              ) : (
                'Delete note'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default NotesTableContainer;
