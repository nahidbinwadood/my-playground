import PageHeader from '@/components/common/page-header';
import CreateBlogForm from '../../../create-blog/_components/create-blog-form';

const EditBlogMainWrapper = ({ blogData }: { blogData: any }) => {
  return (
    <section>
      {/* Page Header */}
      <PageHeader
        title="Edit Blog"
        subtitle="Write and publish a new blog post"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Blogs', href: '/admin/blogs' },
          { label: 'Edit Blog' },
        ]}
      />

      {/* Create Blog Form */}
      <CreateBlogForm blogData={blogData} />
    </section>
  );
};

export default EditBlogMainWrapper;
