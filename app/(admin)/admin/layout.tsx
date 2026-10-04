import { getProfileAction } from '@/actions/auth.action';
import AdminLayout from '@/components/layout/admin-layout';
import AuthProvider from '@/providers/auth-provider';
import { redirect } from 'next/navigation';
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getProfileAction();

  // The proxy already refreshed an expired token, so a failure here means the
  // session is truly dead (revoked, user deactivated, secret rotated). A layout
  // cannot clear cookies, so the route handler does it and sends us to login.
  if (!user?.data) {
    redirect('/auth/expired');
  }

  return (
    <AuthProvider initialUser={user.data}>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
};

export default DashboardLayout;
