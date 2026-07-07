import { IBlog } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import StatusPill from '@/components/common/status-pill';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Small helper to format an ISO date as "Jan 5, 2026".
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Colored badge per blog type.
const typeColors: Record<IBlog['type'], string> = {
  FRONTEND: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  BACKEND: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  JAVASCRIPT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
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
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ─── TITLE (fixed width, truncates) ─────────────
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="w-60 font-medium wrap-break-word whitespace-normal">
        {row.original.title}
      </div>
    ),
  },

  // ─── TYPE (badge) ──────────────────────────────
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      if (!type) return <span className="text-muted-foreground">—</span>;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[type] ?? 'bg-muted text-muted-foreground'}`}
        >
          {type.charAt(0) + type.slice(1).toLowerCase()}
        </span>
      );
    },
  },

  // ─── EXCERPT (max width, truncates) ────────────
  {
    accessorKey: 'excerpt',
    header: 'Excerpt',
    cell: ({ row }) => (
      <div className="max-w-[280px] wrap-break-word whitespace-normal text-sm text-muted-foreground">
        {row.original.excerpt || '—'}
      </div>
    ),
  },

  // ─── AUTHOR (max width) ────────────────────────
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => (
      <div className="max-w-[140px] wrap-break-word whitespace-normal text-sm">
        {row.original.author || '—'}
      </div>
    ),
  },

  // ─── CREATED DATE ──────────────────────────────
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="w-25 text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },

  // ─── UPDATED DATE ──────────────────────────────
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => (
      <div className="w-25 text-sm text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </div>
    ),
  },

  // ─── STATUS (moved to the end) ─────────────────
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => <StatusPill status={row.original.isPublished} />,
  },

  // ─── ACTIONS ───────────────────────────────────
  {
    id: 'actions',
    cell: ({ row }) => {
      const blog = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* EDIT */}
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/blogs/edit-blog/${blog?.slug}`}
                className="flex items-center cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            {/* DELETE */}
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => {
                setOpen(true);
                setSelectedItem(row.original);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
