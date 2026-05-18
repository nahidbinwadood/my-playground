'use client';

import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import FormTextEditor from '@/components/forms/shadcn/form-text-editor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
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
      status: blogData?.status || 'DRAFT',
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

      if (blogData?.id) {
        // create blog==>
        const response = await updateBlogAction(blogData?.id, { ...data });

        if (response.success) {
          toast.success(response.message || 'Blog Updated Successfully');
          router.push('/admin/blogs');
        } else {
          throw new Error(response.message);
        }
      } else {
        // create blog===>
        const response = await createBlogAction({ ...data, author: user?.id });

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

  // main component==>
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Content</CardTitle>
        <CardDescription>Write your blog title and excerpt</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            <FormInput
              control={form.control}
              name="coverImage"
              label="Cover Image"
              placeholder="Enter your Cover Image"
              required
            />
            <FormTextEditor
              label="Blog Content"
              placeholder="Enter your blog content"
              control={form.control}
              name="content"
              required
            />
            <FormSelect
              control={form.control}
              name="status"
              label="Blog Status"
              placeholder="Enter Blog Status"
              options={[
                {
                  label: 'Draft',
                  value: 'DRAFT',
                },
                {
                  label: 'Published',
                  value: 'PUBLISHED',
                },
              ]}
              required
            />

            <FormSelect
              control={form.control}
              name="type"
              label="Blog Type"
              placeholder="Enter Blog Type"
              options={[
                {
                  label: 'Frontend',
                  value: 'FRONTEND',
                },
                {
                  label: 'Backend',
                  value: 'BACKEND',
                },
                {
                  label: 'Javascript',
                  value: 'JAVASCRIPT',
                },
              ]}
              required
            />

            {/* Submit */}
            <div className="w-full pt-2 grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                className="w-full h-11"
                asChild
                disabled={loading}
              >
                <Link href="/admin/blogs">Cancel</Link>
              </Button>
              <Button loading={loading} className="w-full h-11">
                {blogData?.id ? 'Edit' : 'Create'} Blog
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateBlogForm;
