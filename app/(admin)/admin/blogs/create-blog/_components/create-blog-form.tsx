/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createBlogAction, updateBlogAction } from '@/actions/blog.action';
import PageHeader from '@/components/common/page-header';
import FormImageUploader from '@/components/forms/shadcn/form-image-uploader';
import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormMarkdownEditor from '@/components/forms/shadcn/form-markdown-editor';
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogFormValues, blogSchema } from '../validation/blog-schema';
import '../../../../../(homepage)/blogs/[slug]/markdown-content.css';

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

  const onSubmit = async (data: BlogFormValues) => {
    if (loading) return;
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append('title', data.title);
      payload.append('excerpt', data.excerpt ?? '');
      payload.append('content', data.content);
      payload.append('status', data.status);
      payload.append('type', data.type);

      if (data.coverImage instanceof File) {
        payload.append('coverImage', data.coverImage);
      }

      if (blogData?.id) {
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

  const status = form.watch('status');
  const content = form.watch('content');
  const willPublish = status === 'PUBLISHED';
  const errorCount = Object.keys(form.formState.errors).length;

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="grid items-start gap-6 xl:grid-cols-2">
          {/* Left column — all form inputs */}
          <div className="space-y-6">
            {/* Title + Excerpt */}
            <Panel label="Headline" hint="Required">
              <FieldGroup label="">
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
            </Panel>

            {/* Publish settings — compact horizontal row */}
            <Panel label="Publish" hint={isEdit ? 'Update' : 'New'}>
              <div className="grid gap-4 p-4 sm:p-5 sm:grid-cols-2">
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
                  label="Type"
                  placeholder="Select a type"
                  options={[
                    { label: 'Frontend', value: 'FRONTEND' },
                    { label: 'Backend', value: 'BACKEND' },
                    { label: 'Javascript', value: 'JAVASCRIPT' },
                  ]}
                  required
                />
              </div>

              <div className="border-t border-line p-4 sm:p-5">
                <FormImageUploader
                  control={form.control}
                  name="coverImage"
                  label="Cover image"
                  required
                />
              </div>
            </Panel>

            {/* Markdown Editor */}
            <Panel label="Content" hint="Markdown">
              <FieldGroup label="">
                <FormMarkdownEditor
                  label="Body"
                  placeholder="Paste or write markdown here..."
                  control={form.control}
                  name="content"
                  required
                />
              </FieldGroup>
            </Panel>
          </div>

          {/* Right column — sticky live preview */}
          <div className="sticky top-6 hidden xl:block">
            <Panel label="Preview" hint="Live" className="h-[calc(100vh-6rem)]">
              <div className="h-[calc(100%-2.75rem)] overflow-y-auto p-4 sm:p-5">
                {content?.trim() ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm italic text-muted-foreground">
                      Start writing to see a live preview.
                    </p>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 z-20 -mx-4 -mb-4 bg-background/90 px-6 py-3 backdrop-blur sm:-mx-6 sm:-mb-6">
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
