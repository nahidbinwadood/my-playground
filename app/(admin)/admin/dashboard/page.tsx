'use client';

import React, { useEffect, useState, Suspense } from 'react';
import PageHeader from '@/components/common/page-header';
import { StatsCard } from '@/components/common/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import { IBlogs } from '@/app/(homepage)/blogs/types';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg border">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  const [blogs, setBlogs] = useState<IBlogs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const stats = {
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter((b) => b.status === 'published').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
    draftBlogs: blogs.filter((b) => b.status === 'draft').length,
  };

  const recentBlogs = blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const topBlogs = blogs
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your admin dashboard. Manage your blog content and view analytics."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Blogs"
          value={stats.totalBlogs}
          description="All published and draft blogs"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Published"
          value={stats.publishedBlogs}
          description="Live blogs"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Drafts"
          value={stats.draftBlogs}
          description="Work in progress"
          icon={<BarChart className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          description="Combined views"
          icon={<Eye className="h-4 w-4" />}
        />
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
                  <div key={blog.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium truncate">{blog.title}</p>
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
                  <div key={blog.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium truncate">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">{blog.viewCount} views</p>
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
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
