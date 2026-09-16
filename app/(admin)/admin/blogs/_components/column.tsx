'use client';

import StatusPill from '@/components/common/status-pill';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { IBlog } from '@/types';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Ellipsis,
  Pencil,
  Trash2,
  Globe,
  FileDown,
} from 'lucide-react';
import Link from 'next/link';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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

const typeTone: Record<string, string> = {
  FRONTEND: 'border-iris/30 bg-iris/10 text-iris',
  BACKEND: 'border-signal/30 bg-signal/10 text-signal',
  JAVASCRIPT: 'border-warn/30 bg-warn/10 text-warn',
};

export const adminBlogsColumn = ({
  setSelectedItem,
  setOpen,
  setToggleItem,
  setToggleOpen,
}: {
  setSelectedItem: React.Dispatch<React.SetStateAction<IBlog | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleItem: React.Dispatch<React.SetStateAction<IBlog | null>>;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<IBlog>[] => [
  // --- TITLE + SLUG ---
  {
    accessorKey: 'title',
    header: ({ column }) => <SortHeader column={column} label="Title" />,
    cell: ({ row }) => (
      <div className="min-w-0 max-w-xs space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {row.original.title}
        </p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          /blogs/{row.original.slug}
        </p>
      </div>
    ),
  },

  // --- TYPE ---
  {
    accessorKey: 'type',
    header: ({ column }) => <SortHeader column={column} label="Type" />,
    cell: ({ row }) => {
      const type = row.original.type;
      if (!type) return <span className="text-muted-foreground">-</span>;
      return (
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em]',
            typeTone[type] ?? 'border-line bg-surface text-muted-foreground'
          )}
        >
          {type}
        </span>
      );
    },
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
        {formatDate(row.original.updatedAt)}
      </time>
    ),
  },

  // --- STATUS ---
  {
    accessorKey: 'isPublished',
    header: ({ column }) => <SortHeader column={column} label="Status" />,
    cell: ({ row }) => <StatusPill status={row.original.isPublished} />,
  },

  // --- ACTIONS ---
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const blog = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              aria-label={`Actions for ${blog.title}`}
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/admin/blogs/edit-blog/${blog.slug}`}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setToggleItem(blog);
                setToggleOpen(true);
              }}
            >
              {blog.isPublished ? (
                <>
                  <FileDown className="size-4" aria-hidden="true" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="size-4" aria-hidden="true" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setSelectedItem(blog);
                setOpen(true);
              }}
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
