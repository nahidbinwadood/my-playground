'use client';

import { logoutAction } from '@/actions/auth.action';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DropdownMenuItem } from '../ui/dropdown-menu';

const LogoutButton = () => {
  const router = useRouter();

  //logout handler==>
  const handleLogout = async () => {
    try {
      const response = await logoutAction();

      if (response.success) {
        toast.success('Logged out', {
          description:
            response?.message ||
            'Your session ended. Log in again to return to the console.',
        });
        router.push('/auth/login');
      }
    } catch (error: any) {
      toast.error('Logout failed', {
        description:
          error?.message || 'The server did not respond. Try again.',
      });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      aria-label="Log out of the admin console"
      className="font-mono text-xs tracking-tight text-fail focus:bg-fail/10 focus:text-fail"
    >
      <LogOut aria-hidden="true" className="size-4 text-fail" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
