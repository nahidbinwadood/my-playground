import FormInput from '@/components/forms/shadcn/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import PhoneNumberInputWrapper from './phone-number-input-wrapper';
import { fieldArrayFormSchema, FieldArrayFormValues } from './schema';
interface IFormData {
  name: string;
  email: string;
  phone: { value: string }[];
}
const FieldArrayForm = ({
  onSubmit,
  formData,
}: {
  onSubmit: (data: FieldArrayFormValues) => void;
  formData?: IFormData[] | null;
}) => {
  // declare the form==>
  const form = useForm<FieldArrayFormValues>({
    defaultValues: {
      contacts: formData
        ? formData
        : [
            {
              name: '',
              email: '',
              phone: [{ value: '' }],
            },
          ],
    },
    mode: 'onChange',
    resolver: zodResolver(fieldArrayFormSchema),
  });

  // submit handlers==>
  // const onSubmit = (data: FieldArrayFormValues) => {
  //   try {
  //     console.log('IFormData', data);
  //     toast.success('Form submitted successfully !');
  //     form.reset();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const {
    fields: contactFields,
    remove,
    append,
  } = useFieldArray({ name: 'contacts', control: form.control });

  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h4 className="text-lg font-semibold">Contact</h4>

          {/* single contacts */}
          {contactFields?.map((field, index) => (
            <div
              key={field?.id}
              className="mt-5 border rounded-md p-4 space-y-4"
            >
              {!formData && (
                <div className="w-full flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                    disabled={contactFields.length == 1}
                    className="p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              )}
              <FormInput
                name={`contacts.${index}.name`}
                label="Name"
                control={form.control}
                placeholder="Enter your name"
                tooltip="Enter your name"
                required
              />
              <FormInput
                name={`contacts.${index}.email`}
                label="Email"
                control={form.control}
                placeholder="Enter your email"
                tooltip="Enter your email"
                required
              />

              <PhoneNumberInputWrapper index={index} />
            </div>
          ))}

          {/* Add new contact button */}
          {!formData && (
            <div className="mt-4 w-full flex justify-end pb-4">
              <Button
                className="disabled:opacity-50"
                disabled={contactFields?.length >= 5}
                type="button"
                onClick={() => {
                  append({
                    name: '',
                    email: '',
                    phone: [{ value: '' }],
                  });
                }}
              >
                <Plus />
                <span>Add New Contact</span>
              </Button>
            </div>
          )}

          <Button className="w-full">{formData ? 'Update' : 'Submit'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default FieldArrayForm;
