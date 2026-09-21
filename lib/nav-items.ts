import {
  LayoutDashboard,
  LucideIcon,
  NotebookPen,
  Package,
  Tags,
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
  {
    title: 'Notes',
    href: '/admin/notes',
    icon: NotebookPen,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
];
