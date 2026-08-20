'use client';

import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId, useMemo, useRef } from 'react';
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

// Byte count in the mono file line. Kilobytes until it stops being readable.
const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

// Display name for an image that is already stored on the post.
const nameFromUrl = (url: string) => {
  const path = url.split('?')[0].split('#')[0];
  const last = path.split('/').filter(Boolean).pop() ?? 'cover-image';
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};

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
  const errorId = useId();

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

  const isNewFile = value instanceof File;
  const fileName = isNewFile
    ? value.name
    : previewUrl
    ? nameFromUrl(previewUrl)
    : '';
  const fileMeta = isNewFile ? formatBytes(value.size) : 'Already uploaded';

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      required={required}
      className={className}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) field.onChange(file);
        }}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="relative aspect-video w-full">
            <Image
              src={previewUrl}
              alt={
                fileName
                  ? `Cover image preview: ${fileName}`
                  : 'Cover image preview'
              }
              fill
              unoptimized
              sizes="(min-width: 1280px) 22rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2">
            <div className="min-w-0">
              <p
                title={fileName}
                className="truncate font-mono text-xs text-foreground"
              >
                {fileName}
              </p>
              <p className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                {fileMeta}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                aria-label="Remove cover image"
                disabled={disabled}
                onClick={clear}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted-foreground transition-colors hover:border-fail/50 hover:text-fail disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 text-center transition-colors hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-50',
            error && 'border-fail'
          )}
        >
          <ImagePlus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-foreground">
            Choose an image
          </span>
          <span className="text-xs text-muted-foreground">
            PNG or JPG, 16:9 crops best
          </span>
        </button>
      )}

      {error?.message && (
        <p id={errorId} className="text-sm font-medium text-fail">
          {error.message}
        </p>
      )}
    </FormFieldWrapper>
  );
}

export default FormImageUploader;
