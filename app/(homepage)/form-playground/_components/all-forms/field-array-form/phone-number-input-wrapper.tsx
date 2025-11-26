import FormPhoneInput from '@/components/forms/shadcn/form-phone-input';
import { useFieldArray, useFormContext } from 'react-hook-form';

const PhoneNumberInputWrapper = ({ index }: { index: number }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `contacts.${index}.phone`,
    control,
  });

  return (
    <div>
      {fields?.map((field, idx) => (
        <div key={field?.id}>
          <FormPhoneInput
            control={control}
            name={`contacts.${index}.phone.${idx}`}
            defaultCountry="BD"
            label="Phone"
            placeholder="Enter your phone number"
            tooltip="Enter your phone number"
            required
          />
        </div>
      ))}
    </div>
  );
};

export default PhoneNumberInputWrapper;
