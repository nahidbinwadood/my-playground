/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import FormImageUploader from '@/components/forms/shadcn/form-image-uploader';
import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormTextEditor from '@/components/forms/shadcn/form-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BlogFormValues, blogSchema } from '../validation/blog-schema';
import { useState } from 'react';
import { createBlogAction, updateBlogAction } from '@/actions/blog.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { IBlog } from '@/types';
import Link from 'next/link';

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

  // main component==>
  return (
    <Form {...form}>
      {/* pb-24 leaves room so the sticky bottom bar never covers form content */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
        {/* Breadcrumb: Dashboard > Blogs > Create/Edit Blog */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/blogs">Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? 'Edit Blog' : 'Add Blog'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? 'Edit Blog' : 'Create Blog'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Update your blog post and save the changes.'
              : 'Write and publish a new blog post.'}
          </p>
        </div>

        {/* Two-column layout: content on the left, settings on the right */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: main content */}
          <Card className="lg:col-span-2 h-fit">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInput
                control={form.control}
                name="title"
                label="Blog Title"
                placeholder="Enter your blog title"
                required
              />
              <FormInput
                control={form.control}
                name="excerpt"
                label="Excerpt"
                placeholder="Enter your blog excerpt"
              />
              <FormTextEditor
                label="Blog Content"
                placeholder="Enter your blog content"
                control={form.control}
                name="content"
                required
              />
            </CardContent>
          </Card>

          {/* Right: publish + media settings */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormSelect
                  control={form.control}
                  name="status"
                  label="Blog Status"
                  placeholder="Enter Blog Status"
                  options={[
                    { label: 'Draft', value: 'DRAFT' },
                    { label: 'Published', value: 'PUBLISHED' },
                  ]}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="type"
                  label="Blog Type"
                  placeholder="Enter Blog Type"
                  options={[
                    { label: 'Frontend', value: 'FRONTEND' },
                    { label: 'Backend', value: 'BACKEND' },
                    { label: 'Javascript', value: 'JAVASCRIPT' },
                  ]}
                  required
                />
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormImageUploader
                  control={form.control}
                  name="coverImage"
                  label="Cover Image"
                  required
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky bottom action bar: Cancel/Save always reachable while scrolling.
            -mx-6/-mb-6 cancel the page's p-6 so the bar spans full width. */}
        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3 border-t bg-background/80 px-6 py-4 backdrop-blur">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/admin/blogs">Cancel</Link>
          </Button>
          <Button loading={loading} className="min-w-32">
            {isEdit ? 'Save Changes' : 'Create Blog'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBlogForm;
