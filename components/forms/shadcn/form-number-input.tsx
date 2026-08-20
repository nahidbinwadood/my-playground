import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface IFormNumberInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  inputClassName?: string;
  maxLength?: number;
  cb?: (value: string) => void;
  integerOnly?: boolean;
  decimalPlaces?: number;
  prefixText?: string;
  className?: string;
  endIcon?: React.ReactNode;
}

function FormNumberInput<T extends FieldValues>({
  label,
  name,
  control,
  placeholder = 'Enter your number',
  tooltip,
  required = false,
  disabled = false,
  inputClassName,
  maxLength,
  cb,
  integerOnly = false,
  decimalPlaces,
  prefixText,
  endIcon,
  className,
}: IFormNumberInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState<string>('');
  const prevFieldValueRef = useRef(field.value);

  // Derive the display value
  const displayValue = isEditing
    ? localValue
    : field.value === undefined || field.value === null || field.value === ''
      ? ''
      : String(field.value);

  // Update local value when field value changes externally
  useEffect(() => {
    if (!isEditing) {
      prevFieldValueRef.current = field.value;
    }
  }, [field.value, isEditing]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (cb) cb(inputValue);

      setIsEditing(true);
      setLocalValue(inputValue);

      // Handle empty input - set to undefined
      if (inputValue === '') {
        field.onChange(undefined);
        return;
      }

      // Reject negative numbers
      if (inputValue.startsWith('-')) {
        return;
      }

      // Check regex
      let regex: RegExp;
      if (integerOnly) {
        regex = /^\d*$/;
      } else if (decimalPlaces !== undefined) {
        regex = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`);
      } else {
        regex = /^\d*\.?\d*$/;
      }

      // Validate input
      if (!regex.test(inputValue)) {
        setLocalValue(
          field.value === undefined ||
            field.value === null ||
            field.value === ''
            ? ''
            : String(field.value)
        );
        return;
      }

      // Check decimal places
      if (!integerOnly && decimalPlaces !== undefined) {
        const parts = inputValue.split('.');
        if (parts.length === 2 && parts[1].length > decimalPlaces) {
          setLocalValue(
            field.value === undefined ||
              field.value === null ||
              field.value === ''
              ? ''
              : String(field.value)
          );
          return;
        }
      }

      // Don't parse incomplete decimal inputs like "5."
      if (inputValue.endsWith('.')) {
        return;
      }

      const numValue = integerOnly
        ? parseInt(inputValue, 10)
        : parseFloat(inputValue);

      if (!isNaN(numValue)) {
        field.onChange(numValue);
      }
    },
    [field, integerOnly, decimalPlaces, cb]
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);

    // Clean up trailing dots or incomplete inputs on blur
    if (localValue.endsWith('.') || localValue.endsWith('.0')) {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        field.onChange(numValue);
      }
    }

    field.onBlur();
  }, [field, localValue]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    setLocalValue(
      field.value === undefined || field.value === null || field.value === ''
        ? ''
        : String(field.value)
    );
  }, [field.value]);

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      className={className}
    >
      <div className="w-full">
        <Input
          value={displayValue}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          maxLength={maxLength}
          placeholder={placeholder}
          className={cn(
            'w-full',
            inputClassName,
            error && 'border-fail focus-visible:ring-fail/40',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
        />

        {prefixText && localValue !== '' && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm whitespace-nowrap text-muted-foreground">
            {prefixText}
          </span>
        )}

        {endIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm whitespace-nowrap text-muted-foreground">
            {endIcon}
          </span>
        )}
      </div>
    </FormFieldWrapper>
  );
}

export default FormNumberInput;
