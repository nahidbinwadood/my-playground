'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CategoryLabel from '@/components/common/category-label';
import { cn } from '@/lib/utils';
import { INote, ICategory } from '@/types';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  CornerDownRight,
  Ellipsis,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { formatNoteDate } from './format-date';

const SortHeader = ({
  column,
  label,
}: {
  column: Column<INote, unknown>;
  label: string;
}) => {
  const sorted = column.getIsSorted();
  const Icon =
    sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;
  const state =
    sorted === 'asc'
      ? 'sorted ascending'
      : sorted === 'desc'
        ? 'sorted descending'
        : 'not sorted';

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      aria-label={`Sort by ${label.toLowerCase()}, ${state}`}
      className="label-mono group -mx-1.5 inline-flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <Icon
        aria-hidden="true"
        className={cn(
          'h-3 w-3 shrink-0 transition-opacity',
          sorted ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
        )}
      />
    </button>
  );
};

export const notesColumn = ({
  blogTitleById,
  categoryById,
  onView,
  onEdit,
  onDelete,
}: {
  blogTitleById: Map<string, string>;
  categoryById: Map<string, ICategory>;
  onView: (note: INote) => void;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
}): ColumnDef<INote>[] => [
  // --- TITLE + SOURCE ---
  {
    accessorKey: 'title',
    header: ({ column }) => <SortHeader column={column} label="Title" />,
    cell: ({ row }) => {
      const note = row.original;
      const blogTitle = note.blog ? blogTitleById.get(note.blog) : undefined;

      return (
        <div className="min-w-0 max-w-sm space-y-0.5">
          <p className="truncate text-sm font-medium text-foreground">
            {note.title}
          </p>
          {!note.blog ? (
            <p className="truncate text-xs text-muted-foreground">
              standalone entry
            </p>
          ) : blogTitle ? (
            <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <CornerDownRight className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{blogTitle}</span>
            </p>
          ) : (
            // the blog was deleted after the note was linked to it
            <p className="truncate text-xs text-warn-ink">
              attached blog was deleted
            </p>
          )}
        </div>
      );
    },
  },

  // --- CATEGORY ---
  {
    // sort by the category's name, not its id
    accessorFn: (note) => categoryById.get(note.category)?.name ?? '',
    id: 'category',
    header: ({ column }) => <SortHeader column={column} label="Category" />,
    cell: ({ row }) => {
      const category = categoryById.get(row.original.category);

      // a category deleted under the note, or a list that failed to load
      if (!category) return <span className="text-muted-foreground">—</span>;

      return <CategoryLabel category={category} />;
    },
  },

  // --- CREATED ---
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader column={column} label="Created" />,
    cell: ({ row }) => (
      <time
        dateTime={row.original.createdAt}
        className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground"
      >
        {formatNoteDate(row.original.createdAt)}
      </time>
    ),
  },

  // --- UPDATED ---
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortHeader column={column} label="Updated" />,
    cell: ({ row }) => (
      <time
        dateTime={row.original.updatedAt}
        className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground"
      >
        {formatNoteDate(row.original.updatedAt)}
      </time>
    ),
  },

  // --- ACTIONS ---
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const note = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(note)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
