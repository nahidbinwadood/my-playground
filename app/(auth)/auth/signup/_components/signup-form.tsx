'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignupFormValues, signupSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LABEL_CLASS =
  'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-foreground data-[error=true]:text-fail';

const SignupForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
                    autoComplete="new-password"
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
              <FormDescription className="text-xs leading-relaxed">
                At least 8 characters, with one uppercase letter, one lowercase
                letter, one number, and one symbol.
              </FormDescription>
              <FormMessage className="text-fail" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-2 h-10 w-full font-mono text-sm tracking-tight"
          loading={loading}
          loadingText="Creating account"
        >
          Create account
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
