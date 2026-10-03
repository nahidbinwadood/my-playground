'use client';

import { deleteNoteAction, updateNoteAction } from '@/actions/note.action';
import CategoryLabel from '@/components/common/category-label';
import StatusLabel, { STATUS_ACTION_LABEL } from '@/components/common/status-label';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { INote, ICategory, TNoteStatus } from '@/types';
import {
  Check,
  CircleDashed,
  CornerDownRight,
  Ellipsis,
  Eye,
  Loader2,
  NotebookPen,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRefreshContext } from '@/providers/refresh-provider';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { TBlogOption } from '../types';
import { formatNoteDate } from './format-date';
import NoteFormDialog from './note-form-dialog';
import NoteViewDialog from './note-view-dialog';

type TSortKey = 'newest' | 'oldest' | 'updated';

// 'all' is the default; the other two are the literal stored statuses, so the
// filter maps straight onto the query with no translation table.
type TFilterKey = 'all' | TNoteStatus;

const SORT_LABEL: Record<TSortKey, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  updated: 'Recently updated',
};

const FILTER_LABEL: Record<TFilterKey, string> = {
  all: 'All notes',
  DRAFT: 'Drafts',
  COMPLETE: 'Complete',
};

// Sorting on the client keeps the server page a plain fetch. The backend already
// returns newest-first, so this only changes the order when asked.
const sortedNotes = (notes: INote[], sort: TSortKey) => {
  const byDate = (value?: string) => (value ? new Date(value).getTime() : 0);

  return [...notes].sort((a, b) => {
    if (sort === 'oldest') return byDate(a.createdAt) - byDate(b.createdAt);
    if (sort === 'updated') return byDate(b.updatedAt) - byDate(a.updatedAt);
    return byDate(b.createdAt) - byDate(a.createdAt);
  });
};

const NoteCard = ({
  note,
  blogTitle,
  category,
  blogMissing,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  toggling,
}: {
  note: INote;
  blogTitle?: string;
  category?: ICategory;
  blogMissing: boolean;
  onView: (note: INote) => void;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
  onToggleStatus: (note: INote) => void;
  toggling: boolean;
}) => (
  <article className="flex flex-col gap-3 rounded-[14px] bg-surface p-5 transition-colors hover:bg-muted/60">
    <header className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <CategoryLabel category={category} />
        <StatusLabel status={note.status} />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label={`Actions for ${note.title}`}
          >
            <Ellipsis className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onView(note)}>
            <Eye className="size-4" aria-hidden="true" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(note)}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </DropdownMenuItem>

          {/* The one-click status flip: a single-key PATCH, no dialog */}
          <DropdownMenuItem
            onClick={() => onToggleStatus(note)}
            disabled={toggling}
          >
            {note.status === 'COMPLETE' ? (
              <CircleDashed className="size-4" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            {STATUS_ACTION_LABEL[note.status ?? 'DRAFT']}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(note)}>
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>

    <div className="min-w-0 space-y-1">
      <h3 className="text-base leading-snug font-semibold tracking-tight text-balance">
        <button
          type="button"
          onClick={() => onView(note)}
          className="rounded-sm text-left underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {note.title}
        </button>
      </h3>

      {!note.blog ? (
        <p className="text-xs text-muted-foreground">standalone entry</p>
      ) : blogTitle ? (
        <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <CornerDownRight className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{blogTitle}</span>
        </p>
      ) : blogMissing ? (
        // the blog was deleted after the note was linked to it
        <p className="text-xs text-warn-ink">attached blog was deleted</p>
      ) : null}
    </div>

    {note.description ? (
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {note.description}
      </p>
    ) : note.content ? (
      <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground/80">
        {note.content}
      </p>
    ) : null}

    <footer className="mt-auto flex items-center justify-between gap-3 pt-3">
      <time
        dateTime={note.createdAt}
        className="font-mono text-xs tabular-nums text-muted-foreground"
      >
        {formatNoteDate(note.createdAt)}
      </time>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onView(note)}
        className="h-7 gap-1.5 rounded-md px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Eye className="size-3.5" aria-hidden="true" />
        <span>View</span>
      </Button>
    </footer>
  </article>
);

