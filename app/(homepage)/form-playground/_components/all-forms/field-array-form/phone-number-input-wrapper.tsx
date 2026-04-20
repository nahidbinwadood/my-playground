import FormPhoneInput from '@/components/forms/shadcn/form-phone-input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const PhoneNumberInputWrapper = ({ index }: { index: number }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `contacts.${index}.phone`,
    control,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: '' });
    }
  }, [append, fields.length]);

  return (
    <div>
      {/* Phone inputs== */}
      <div className="space-y-4">
        {fields?.map((field, idx) => (
          <div key={field?.id} className="w-full flex items-center gap-2">
            <div className="flex-1">
              <FormPhoneInput
                control={control}
                name={`contacts.${index}.phone.${idx}.value`}
                defaultCountry="BD"
                label="Phone"
                placeholder="Enter your phone number"
                tooltip="Enter your phone number"
                required
              />
            </div>

            <Button
              type="button"
              onClick={() => {
                remove(idx);
              }}
              disabled={fields.length == 1}
              className="mt-5 p-2 w-fit disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Trash size={18} />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4 w-full flex justify-end pb-4">
        <Button
          className="disabled:opacity-50"
          disabled={fields?.length >= 5}
          type="button"
          onClick={() => {
            append({ value: '' });
          }}
        >
          <Plus /> Add Phone
        </Button>
      </div>
    </div>
  );
};

export default PhoneNumberInputWrapper;
