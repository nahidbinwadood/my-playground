import { PhoneInput } from '@/components/ui/phone-input';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import * as RPNInput from 'react-phone-number-input';
import { FormFieldWrapper } from './form-field-wrapper';

interface IFormPhoneInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  defaultCountry?: RPNInput.Country;
}

function FormPhoneInput<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  required = false,
  tooltip,
  defaultCountry,
}: IFormPhoneInputProps<T>) {
  // field controller==>
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      tooltip={tooltip}
      error={error?.message}
    >
      <PhoneInput
        {...field}
        maxLength={16}
        placeholder={placeholder}
        defaultCountry={defaultCountry}
        // error={error?.message}
        international
      />
    </FormFieldWrapper>
  );
}

export default FormPhoneInput;
