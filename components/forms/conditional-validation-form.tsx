'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import FormInput from './shadcn/form-input';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(30, 'Name cannot be more than 30 character'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(30, 'Email cannot be more than 30 character'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(20, 'Password cannot be more than 20 character'),
});

type FormValues = z.infer<typeof formSchema>;

export function ConditionalValidationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    toast.success('Form submitted successfully!', {
      // description: `Account type: ${data.accountType}`,
    });
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            name="name"
            control={form.control}
            label="Name"
            placeholder="Enter Your name"
            tooltip="Enter Your name"
            required
          />

          <FormInput
            label="Email"
            placeholder="Enter your email"
            control={form.control}
            name="email"
            tooltip="Enter your email"
            required
          />
          <FormInput
            label="Password"
            placeholder="Enter your password"
            control={form.control}
            name="password"
            type="password"
            required
            tooltip="Enter your password"
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
