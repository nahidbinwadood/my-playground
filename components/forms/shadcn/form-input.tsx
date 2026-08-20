'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  tooltip?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  maxLength?: number;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel';
  control: Control<T>;
  placeholder?: string;
  inputClassName?: string;
  required?: boolean;
  disabled?: boolean;
}

function FormInput<T extends FieldValues>({
  name,
  label,
  tooltip,
  control,
  startIcon,
  endIcon,
  maxLength,
  type = 'text',
  placeholder,
  inputClassName,
  required,
  disabled = false,
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((p) => !p), []);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && !showPassword ? 'password' : 'text';

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
    >
      <div className="relative flex items-center">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {startIcon}
          </div>
        )}

        {/* Main Input */}
        <Input
          disabled={disabled}
          type={inputType}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          {...field}
          className={cn(
            'h-10',
            startIcon && 'pl-10',
            (endIcon || isPasswordType) && 'pr-10',
            error && 'border-fail focus-visible:ring-fail/40',
            inputClassName
          )}
        />

        {/* End Icon */}
        {endIcon && !isPasswordType && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {endIcon}
          </div>
        )}

        {/* Password Toggle */}
        {isPasswordType && (
          <button
            disabled={disabled}
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer disabled:pointer-events-none"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </FormFieldWrapper>
  );
}

export default FormInput;
