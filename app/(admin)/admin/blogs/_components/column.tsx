import { IBlog } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ─── TITLE ─────────────────────────────────────
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },

  // ─── STATUS (FIXED) ───────────────────────────
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => {
      const isPublished = row.original.isPublished;

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isPublished
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
      );
    },
  },

  // ─── SLUG (OPTIONAL BUT USEFUL) ───────────────
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.slug}</div>
    ),
  },

  // ─── CREATED DATE ──────────────────────────────
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      );
    },
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
                href={`/admin/blogs/edit-blog/${blog.id}`}
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
