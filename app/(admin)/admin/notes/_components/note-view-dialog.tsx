'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryLabel from '@/components/common/category-label';
import { INote, ICategory } from '@/types';
import { Pencil } from 'lucide-react';
import { TBlogOption } from '../types';
import { formatNoteDate } from './format-date';

const MetaCell = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="min-w-0">
    <dt className="label-mono">{label}</dt>
    <dd className="mt-1 truncate text-sm">{children}</dd>
  </div>
);

/**
 * The eye in the row menu: the whole note, without leaving the table. The body
 * is plain text written in a textarea, so it renders with its line breaks
 * preserved rather than parsed as markup.
 */
const NoteViewDialog = ({
  note,
  open,
  onOpenChange,
  blogs,
  categoryById,
  onEdit,
}: {
  note: INote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogs: TBlogOption[];
  categoryById: Map<string, ICategory>;
  onEdit: (note: INote) => void;
}) => {
  // Nothing to describe while the menu is closed.
  if (!note) return null;

  const blog = note.blog
    ? blogs.find((option) => option.id === note.blog)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hide-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-semibold">
            {note.title}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs tabular-nums">
            Logged {formatNoteDate(note.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {note.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-line bg-surface px-4 py-3 sm:grid-cols-3">
          <MetaCell label="Category">
            {categoryById.get(note.category) ? (
              <CategoryLabel category={categoryById.get(note.category)} />
            ) : (
              '—'
            )}
          </MetaCell>
          <MetaCell label="Source">
            {blog ? blog.title : 'Standalone'}
          </MetaCell>
          <MetaCell label="Updated">
            <span className="font-mono text-xs tabular-nums">
              {formatNoteDate(note.updatedAt)}
            </span>
          </MetaCell>
        </dl>

        <div className="overflow-hidden rounded-lg border border-border">
          <p className="label-mono border-b border-line bg-surface px-4 py-2">
            Body
          </p>
          <div className="hide-scrollbar max-h-80 overflow-y-auto px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
            {note.content || '—'}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onEdit(note);
            }}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteViewDialog;
