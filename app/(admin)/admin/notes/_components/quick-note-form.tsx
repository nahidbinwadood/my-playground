'use client';

import { createNoteAction } from '@/actions/note.action';
import PageHeader from '@/components/common/page-header';
import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormTextarea from '@/components/forms/shadcn/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { INoteInput } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TBlogOption } from '../types';
import {
  NoteFormValues,
  STANDALONE,
  noteSchema,
} from '../validation/note-schema';

const Panel = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <section className="rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
      <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-foreground">
        {label}
      </h2>
      {hint ? (
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </div>
    {children}
  </section>
);

const DEFAULT_VALUES: NoteFormValues = {
  blog: STANDALONE,
  title: '',
  description: '',
  type: 'FRONTEND',
  content: '',
};

const QuickNoteForm = ({
  blogs,
  blogsUnavailable,
}: {
  blogs: TBlogOption[];
  blogsUnavailable: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<NoteFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
  });

  const { getValues, setValue } = form;

  // Guards the title prefill: only overwrite when the field is still empty or
  // still holds the title we put there, never a title the user typed.
  const lastPrefill = useRef<string | null>(null);

  const selectedBlog = form.watch('blog');
  const content = form.watch('content');
  const errorCount = Object.keys(form.formState.errors).length;

  useEffect(() => {
    const blog = blogs.find((option) => option.id === selectedBlog);

    if (!blog) {
      lastPrefill.current = null;
      return;
    }

    const currentTitle = getValues('title');
    const stillAutoFilled = lastPrefill.current === currentTitle;

    if (currentTitle.trim() === '' || stillAutoFilled) {
      setValue('title', blog.title, { shouldValidate: false });
      setValue('type', blog.type, { shouldValidate: false });
      lastPrefill.current = blog.title;
    }
  }, [selectedBlog, blogs, getValues, setValue]);

  const onSubmit = async (data: NoteFormValues) => {
    if (loading) return;

    try {
      setLoading(true);

      const payload: INoteInput = {
        title: data.title.trim(),
        content: data.content,
        type: data.type,
        blog: data.blog === STANDALONE ? null : data.blog,
      };

      const description = data.description?.trim();
      if (description) {
        payload.description = description;
      }

      const response = await createNoteAction(payload);

      toast.success(response.message || 'Note saved');
      // Reset rather than navigate: the point of this page is logging the next
      // thought, not admiring the last one.
      form.reset(DEFAULT_VALUES);
      lastPrefill.current = null;
      // the timeline below re-renders server-side so the new entry is
      // immediately part of the feed
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save the note'
      );
    } finally {
      setLoading(false);
    }
  };

  // Ctrl/Cmd + Enter saves without leaving the keyboard.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  const linkedBlog = blogs.find((option) => option.id === selectedBlog);

  const statusLabel = linkedBlog
    ? `Saves against "${linkedBlog.title}"`
    : 'Saves as a standalone entry';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader
          title="New note"
          subtitle="Write what you actually understood. Link it to a blog of reference material, or keep it standalone."
          eyebrow="/admin/notes"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Notes' },
          ]}
        />

        {blogsUnavailable ? (
          <div className="mb-6 rounded-lg border border-warn/40 bg-card px-4 py-3">
            <p className="label-mono text-warn">Blog list unavailable</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The reference blogs could not be loaded, so a note cannot be linked
              to one right now. Standalone entries are unaffected.
            </p>
          </div>
        ) : null}

        <div className="max-w-3xl space-y-6">
          <Panel label="Source" hint="Optional">
            <div className="space-y-4 p-4 sm:p-5">
              <FormSelect
                control={form.control}
                name="blog"
                label="Reference blog"
                placeholder="Select a blog"
                options={[
                  { label: 'Standalone entry', value: STANDALONE },
                  ...blogs.map((blog) => ({
                    label: blog.title,
                    value: blog.id,
                  })),
                ]}
                description="Pick a blog to attach this note to. Choosing one prefills the title and topic below."
              />

              <FormSelect
                control={form.control}
                name="type"
                label="Topic"
                placeholder="Select a topic"
                options={[
                  { label: 'Frontend', value: 'FRONTEND' },
                  { label: 'Backend', value: 'BACKEND' },
                  { label: 'Javascript', value: 'JAVASCRIPT' },
                ]}
                required
              />
            </div>
          </Panel>

          <Panel label="Note" hint="Required">
            <div className="space-y-4 p-4 sm:p-5">
              <FormInput
                control={form.control}
                name="title"
                label="Title"
                placeholder="What this note is about"
                required
              />

              <FormInput
                control={form.control}
                name="description"
                label="Description"
                placeholder="Optional one-liner"
              />

              <FormTextarea
                control={form.control}
                name="content"
                label="Body"
                placeholder="What did you understand? What is still unclear?"
                required
                hint="Ctrl + Enter to save"
                onKeyDown={handleKeyDown}
              />
            </div>

            <footer className="flex flex-col gap-3 border-t border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              {errorCount > 0 ? (
                <p
                  role="status"
                  className="font-mono text-xs tabular-nums text-fail"
                >
                  Fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} before
                  saving
                </p>
              ) : (
                <p
                  className={cn(
                    'label-mono min-w-0 truncate',
                    content.trim() ? '' : 'text-muted-foreground'
                  )}
                >
                  {statusLabel}
                </p>
              )}

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    form.reset(DEFAULT_VALUES);
                    lastPrefill.current = null;
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Saving"
                  className="min-w-[9rem]"
                >
                  Save note
                </Button>
              </div>
            </footer>
          </Panel>
        </div>
      </form>
    </Form>
  );
};

export default QuickNoteForm;
