/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createBlogAction, updateBlogAction } from '@/actions/blog.action';
import PageHeader from '@/components/common/page-header';
import FormImageUploader from '@/components/forms/shadcn/form-image-uploader';
import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormTextEditor from '@/components/forms/shadcn/form-text-editor';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/providers/auth-provider';
import { IBlog } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BlogFormValues, blogSchema } from '../validation/blog-schema';

/**
 * Bordered panel with a mono header strip — the spec-sheet device used across
 * the admin. Purely presentational.
 */
const Panel = ({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn('rounded-lg border border-border bg-card', className)}>
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

/** One labelled group of fields inside a panel, separated by a hairline rule. */
const FieldGroup = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn('space-y-4 p-4 sm:p-5', className)}>
    <h3 className="label-mono">{label}</h3>
    {children}
  </div>
);

const CreateBlogForm = ({ blogData }: { blogData?: IBlog }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { user } = useAuthContext();

  // declare the form==>
  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: blogData?.title || '',
      excerpt: blogData?.excerpt || '',
      content: blogData?.content || '',
      coverImage: blogData?.coverImage || '',
      status: blogData?.isPublished ? 'PUBLISHED' : 'DRAFT',
      type: blogData?.type || 'FRONTEND',
      author: blogData?.author || '',
    },
    resolver: zodResolver(blogSchema),
    mode: 'onChange',
  });

  //submit handler==>
  const onSubmit = async (data: BlogFormValues) => {
    if (loading) return;
    try {
      setLoading(true);

      // Multipart payload: plain fields + cover photo file.
      const payload = new FormData();
      payload.append('title', data.title);
      payload.append('excerpt', data.excerpt ?? '');
      payload.append('content', data.content);
      payload.append('status', data.status);
      payload.append('type', data.type);
      // payload.append('isPublished', String(data.status === 'PUBLISHED'));
      // File = new upload; string = unchanged existing URL (edit mode).
      if (data.coverImage instanceof File) {
        payload.append('coverImage', data.coverImage);
      }

      if (blogData?.id) {
        // Photo replaced → tell the backend which old image to delete.
        if (data.coverImage instanceof File && blogData.coverImage) {
          payload.append('deleteImageUrl', blogData.coverImage);
        }

        const response = await updateBlogAction(blogData.id, payload);

        if (response.success) {
          toast.success(response.message || 'Blog Updated Successfully');
          router.push('/admin/blogs');
        } else {
          throw new Error(response.message);
        }
      } else {
        payload.append('author', user?.id ?? '');

        const response = await createBlogAction(payload);

        if (response.success) {
          toast.success(response.message || 'Blog Created Successfully');
          router.push('/admin/blogs');
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.message || 'Failed to create blog');
    }
  };

  const isEdit = Boolean(blogData?.id);

  // Read-only reads for the action bar copy — no effect on submission.
  const status = form.watch('status');
  const willPublish = status === 'PUBLISHED';
  const errorCount = Object.keys(form.formState.errors).length;

  // Button keeps the same verb through the flow; the -ing form is the pending
  // label and `min-w` stops the swap from resizing the button.
  const submitLabel = isEdit
    ? 'Save changes'
    : willPublish
    ? 'Publish post'
    : 'Save draft';
  const pendingLabel = isEdit
    ? 'Saving changes'
    : willPublish
    ? 'Publishing'
    : 'Saving draft';

  // main component==>
  return (
    <Form {...form}>
      {/* pb-24 leaves room so the sticky bottom bar never covers form content */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
        <PageHeader
          title={isEdit ? 'Edit post' : 'New post'}
          subtitle={
            isEdit
              ? 'Update the post and save your changes.'
              : 'Write the post, set its topic, and choose whether it publishes or stays a draft.'
          }
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Blogs', href: '/admin/blogs' },
            { label: isEdit ? 'Edit post' : 'New post' },
          ]}
        />

        {/* Authoring layout: editor column + publishing column, side by side
            from xl up, stacked below it. */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Editor column */}
          <Panel label="Editor" hint="Post body">
            <FieldGroup label="Headline">
              <FormInput
                control={form.control}
                name="title"
                label="Title"
                placeholder="Debouncing a search input in React"
                required
              />
              <FormInput
                control={form.control}
                name="excerpt"
                label="Excerpt"
                placeholder="One or two sentences shown in the blog list"
              />
            </FieldGroup>

            <FieldGroup label="Content" className="border-t border-line">
              <FormTextEditor
                label="Body"
                placeholder="Write the post. Headings, code blocks and links are in the toolbar."
                control={form.control}
                name="content"
                required
              />
            </FieldGroup>
          </Panel>

          {/* Publishing column */}
          <Panel label="Publishing" hint={isEdit ? 'Update' : 'New'}>
            <FieldGroup label="Visibility">
              <FormSelect
                control={form.control}
                name="status"
                label="Status"
                placeholder="Select a status"
                options={[
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Published', value: 'PUBLISHED' },
                ]}
                required
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
            </FieldGroup>

            <FieldGroup label="Media" className="border-t border-line">
              <FormImageUploader
                control={form.control}
                name="coverImage"
                label="Cover image"
                required
              />
            </FieldGroup>
          </Panel>
        </div>

        {/* Sticky action bar: Cancel/Save always reachable while scrolling.
            -mx-6/-mb-6 cancel the admin shell's p-6 so the bar spans full width. */}
        <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-6 border-t border-line bg-background/90 px-6 py-3 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {errorCount > 0 ? (
              <p
                role="status"
                className="font-mono text-xs tabular-nums text-fail"
              >
                Fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} before
                saving
              </p>
            ) : (
              <p className="label-mono">
                Saves as {willPublish ? 'published' : 'draft'}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" asChild disabled={loading}>
                <Link href="/admin/blogs">Cancel</Link>
              </Button>
              <Button
                type="submit"
                loading={loading}
                loadingText={pendingLabel}
                className="min-w-[11.5rem]"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateBlogForm;
