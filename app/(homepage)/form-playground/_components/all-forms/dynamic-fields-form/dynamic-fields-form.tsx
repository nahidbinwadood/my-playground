import FormInput from '@/components/forms/shadcn/form-input';
import FormNumberInput from '@/components/forms/shadcn/form-number-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { dynamicFieldsFormSchema, DynamicFieldsFormValues } from './schema';

interface IDynamicFieldsFormProps {
  onSubmit: (data: DynamicFieldsFormValues) => void;
  defaultValues?: DynamicFieldsFormValues['address'];
}
const DynamicFieldsForm = ({
  onSubmit,
  defaultValues,
}: IDynamicFieldsFormProps) => {
  // declare the form==>
  const form = useForm<DynamicFieldsFormValues>({
    defaultValues: {
      address: defaultValues
        ? defaultValues
        : [{ street: '', city: '', state: '', zipCode: undefined }],
    },
    resolver: zodResolver(dynamicFieldsFormSchema),
    mode: 'onChange',
  });

  //   field array==>
  const { fields, append, remove } = useFieldArray({
    name: 'address',
    control: form.control,
  });

  // remove handlers==>
  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h4 className="text-lg font-semibold">Address</h4>

          {/* address fields */}
          {fields?.map((field, index) => (
            <div
              key={field.id}
              className="mt-5 p-4 border rounded-md space-y-4"
            >
              {/* ===remove button=== */}
              {!defaultValues && (
                <div className="w-full flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={fields.length <= 1 || !!defaultValues}
                    className="p-2 disabled:text-muted-foreground disabled:cursor-not-allowed"
                    title={
                      fields.length <= 1
                        ? 'At least one reward is required'
                        : 'Remove reward'
                    }
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              )}

              {/* ===Main Form inputs=== */}
              <FormInput
                name={`address.${index}.street`}
                label="Street"
                placeholder="Enter your street"
                tooltip="Enter your street"
                control={form.control}
                required
              />
              <FormInput
                name={`address.${index}.city`}
                label="City"
                placeholder="Enter your city"
                tooltip="Enter your city"
                control={form.control}
                required
              />
              <FormInput
                name={`address.${index}.state`}
                label="State"
                placeholder="Enter your state"
                tooltip="Enter your state"
                control={form.control}
                required
              />
              <FormNumberInput
                name={`address.${index}.zipCode`}
                label="Zip Code"
                placeholder="Enter your zipCode"
                tooltip="Enter your zipCode"
                control={form.control}
                required
              />
            </div>
          ))}

          {/* add be address field */}
          {!defaultValues && (
            <div className="mt-4 w-full flex justify-end">
              <Button
                className="disabled:opacity-50"
                disabled={fields.length === 5 || !!defaultValues}
                type="button"
                onClick={() => {
                  if (fields.length < 5) {
                    append({
                      street: '',
                      city: '',
                      state: '',
                      zipCode: undefined as unknown as number,
                    });
                  }
                  return;
                }}
              >
                <Plus />
                <span>Add New Address</span>
              </Button>
            </div>
          )}
          <Button className="w-full mt-5">
            {defaultValues ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DynamicFieldsForm;
