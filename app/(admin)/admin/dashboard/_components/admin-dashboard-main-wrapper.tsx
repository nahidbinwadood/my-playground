import PageHeader from '@/components/common/page-header';
import blogs from '../../../../(homepage)/blogs/data/blogs.json';
import { BarChart, Eye, FileText, LucideIcon, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/common/stats-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminDashboardMainWrapper = () => {
  const stats = {
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter((b) => b.status === 'published').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
    draftBlogs: blogs.filter((b) => b.status === 'draft').length,
  };
  const dashboardStats: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      description: 'All published and draft blogs',
      icon: FileText,
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      description: 'Live blogs',
      icon: TrendingUp,
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs,
      description: 'Work in progress',
      icon: BarChart,
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      description: 'Combined views',
      icon: Eye,
    },
  ];

  const recentBlogs = blogs
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const topBlogs = blogs.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <section className='space-y-6'>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your admin dashboard. Manage your blog content and view analytics."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {dashboardStats?.map((item) => (
          <StatsCard
            key={item?.title}
            title={item?.title}
            value={item?.value}
            description={item?.description}
            icon={<item.icon className="h-4 w-4" />}
          />
        ))}
      </div>

      {/* Recent Blogs and Top Blogs */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>Latest published blogs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBlogs.length > 0 ? (
              <>
                {recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium truncate text-sm">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {blog.status}
                    </span>
                  </div>
                ))}
                <Link href="/admin/blogs">
                  <Button variant="outline" className="w-full mt-4">
                    View All
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No blogs yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Blogs by Views */}
        <Card>
          <CardHeader>
            <CardTitle>Top Blogs</CardTitle>
            <CardDescription>Most viewed blogs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBlogs.length > 0 ? (
              <>
                {topBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium truncate text-sm">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {blog.viewCount} views
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/blogs">
                  <Button variant="outline" className="w-full mt-4">
                    View All
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No blogs yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboardMainWrapper;
