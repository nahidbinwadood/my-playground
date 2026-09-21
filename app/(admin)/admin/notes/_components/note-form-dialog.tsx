'use client';

import { updateNoteAction } from '@/actions/note.action';
import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormTextarea from '@/components/forms/shadcn/form-textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { INote, INoteInput, ICategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TBlogOption } from '../types';
import {
  NoteFormValues,
  NoteSubmitValues,
  STANDALONE,
  noteSchema,
} from '../validation/note-schema';

const EMPTY_VALUES: NoteFormValues = {
  blog: STANDALONE,
  title: '',
  description: '',
  category: '',
  content: '',
};

/**
 * Edit a note in place: the same fields and the same schema as the quick-note
 * form, opened from the row menu and prefilled from the saved entry, so fixing
 * a typo never means leaving the table.
 *
 * Deliberately unlike the create form, picking a different blog here does NOT
 * overwrite the title, category or body — those belong to the note, and silently
 * replacing them while editing is how you lose your own words.
 */
const NoteFormDialog = ({
  note,
  open,
  onOpenChange,
  blogs,
  categories,
  blogsUnavailable,
  categoriesUnavailable,
}: {
  note: INote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogs: TBlogOption[];
  categories: ICategory[];
  blogsUnavailable: boolean;
  categoriesUnavailable: boolean;
}) => {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const form = useForm<NoteFormValues, unknown, NoteSubmitValues>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
  });

  // `reset` rather than render-time defaults: reopening the dialog after an edit
  // starts from the saved values again, and a re-render while typing can never
  // clobber what has been typed.
  useEffect(() => {
    if (!open || !note) return;

    form.reset({
      blog: note.blog ?? STANDALONE,
      title: note.title,
      description: note.description ?? '',
      category: note.category ?? '',
      content: note.content,
    });
  }, [open, note, form]);

  const errorCount = Object.keys(form.formState.errors).length;

  const onSubmit = async (data: NoteSubmitValues) => {
    if (saving || !note) return;

    try {
      setSaving(true);

      const payload: Partial<INoteInput> = {
        title: data.title.trim(),
        content: data.content,
        category: data.category,
        blog: data.blog === STANDALONE ? null : data.blog,
        // sent even when empty — clearing a description is a real edit, and the
        // backend treats a missing key as "leave it alone"
        description: data.description?.trim() ?? '',
      };

      const response = await updateNoteAction(note.id, payload);

      toast.success(response.message || 'Note updated');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update the note'
      );
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd + Enter saves, same as the quick-note form.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hide-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-semibold">
            Edit note
          </DialogTitle>
          <DialogDescription className="text-sm">
            Changes save straight to the journal. The timeline and the streak
            pick them up on the next load.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {blogsUnavailable ? (
              <div className="rounded-lg border border-warn/40 bg-card px-4 py-3">
                <p className="label-mono text-warn-ink">
                  Blog list unavailable
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The reference blogs could not be loaded, so this note can only
                  be detached or kept as it is.
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
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
              />

              <FormSelect
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select a category"
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                description={
                  categoriesUnavailable
                    ? 'The category list could not be loaded. Reload before saving.'
                    : undefined
                }
                required
              />
            </div>

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

            <DialogFooter className="border-t border-line pt-4 sm:items-center sm:justify-between">
              {errorCount > 0 ? (
                <p
                  role="status"
                  className="font-mono text-xs tabular-nums text-fail-ink"
                >
                  Fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} before
                  saving
                </p>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  loadingText="Saving"
                  className="min-w-[9rem]"
                >
                  Save changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteFormDialog;
