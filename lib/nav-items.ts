import {
  BarChart3,
  Ellipsis,
  FileText,
  Layers,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Navigation,
  Package,
} from 'lucide-react';

export interface INavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: INavItem[];
}

export const navItems: INavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: Package,
  },
];
