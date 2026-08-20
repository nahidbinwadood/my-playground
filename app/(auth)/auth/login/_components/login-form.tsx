'use client';

import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '../schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { loginAction } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';

const LABEL_CLASS =
  'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-foreground data-[error=true]:text-fail';

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL_CLASS}>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="h-10 font-mono text-sm"
                />
              </FormControl>
              <FormMessage className="text-fail" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL_CLASS}>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={loading}
                    className="h-10 pr-11 font-mono text-sm"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                  className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </button>
              </div>
              <FormMessage className="text-fail" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-2 h-10 w-full font-mono text-sm tracking-tight"
          loading={loading}
          loadingText="Signing in"
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
