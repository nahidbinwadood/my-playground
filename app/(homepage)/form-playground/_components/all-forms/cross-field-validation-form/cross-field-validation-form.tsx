import FormDatePicker from '@/components/forms/shadcn/form-date-picker';
import FormDateRangePicker from '@/components/forms/shadcn/form-date-range-picker';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CrossFieldValidationFormValues,
  crossFieldValidationSchema,
} from './schema';

const CrossFieldValidationForm = () => {
  // declare the form==>
  const form = useForm<CrossFieldValidationFormValues>({
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      validityStart: undefined,
      validityEnd: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(crossFieldValidationSchema),
  });

  // submit handlers==>
  const onSubmit = async (data: CrossFieldValidationFormValues) => {
    try {
      console.log('IFormData', data);
      toast.success('Form submitted successfully !');
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const startDate = useWatch({ name: 'startDate', control: form.control });
  const endDate = useWatch({ name: 'endDate', control: form.control });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormDatePicker
            name="startDate"
            label="Start Date"
            placeholder="Enter the start date"
            tooltip="Enter the start date"
            control={form.control}
            required
            disableDateFn={(date: Date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                return date < today || date >= end;
              }
              return date < today;
            }}
          />

          <FormDatePicker
            name="endDate"
            label="End Date"
            placeholder="Enter the end date"
            tooltip="Enter the end date"
            control={form.control}
            required
            disabled={!startDate}
            disableDateFn={(date: Date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (startDate) {
                const start = new Date(startDate);
                return date <= start;
              }
              return date < today;
            }}
          />
          <FormDateRangePicker
            label="Reward Validity"
            required
            placeholder="Enter your dates"
            tooltip="Enter your dates"
            startName="validityStart"
            endName="validityEnd"
            numberOfMonths={2}
            disableDateFn={(date: Date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
          <Button className="w-full">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default CrossFieldValidationForm;
