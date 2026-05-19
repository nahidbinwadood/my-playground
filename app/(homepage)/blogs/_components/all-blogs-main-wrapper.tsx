import { IBlog } from '@/types';
import BlogCard from './blog-card';

const AllBlogsMainWrapper = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <section className="mt-5">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs?.map((blog: any) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default AllBlogsMainWrapper;
