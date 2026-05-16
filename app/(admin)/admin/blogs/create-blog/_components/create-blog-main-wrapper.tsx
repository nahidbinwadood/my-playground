import PageHeader from '@/components/common/page-header';
import React from 'react';
import CreateBlogForm from './create-blog-form';

const CreateBlogMainWrapper = () => {
  return (
    <section>
      {/* Page Header */}
      <PageHeader
        title="Create New Blog"
        subtitle="Write and publish a new blog post"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Blogs', href: '/admin/blogs' },
          { label: 'Create Blog' },
        ]}
      />

      {/* Create Blog Form */}
      <CreateBlogForm />
    </section>
  );
};

export default CreateBlogMainWrapper;
