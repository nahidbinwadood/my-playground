'use client';

import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '../schema';
import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<LoginFormValues>({
    defaultValues: {
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
      console.log(values);
      await new Promise((res) => setTimeout(res, 2000));
      toast.success('🎉 Welcome Back!', {
        description:
          'You’re logged in successfully. Let’s get things moving 🚀',
      });
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error('Failed to login');
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
