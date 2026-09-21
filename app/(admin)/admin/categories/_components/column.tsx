'use client';

import CategoryLabel from '@/components/common/category-label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ICategory } from '@/types';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Ellipsis,
  Pencil,
  Trash2,
} from 'lucide-react';

const SortHeader = ({
  column,
  label,
}: {
  column: Column<ICategory, unknown>;
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

export const categoriesColumn = ({
  onEdit,
  onDelete,
}: {
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}): ColumnDef<ICategory>[] => [
  // --- NAME + DESCRIPTION ---
  {
    accessorKey: 'name',
    header: ({ column }) => <SortHeader column={column} label="Name" />,
    cell: ({ row }) => (
      <div className="min-w-0 max-w-sm space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {row.original.name}
        </p>
        {row.original.description ? (
          <p className="truncate text-xs text-muted-foreground">
            {row.original.description}
          </p>
        ) : null}
      </div>
    ),
  },

  // --- SLUG ---
  {
    accessorKey: 'slug',
    header: ({ column }) => <SortHeader column={column} label="Slug" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
        {row.original.slug}
      </span>
    ),
  },

  // --- TONE ---
  {
    accessorKey: 'tone',
    header: ({ column }) => <SortHeader column={column} label="Tone" />,
    cell: ({ row }) => <CategoryLabel category={row.original} />,
  },

  // --- ORDER (the picker order) ---
  {
    accessorKey: 'order',
    header: ({ column }) => <SortHeader column={column} label="Order" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {row.original.order}
      </span>
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
        {new Date(row.original.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </time>
    ),
  },

  // --- ACTIONS ---
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              aria-label={`Actions for ${category.name}`}
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(category)}
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
