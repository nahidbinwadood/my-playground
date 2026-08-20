'use client';

import StatusPill from '@/components/common/status-pill';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { IBlog } from '@/types';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Small helper to format an ISO date as "Jan 5, 2026".
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Column headers that sort are real buttons: the arrow states which way the
// column is currently ordered, and the accessible name says it out loud.
const SortHeader = ({
  column,
  label,
}: {
  column: Column<IBlog, unknown>;
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

export const adminBlogsColumn = ({
  setSelectedItem,
  setOpen,
}: {
  setSelectedItem: React.Dispatch<React.SetStateAction<IBlog | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<IBlog>[] => [
  // ─── SELECT ─────────────────────────────────────
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.title}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ─── TITLE + SLUG ───────────────────────────────
  {
    accessorKey: 'title',
    header: ({ column }) => <SortHeader column={column} label="Title" />,
    cell: ({ row }) => (
      <div className="w-60 min-w-56 space-y-1">
        <p className="font-sans text-sm leading-snug font-medium wrap-break-word whitespace-normal text-foreground">
          {row.original.title}
        </p>
        <p className="font-mono text-xs wrap-break-word whitespace-normal text-muted-foreground">
          /blogs/{row.original.slug}
        </p>
      </div>
    ),
  },

  // ─── TYPE ───────────────────────────────────────
  {
    accessorKey: 'type',
    header: ({ column }) => <SortHeader column={column} label="Type" />,
    cell: ({ row }) => {
      const type = row.original.type;
      if (!type) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-muted-foreground">
          {type}
        </span>
      );
    },
  },

  // ─── EXCERPT ────────────────────────────────────
  {
    accessorKey: 'excerpt',
    header: 'Excerpt',
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[280px] text-sm leading-relaxed whitespace-normal text-muted-foreground">
        {row.original.excerpt || '—'}
      </p>
    ),
  },

  // ─── AUTHOR ─────────────────────────────────────
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => (
      <span className="block max-w-[140px] text-sm whitespace-normal text-foreground">
        {row.original.author || '—'}
      </span>
    ),
  },

  // ─── CREATED DATE ──────────────────────────────
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader column={column} label="Created" />,
    cell: ({ row }) => (
      <time
        dateTime={row.original.createdAt}
        className="font-mono text-xs tabular-nums text-muted-foreground"
      >
        {formatDate(row.original.createdAt)}
      </time>
    ),
  },

  // ─── UPDATED DATE ──────────────────────────────
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortHeader column={column} label="Updated" />,
    cell: ({ row }) => (
      <time
        dateTime={row.original.updatedAt}
        className="font-mono text-xs tabular-nums text-muted-foreground"
      >
        {formatDate(row.original.updatedAt)}
      </time>
    ),
  },

  // ─── STATUS ─────────────────────────────────────
  {
    accessorKey: 'isPublished',
    header: ({ column }) => <SortHeader column={column} label="Status" />,
    cell: ({ row }) => <StatusPill status={row.original.isPublished} />,
  },

  // ─── ACTIONS ───────────────────────────────────
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const blog = row.original;

      return (
        <div className="flex items-center justify-end gap-1">
          {/* EDIT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link
                  href={`/admin/blogs/edit-blog/${blog?.slug}`}
                  aria-label={`Edit ${blog?.title}`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit post</TooltipContent>
          </Tooltip>

          {/* DELETE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${blog?.title}`}
                className="text-fail hover:bg-fail/10 hover:text-fail"
                onClick={() => {
                  setOpen(true);
                  setSelectedItem(row.original);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete post</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
