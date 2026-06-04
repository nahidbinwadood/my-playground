'use client';

import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '../schema';
import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { loginAction } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const isDevMode = process.env.NEXT_PUBLIC_ENV === 'development';

  const form = useForm<LoginFormValues>({
    defaultValues: isDevMode
      ? { email: 'superadmin@gmail.com', password: 'Admin@123' }
      : {
          email: '',
          password: '',
        },
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  //submit handler==>
  const onSubmit = async (values: LoginFormValues) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await loginAction(values);

      if (response?.success) {
        toast.success('🎉 Welcome Back!', {
          description:
            response?.message ||
            'You’re logged in successfully. Let’s get things moving 🚀',
        });
        router.push('/admin/dashboard');
        form.reset();
      } else {
        toast.error('Login Failed', {
          description: response?.message || 'Invalid credentials.',
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Login Failed', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        control={form.control}
        label="Email"
        placeholder="Enter your email"
        name="email"
        required
        disabled={loading}
      />

      <FormInput
        label="Password"
        control={form.control}
        type="password"
        name="password"
        placeholder="Enter your password"
        required
        disabled={loading}
      />

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        loadingText="Logging..."
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
