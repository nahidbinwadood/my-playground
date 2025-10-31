'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    accountType: z.enum(['personal', 'business']),
    companyName: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.accountType === 'business') {
        return !!data.companyName && data.companyName.length >= 2;
      }
      return true;
    },
    {
      message: 'Company name is required for business accounts',
      path: ['companyName'],
    }
  )
  .refine(
    (data) => {
      if (data.accountType === 'personal') {
        return !!data.phone && data.phone.length >= 10;
      }
      return true;
    },
    {
      message: 'Phone number is required for personal accounts',
      path: ['phone'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function ConditionalValidationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      accountType: 'business',
      companyName: '',
      phone: '',
    },
  });

  const accountType = useWatch({ control: form.control, name: 'accountType' });

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {accountType === 'business' && (
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {accountType === 'personal' && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
