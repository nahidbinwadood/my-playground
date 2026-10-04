'use client';

import { readingMinutes } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import '@/app/(homepage)/blogs/[slug]/markdown-content.css';
import { IBlog, ICategory, INote } from '@/types';
import CategoryLabel from '@/components/common/category-label';
import CommonModal from '@/components/modal/common-modal';
import { formatNoteDate } from '@/lib/journal';
import { Button } from '@/components/ui/button';
import { Check, Clock, Copy, CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';

interface NoteReadingDialogProps {
  note: INote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ICategory;
  blog?: IBlog;
}

export function NoteReadingDialog({
  note,
  open,
  onOpenChange,
  category,
  blog,
}: NoteReadingDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const handleCopy = async () => {
    const textToCopy = `${note.title}\n\n${note.description ? note.description + '\n\n' : ''}${note.content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      toast.error('Copy failed — your browser blocked clipboard access');
      return;
    }
    setCopied(true);
    toast.success('Takeaway copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // The parent post sits in the pinned footer so its link stays reachable
  // however long the note body scrolls.
  const footer = blog ? (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <span className="label-mono">Parent study reference</span>
        <p className="truncate text-sm font-medium text-foreground">
          {blog.title}
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        asChild
        className="h-7 shrink-0 font-mono text-xs"
      >
        <Link href={`/blogs/${blog.slug}`}>
          <span>Read post</span>
          <CornerDownRight className="ml-1 size-3" />
        </Link>
      </Button>
    </div>
  ) : undefined;

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={note.title}
      description={
        <span className="font-mono text-xs tabular-nums">
          Documented on {formatNoteDate(note.createdAt)}
        </span>
      }
      footer={footer}
      className="sm:max-w-2xl"
    >
      <div className="space-y-4">
        {/* Category, reading time and the copy / open-page actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryLabel category={category} />
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Clock className="size-3 shrink-0" />
              {`${readingMinutes(note.content, 180)} min read`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm bg-surface px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <Check className="size-3 text-signal-ink" />
              ) : (
                <Copy className="size-3" />
              )}
              <span>{copied ? 'Copied' : 'Copy note'}</span>
            </button>
            <Link
              href={`/notes/${note.id}`}
              className="inline-flex h-7 items-center gap-1.5 rounded-sm bg-surface px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>Open page</span>
              <CornerDownRight className="size-3" />
            </Link>
          </div>
        </div>

        {note.description ? (
          <div className="rounded-lg border border-line bg-surface p-3.5 text-sm leading-relaxed break-words text-muted-foreground">
            {note.description}
          </div>
        ) : null}

        {/* No inner scroll here: CommonModal's body is the one scroll area. */}
        <div className="markdown-content text-sm leading-relaxed break-words text-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {note.content || '—'}
          </ReactMarkdown>
        </div>
      </div>
    </CommonModal>
  );
}
