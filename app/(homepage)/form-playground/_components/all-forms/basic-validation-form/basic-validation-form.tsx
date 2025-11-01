import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BasicValidationFormValues, basicValidationSchema } from './schema';

const BasicValidationForm = () => {
  // declare the methods==>
  const methods = useForm<BasicValidationFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(basicValidationSchema),
    mode: 'onChange',
  });

  // submit handlers==>
  const onSubmit = async (data: BasicValidationFormValues) => {
    try {
      console.log('formData', data);
      toast.success('Form submitted successfully !');
      methods.reset();
    } catch (error) {
      toast.error('Please fill all the required fields');
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your name"
          tooltip="Enter your name"
          control={methods.control}
          required
        />

        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          tooltip="Enter your email"
          required
          control={methods.control}
        />

        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          control={methods.control}
          required
          tooltip="Enter your password"
        />

        {/* submit button */}
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default BasicValidationForm;
