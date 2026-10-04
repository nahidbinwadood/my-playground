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
import { formatNoteDate } from '@/lib/journal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-1.5rem)] flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-card p-4 sm:max-w-2xl sm:rounded-3xl sm:p-6 shadow-2xl">
        {/* Header with clearance for Radix absolute Close (X) button at top-4 right-4 */}
        <DialogHeader className="pr-10 sm:pr-12 text-left">
          {/* Metadata Row: Category badge, Read time, Copy action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
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

          <DialogTitle className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl break-words text-left">
            {note.title}
          </DialogTitle>

          <DialogDescription className="font-mono text-xs tabular-nums text-muted-foreground text-left">
            Documented on {formatNoteDate(note.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {/* Optional Description / Summary callout */}
        {note.description ? (
          <div className="rounded-lg border border-line/60 bg-surface/60 p-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground break-words">
            {note.description}
          </div>
        ) : null}

        {/* Main Note Body with Markdown rendering and responsive code block scrolling */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line/60 bg-surface/40">
          <div className="flex shrink-0 items-center justify-between border-b border-line/40 bg-muted/30 px-4 py-2">
            <span className="label-mono">Takeaway & Observations</span>
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              Prose & Code
            </span>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            <div className="markdown-content text-xs sm:text-sm leading-relaxed break-words text-foreground/90">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {note.content || '—'}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Parent Blog Reference Footer */}
        {blog ? (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-line/40 bg-surface/60 p-3 sm:p-3.5">
            <div className="min-w-0 flex-1">
              <span className="label-mono text-[0.6875rem]">Parent study reference</span>
              <p className="truncate text-xs sm:text-sm font-medium text-foreground">
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
