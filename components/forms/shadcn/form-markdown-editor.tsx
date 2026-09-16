'use client';

import { cn } from '@/lib/utils';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';
import { useCallback, useRef } from 'react';

interface FormMarkdownEditorProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  minHeight?: string;
}

const FormMarkdownEditor = <T extends FieldValues>({
  name,
  label,
  control,
  placeholder = 'Paste or write markdown here...',
  required,
  tooltip,
  minHeight = '400px',
}: FormMarkdownEditorProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          textarea.value.substring(0, start) +
          '  ' +
          textarea.value.substring(end);
        textarea.setRangeText(newText, start, end, 'end');
        field.onChange(newText);
      }
    },
    [field]
  );

  const charCount = (field.value as string)?.length ?? 0;
  const wordCount = (field.value as string)
    ?.trim()
    .split(/\s+/)
    .filter(Boolean).length ?? 0;

  return (
    <FormFieldWrapper
      label={label}
      required={required}
      tooltip={tooltip}
      error={error?.message}
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <textarea
          ref={textareaRef}
          value={(field.value as string) ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none',
            'min-h-[400px]'
          )}
          style={{ minHeight }}
          spellCheck
        />

        {/* Footer: char/word count */}
        <div className="flex items-center justify-end gap-4 border-t border-line bg-surface px-4 py-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {charCount} chars
          </span>
        </div>
      </div>
    </FormFieldWrapper>
  );
};

export default FormMarkdownEditor;
