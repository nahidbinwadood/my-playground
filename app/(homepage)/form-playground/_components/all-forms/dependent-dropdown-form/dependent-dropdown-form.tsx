import FormSelect from '@/components/forms/shadcn/form-select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { cityOptions, countryOptions } from './options';
import {
  dependentDropDownFormSchema,
  DependentDropdownFormValues,
} from './schema';

const DependentDropDownForm = () => {
  // declare form methods==>
  const methods = useForm<DependentDropdownFormValues>({
    defaultValues: {
      country: '',
      city: '',
    },
    resolver: zodResolver(dependentDropDownFormSchema),
  });

  //   submit handlers==>
  const handleSubmit = (data: DependentDropdownFormValues) => {
    try {
      console.log('formData', data);
      toast.success('Form submitted successfully !');
      methods.reset();
    } catch (error) {
      console.log(error);
      toast.error('Please fill all the required fields');
    }
  };

  const country = useWatch({ control: methods.control, name: 'country' });

  const newCityOptions = country ? cityOptions[country] : [];

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="space-y-5">
          <FormSelect
            control={methods.control}
            name="country"
            label="Country"
            placeholder="Select your country"
            tooltip="Select your country"
            options={countryOptions}
            required
          />
          <FormSelect
            control={methods.control}
            name="city"
            label="Country"
            disabled={!country}
            placeholder="Select your country"
            tooltip="Select your country"
            options={newCityOptions}
            required
          />
          <Button className="w-full">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default DependentDropDownForm;
