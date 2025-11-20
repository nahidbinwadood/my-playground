import FormInput from '@/components/forms/shadcn/form-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { selectInputFormSchema, SelectInputFormValues } from './schema';

const SelectInputForm = () => {
  // declare form methods==>
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      accountType: '',
    },
    resolver: zodResolver(selectInputFormSchema),
  });

  // submit handlers==>
  const onSubmit = async (data: SelectInputFormValues) => {
    try {
      console.log('formData', data);
      toast.success('Form submitted successfully !');
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
            control={methods.control}
            label="Name"
            tooltip="Enter your name"
            placeholder="Enter your name"
            required
          />
          <FormInput
            name="email"
            control={methods.control}
            label="Email"
            tooltip="Enter your email"
            placeholder="Enter your email"
            required
          />

          <FormSelect
            name="accountType"
            control={methods.control}
            label="Account Type "
            tooltip="Enter your account type"
            placeholder="Enter your account type"
            options={[
              { label: 'User', value: 'user' },
              { label: 'Super Admin', value: 'super-admin' },
              { label: 'Retailer', value: 'retailer' },
              { label: 'Loyalty Executive', value: 'loyalty-executive' },
            ]}
            required
          />

          <Button className="w-full">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default SelectInputForm;
