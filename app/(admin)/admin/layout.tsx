import AdminLayout from '@/components/layout/admin-layout';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default DashboardLayout;
