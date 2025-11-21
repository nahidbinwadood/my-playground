import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  multiFieldValidationFormSchema,
  MultiFieldValidationFormValues,
} from './schema';

const MultiFieldValidationForm = () => {
  // declare the form==>
  const form = useForm<MultiFieldValidationFormValues>({
    defaultValues: {
      email: '',
      confirmEmail: '',
    },
    resolver: zodResolver(multiFieldValidationFormSchema),
    mode: 'onChange',
  });

  // submit handlers==>
  const onSubmit = async (data: MultiFieldValidationFormValues) => {
    try {
      console.log('IFormData', data);
      toast.success('Form submitted successfully !');
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormInput
            label="Email"
            control={form.control}
            tooltip="Enter your email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <FormInput
            label="Confirm Email"
            control={form.control}
            tooltip="Enter your email again"
            name="confirmEmail"
            placeholder="Enter your email again"
            required
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MultiFieldValidationForm;
