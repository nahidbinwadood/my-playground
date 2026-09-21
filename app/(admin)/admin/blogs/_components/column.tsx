'use client';

import CategoryLabel from '@/components/common/category-label';
import StatusPill from '@/components/common/status-pill';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { IBlog, ICategory } from '@/types';
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

export const adminBlogsColumn = ({
  categoryById,
  setSelectedItem,
  setOpen,
  setToggleItem,
  setToggleOpen,
}: {
  categoryById: Map<string, ICategory>;
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

  // --- CATEGORY ---
  {
    // sort by the category's name, not its id
    accessorFn: (blog) => categoryById.get(blog.category)?.name ?? '',
    id: 'category',
    header: ({ column }) => <SortHeader column={column} label="Category" />,
    cell: ({ row }) => {
      const category = categoryById.get(row.original.category);

      // a category deleted out from under the post, or a list that failed to
      // load — say nothing rather than inventing one
      if (!category) {
        return <span className="text-muted-foreground">—</span>;
      }

      return <CategoryLabel category={category} />;
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
