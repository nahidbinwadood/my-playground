'use client';

import CategoryLabel from '@/components/common/category-label';
import StatusLabel from '@/components/common/status-label';
import CommonModal from '@/components/modal/common-modal';
import { Button } from '@/components/ui/button';
import { ICategory, INote } from '@/types';
import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import '@/app/(homepage)/blogs/[slug]/markdown-content.css';
import { TBlogOption } from '../types';
import { formatNoteDate } from './format-date';
import NoteAIPanel from './note-ai-panel';

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
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={note.title}
      description={
        <span className="font-mono text-xs tabular-nums">
          Logged {formatNoteDate(note.createdAt)}
        </span>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
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
        </div>
      }
    >
      <div className="space-y-4">
        {note.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-line bg-surface px-4 py-3 sm:grid-cols-4">
          <MetaCell label="Status">
            <StatusLabel status={note.status} />
          </MetaCell>
          <MetaCell label="Category">
            {categoryById.get(note.category) ? (
              <CategoryLabel category={categoryById.get(note.category)} />
            ) : (
              '—'
            )}
          </MetaCell>
          <MetaCell label="Source">{blog ? blog.title : 'Standalone'}</MetaCell>
          <MetaCell label="Updated">
            <span className="font-mono text-xs tabular-nums">
              {formatNoteDate(note.updatedAt)}
            </span>
          </MetaCell>
        </dl>

        {/* The body scrolls with the modal now — the header stays put, so a long
            note no longer needs a second scroller inside this panel. */}
        <div className="overflow-hidden rounded-lg border border-border">
          <p className="label-mono border-b border-line bg-surface px-4 py-2">
            Body
          </p>
          <div className="markdown-content p-4 text-sm leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {note.content || '—'}
            </ReactMarkdown>
          </div>
        </div>

        {/* keyed so another note never shows this note's cards */}
        <NoteAIPanel key={note.id} noteId={note.id} />
      </div>
    </CommonModal>
  );
};

export default NoteViewDialog;
