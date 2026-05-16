import { getProfileAction } from '@/actions/auth.action';
import AdminLayout from '@/components/layout/admin-layout';
import AuthProvider from '@/providers/auth-provider';
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getProfileAction();
  return (
    <AuthProvider initialUser={user?.data}>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
};

export default DashboardLayout;
