import FormInput from '@/components/forms/shadcn/form-input';
import FormPhoneInput from '@/components/forms/shadcn/form-phone-input';
import FormSelect from '@/components/forms/shadcn/form-select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
      accountType: '',
      companyName: '',
      phone: '',
    },
    mode: 'onChange',
    resolver: zodResolver(conditionalValidationFormSchema),
  });

  // submit handlers==>
  const onSubmit = async (data: ConditionalValidationFormValues) => {
    try {
      console.log('IFormData', data);
      toast.success('Form submitted successfully ! ');
      methods.reset({
        name: '',
        email: '',
        accountType: '',
        companyName: '',
        phone: '',
      });
    } catch (error) {
      console.log(error);
      toast.error('Please fill all the required fields');
    }
  };

  // getting the values==>
  const accountType = useWatch({
    control: methods.control,
    name: 'accountType',
  });
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

          <FormSelect
            name="accountType"
            control={methods.control}
            label="Account Type"
            placeholder="Select account type"
            tooltip="Select your account type"
            required
            options={[
              { label: 'Personal', value: 'personal' },
              { label: 'Business', value: 'business' },
            ]}
          />

          {/* Company Name */}
          {accountType == 'business' && (
            <FormInput
              name="companyName"
              control={methods.control}
              label="Company Name"
              required
              placeholder="Enter your company name"
              tooltip="Enter your company name"
            />
          )}

          {/* Phone number */}
          {accountType == 'personal' && (
            <FormPhoneInput
              label="Phone"
              required
              tooltip="Enter your phone number"
              name="phone"
              defaultCountry="BD"
              placeholder="Enter your number"
              control={methods.control}
            />
          )}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConditionalValidationForm;
