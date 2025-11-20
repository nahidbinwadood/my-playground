import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  conditionalValidationFormSchema,
  ConditionalValidationFormValues,
} from './schema';

const ConditionalValidationForm = () => {
  // declare form methods==>
  const methods = useForm<ConditionalValidationFormValues>({
    defaultValues: {
      name: '',
      email: '',
      accountType: null,
    },
    mode: 'onChange',
    resolver: zodResolver(conditionalValidationFormSchema),
  });

  // submit handlers==>
  const onSubmit = async (data: ConditionalValidationFormValues) => {
    try {
      console.log('IFormData', data);
      toast.success('Form submitted successfully ! ');
      methods.reset();
    } catch (error) {
      console.log(error);
      toast.error('Please fill all the required fields');
    }
  };
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormInput
            name="name"
            label="Name"
            placeholder="Enter your name"
            control={methods.control}
            tooltip="Enter your name"
            required
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            control={methods.control}
            tooltip="Enter your email"
            required
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConditionalValidationForm;
