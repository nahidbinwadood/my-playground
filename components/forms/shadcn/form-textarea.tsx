'use client';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { KeyboardEvent } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  tooltip?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /**
   * Machine-voice hint pinned to the bottom-right of the field, e.g.
   * "Ctrl + Enter to save".
   */
  hint?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

function FormTextarea<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  tooltip,
  description,
  required,
  disabled = false,
  className,
  hint,
  onKeyDown,
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      description={description}
      error={error?.message}
      required={required}
    >
      <div className="relative">
        <Textarea
          rows={undefined}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={onKeyDown}
          aria-invalid={error ? true : undefined}
          {...field}
          className={cn(
            'min-h-40 resize-y',
            hint && 'pb-8',
            error && 'border-fail focus-visible:ring-fail/40',
            className
          )}
        />

        {hint && (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute right-3 bottom-2 font-mono text-[0.6875rem] text-muted-foreground"
          >
            {hint}
          </p>
        )}
      </div>
    </FormFieldWrapper>
  );
}

export default FormTextarea;
