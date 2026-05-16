'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { logoutAction } from '@/actions/auth.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  //logout handler==>
  const handleLogout = async () => {
    try {
      const response = await logoutAction();

      if (response.success) {
        toast.success('👋 Logged Out Successfully', {
          description:
            response?.message ||
            'You have been logged out successfully. See you again soon 🚀',
        });
        router.push('/auth/login');
      }
    } catch (error: any) {
      toast.error('Logout Failed', {
        description:
          error?.message || 'Something went wrong. Please try again.',
      });
    }
  };
  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