const NotesCardContainer = ({
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
  const [sort, setSort] = useState<TSortKey>('newest');
  const [filter, setFilter] = useState<TFilterKey>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [viewItem, setViewItem] = useState<INote | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [editItem, setEditItem] = useState<INote | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState<INote | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const { refresh } = useRefreshContext();

  // the note carries only ids — resolve both against the lists the page loaded
  const blogTitleById = useMemo(
    () => new Map(blogs.map((blog) => [blog.id, blog.title])),
    [blogs]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  // Filter first, then sort: the filter narrows the set, the sort orders it.
  const visible = useMemo(
    () =>
      filter === 'all'
        ? notes
        : notes.filter((n) => (n.status ?? 'DRAFT') === filter),
    [notes, filter]
  );
  const ordered = useMemo(() => sortedNotes(visible, sort), [visible, sort]);

  // Mark complete / Mark draft. A single-key PATCH — the backend treats a
  // missing key as "leave it alone", so nothing else on the note is touched.
  const handleToggleStatus = (note: INote) => {
    if (togglingId) return;

    const currentStatus = note.status ?? 'DRAFT';
    const next = currentStatus === 'COMPLETE' ? 'DRAFT' : 'COMPLETE';
    setTogglingId(note.id);

    startTransition(async () => {
      try {
        // parse() throws on a non-success envelope, so reaching the toast means
        // the write landed.
        await updateNoteAction(note.id, { status: next });

        toast.success(
          next === 'COMPLETE'
            ? 'Marked complete — it now appears on the public homepage'
            : 'Moved back to draft — hidden from the public homepage'
        );
        refresh();
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to change the status'
        );
      } finally {
        setTogglingId(null);
      }
    });
  };

  const handleDelete = () => {
    if (isPending || !deleteItem) return;

    startTransition(async () => {
      try {
        const response = await deleteNoteAction(deleteItem.id);

        if (response.success) {
          toast.success(response.message || 'Note deleted');
          refresh();
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
            'space-y-4 transition-opacity duration-200',
            isPending && 'pointer-events-none opacity-60'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label-mono">
              {filter === 'all'
                ? `${ordered.length} ${ordered.length === 1 ? 'note' : 'notes'}`
                : `${ordered.length} of ${notes.length} ${
                    notes.length === 1 ? 'note' : 'notes'
                  }`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-mono">Status</span>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as TFilterKey)}
              >
                <SelectTrigger size="sm" aria-label="Filter notes by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(FILTER_LABEL) as TFilterKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {FILTER_LABEL[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="label-mono">Sort</span>
              <Select
                value={sort}
                onValueChange={(value) => setSort(value as TSortKey)}
              >
                <SelectTrigger size="sm" aria-label="Sort notes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(SORT_LABEL) as TSortKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SORT_LABEL[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {ordered.length === 0 ? (
            <div className="rounded-[14px] bg-surface px-6 py-14 text-center">
              <p className="text-base font-semibold tracking-tight">
                No notes match this filter.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {filter === 'COMPLETE'
                  ? 'Nothing is marked complete yet. Mark a note complete and it appears on the public homepage.'
                  : 'Every note is marked complete. Switch the filter above to see the rest.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ordered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                blogTitle={
                  note.blog ? blogTitleById.get(note.blog) : undefined
                }
                category={categoryById.get(note.category)}
                blogMissing={Boolean(note.blog) && !blogsUnavailable}
                onToggleStatus={handleToggleStatus}
                toggling={togglingId === note.id}
                onView={(note) => {
                  setViewItem(note);
                  setViewOpen(true);
                }}
                onEdit={(note) => {
                  setEditItem(note);
                  setEditOpen(true);
                }}
                onDelete={(note) => {
                  setDeleteItem(note);
                  setDeleteOpen(true);
                }}
              />
            ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[14px] bg-surface">
          <div className="flex flex-col items-center gap-4 px-5 py-16 text-center sm:px-8">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
              <NotebookPen className="h-5 w-5" />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                No notes yet
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                Nothing has been written here. Every takeaway you log lands in
                this feed, and the first one starts the streak.
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

      {/* Read-only view — the eye in the card menu */}
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

export default NotesCardContainer;
