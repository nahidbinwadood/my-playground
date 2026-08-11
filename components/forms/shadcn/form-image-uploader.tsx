'use client';

import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface FormImageUploaderProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Image picker with preview. Field value is a File (new upload) or a string
// URL (existing image in edit mode); empty string = no image.
function FormImageUploader<T extends FieldValues>({
  name,
  label,
  control,
  tooltip,
  required,
  disabled = false,
  className,
}: FormImageUploaderProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const inputRef = useRef<HTMLInputElement>(null);
  const value = field.value as File | string | undefined;

  const previewUrl = useMemo(
    () => (value instanceof File ? URL.createObjectURL(value) : value || ''),
    [value]
  );

  // Release the object URL of a replaced/removed File preview.
  useEffect(() => {
    if (!(value instanceof File)) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl, value]);

  const clear = () => {
    field.onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      className={className}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) field.onChange(file);
        }}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Cover preview"
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            disabled={disabled}
            onClick={clear}
            className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50',
            error && 'border-red-500'
          )}
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-xs">Click to upload an image</span>
        </button>
      )}
    </FormFieldWrapper>
  );
}

export default FormImageUploader;
