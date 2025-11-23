import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { fieldArrayFormSchema, FieldArrayFormValues } from './schema';

const FieldArrayForm = () => {
  // declare the form==>
  const form = useForm<FieldArrayFormValues>({
    defaultValues: {
      address: [
        {
          name: '',
          email: '',
          phone: [],
        },
      ],
    },
    mode: 'onChange',
    resolver: zodResolver(fieldArrayFormSchema),
  });

  // submit handlers==>
  const onSubmit = (data: FieldArrayFormValues) => {
    try {
      console.log('IFormData', data);
    } catch (error) {
      console.log(error);
    }
  };

  const {} = useFieldArray({ name: 'contact' });
  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h4 className="text-lg font-semibold">Contact</h4>
        </div>
      </form>
    </Form>
  );
};

export default FieldArrayForm;
