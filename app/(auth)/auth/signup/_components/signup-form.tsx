'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignupFormValues, signupSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SignupForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // declaring the form==>
  const form = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  //submit handler==>
  const onSubmit = async (values: SignupFormValues) => {
    if (loading) return;
    try {
      setLoading(true);
      console.log(values);
      await new Promise((res) => setTimeout(res, 2000));
      toast.success('🎉 Welcome To Playground!', {
        description: 'Your signup completed successfully',
      });
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error('Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  //main component==>
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        control={form.control}
        name="email"
        label="Email"
        placeholder="Enter your email"
        required
        disabled={loading}
      />
      <FormInput
        control={form.control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        disabled={loading}
        required
      />

      <Button
        className="w-full"
        loading={loading}
        loadingText="Creating account..."
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
