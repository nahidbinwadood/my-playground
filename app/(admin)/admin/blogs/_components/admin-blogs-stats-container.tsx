'use client';

import StatsCard from '@/components/common/stats-card';
import { IBlog } from '@/types';
import { BarChart, Eye, FileText, LucideIcon, TrendingUp } from 'lucide-react';

const AdminBlogsStatsContainer = ({ blogs }: { blogs: IBlog[] }) => {
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.isPublished).length,
    drafts: blogs.filter((b) => !b.isPublished).length,
  };
  const blogsStats: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      title: 'Total Blogs',
      value: stats.total,
      description: 'All published and draft blogs',
      icon: FileText,
    },
    {
      title: 'Published',
      value: stats.published,
      description: 'Live blogs',
      icon: TrendingUp,
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      description: 'Work in progress',
      icon: BarChart,
    },
    {
      title: 'Total Views',
      value: 0,
      description: 'Combined views',
      icon: Eye,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {blogsStats?.map((item) => (
        <StatsCard
          key={item?.title}
          title={item?.title}
          value={item?.value}
          description={item?.description}
          icon={<item.icon className="h-4 w-4" />}
        />
      ))}
    </div>
  );
};

export default AdminBlogsStatsContainer;
