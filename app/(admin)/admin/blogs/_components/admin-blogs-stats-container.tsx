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
    accent: 'emerald' | 'blue' | 'amber' | 'violet';
  }[] = [
    {
      title: 'Total Blogs',
      value: stats.total,
      description: 'All published and draft blogs',
      icon: FileText,
      accent: 'emerald',
    },
    {
      title: 'Published',
      value: stats.published,
      description: 'Live blogs',
      icon: TrendingUp,
      accent: 'blue',
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      description: 'Work in progress',
      icon: BarChart,
      accent: 'amber',
    },
    {
      title: 'Total Views',
      value: 0,
      description: 'Combined views',
      icon: Eye,
      accent: 'violet',
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {blogsStats?.map((item) => (
        <StatsCard
          key={item?.title}
          title={item?.title}
          value={item?.value}
          description={item?.description}
          accent={item?.accent}
          icon={<item.icon className="h-5 w-5" />}
        />
      ))}
    </div>
  );
};

export default AdminBlogsStatsContainer;
