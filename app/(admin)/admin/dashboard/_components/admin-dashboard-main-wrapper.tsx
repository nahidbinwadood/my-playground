import PageHeader from '@/components/common/page-header';
import blogs from '../../../../(homepage)/blogs/data/blogs.json';
import { BarChart, Clock, Eye, FileText, LucideIcon, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/common/stats-card';
import StatusPill from '@/components/common/status-pill';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Accent = 'emerald' | 'blue' | 'amber' | 'violet';

const AdminDashboardMainWrapper = () => {
  const stats = {
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter((b) => b.status === 'published').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
    draftBlogs: blogs.filter((b) => b.status === 'draft').length,
  };

  // Each stat card gets its own accent color for a colorful analytics feel.
  const dashboardStats: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
    accent: Accent;
  }[] = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      description: 'All published and draft blogs',
      icon: FileText,
      accent: 'emerald',
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      description: 'Live blogs',
      icon: TrendingUp,
      accent: 'blue',
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs,
      description: 'Work in progress',
      icon: BarChart,
      accent: 'amber',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      description: 'Combined views',
      icon: Eye,
      accent: 'violet',
    },
  ];

  const recentBlogs = [...blogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const topBlogs = [...blogs].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <section className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your admin dashboard. Manage your blog content and view analytics."
        className="mb-0"
      />

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            accent={item.accent}
            icon={<item.icon className="h-5 w-5" />}
          />
        ))}
      </div>

      {/* Recent + Top blogs */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent blogs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Blogs
            </CardTitle>
            <CardDescription>Latest published blogs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentBlogs.length > 0 ? (
              <>
                {recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {blog.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusPill status={blog.status} />
                  </div>
                ))}
                <Button variant="outline" className="mt-3 w-full" asChild>
                  <Link href="/admin/blogs">View All</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No blogs yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top blogs by views */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Top Blogs
            </CardTitle>
            <CardDescription>Most viewed blogs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {topBlogs.length > 0 ? (
              <>
                {topBlogs.map((blog, i) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {/* Rank badge */}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <p className="truncate text-sm font-medium">
                        {blog.title}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      {blog.viewCount}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="mt-3 w-full" asChild>
                  <Link href="/admin/blogs">View All</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No blogs yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboardMainWrapper;
