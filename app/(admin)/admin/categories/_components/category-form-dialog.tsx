'use client';

import {
  createCategoryAction,
  updateCategoryAction,
} from '@/actions/category.action';
import CategoryLabel from '@/components/common/category-label';
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
import { CATEGORY_TONE_LABEL, CATEGORY_TONES } from '@/lib/categories';
import { ICategory, TCategoryTone } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CategoryFormValues,
  categorySchema,
} from '../validation/category-schema';

const EMPTY_VALUES: CategoryFormValues = {
  name: '',
  description: '',
  tone: 'iris',
};

/**
 * One dialog for both create and edit: a category is three fields, and mirroring
 * the notes table beats a second route for it. `category` is null when creating.
 *
 * The tone preview is the point — the API stores a token, so this is where the
 * owner sees which badge the name will wear before saving it.
 */
const CategoryFormDialog = ({
  category,
  open,
  onOpenChange,
}: {
  category: ICategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(category);

  const form = useForm<CategoryFormValues>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
  });

  const name = form.watch('name');
  const tone = form.watch('tone');

  // reset on open, never during typing
  useEffect(() => {
    if (!open) return;

    form.reset(
      category
        ? {
            name: category.name,
            description: category.description ?? '',
            tone: category.tone,
          }
        : EMPTY_VALUES
    );
  }, [open, category, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() ?? '',
        tone: data.tone,
      };

      const response = category
        ? await updateCategoryAction(category.id, payload)
        : await createCategoryAction(payload);

      toast.success(
        response.message ||
          (category ? 'Category updated' : 'Category created')
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save the category'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-semibold">
            {isEdit ? 'Edit category' : 'New category'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit
              ? 'Renaming renames it everywhere — blogs, notes, the tracker. The slug follows the name.'
              : 'Categories are the topic axis for blogs and notes. New ones append to the end of the list.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="Frontend"
              required
            />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="What belongs in this category"
              className="min-h-20"
            />

            <FormSelect
              control={form.control}
              name="tone"
              label="Tone"
              placeholder="Pick a tone"
              options={CATEGORY_TONES.map((value) => ({
                label: CATEGORY_TONE_LABEL[value],
                value,
              }))}
              required
            />

            {/* Live preview of the badge every blog and note will carry */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <span className="label-mono">Badge preview</span>
              <CategoryLabel
                category={{
                  id: 'preview',
                  name: name?.trim() || 'Category',
                  slug: '',
                  tone: (tone as TCategoryTone) ?? 'iris',
                  order: 0,
                  createdAt: '',
                  updatedAt: '',
                }}
                size="md"
              />
            </div>

            <DialogFooter className="border-t border-line pt-4">
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
                {isEdit ? 'Save changes' : 'Create category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
