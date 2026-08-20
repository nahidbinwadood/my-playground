import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface IFormSelectProps<T extends FieldValues> {
  label: string;
  description?: string;
  required?: boolean;
  labelClassName?: string;
  tooltip?: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  options: IFormSelectOptions[];
  placeholder?: string;
}

interface IFormSelectOptions {
  value: string;
  label: string;
}

function FormSelect<T extends FieldValues>({
  label,
  description,
  required,
  tooltip,
  labelClassName,
  name,
  control,
  disabled,
  options,
  placeholder = 'Select an option',
}: IFormSelectProps<T>) {
  // declare the controller==>
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormFieldWrapper
      label={label}
      description={description}
      labelClassName={labelClassName}
      tooltip={tooltip}
      error={error?.message}
      required={required}
    >
      <Select
        value={
          field.value !== undefined && field.value !== null
            ? String(field.value)
            : ''
        }
        onValueChange={(val) => {
          field.onChange(val);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          aria-invalid={error ? true : undefined}
          className={`w-full ${
            error ? 'border-fail focus-visible:ring-fail/40' : ''
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
}

export default FormSelect;
