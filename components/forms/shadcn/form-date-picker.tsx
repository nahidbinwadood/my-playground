import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface IFormDatePickerProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  dateFormat?: string;
  cb?: (value: string | Date) => void;
  fromYear?: number;
  toYear?: number;
  disableDateFn?: (date: Date) => boolean;
  className?: string;
}
function FormDatePicker<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
  required,
  tooltip,
  disabled = false,
  dateFormat = 'PPP',
  cb,
  fromYear = 2025,
  toYear = 2030,
  disableDateFn,
  className,
}: IFormDatePickerProps<T>) {
  // declare the open/close state of the popover===>
  const [open, setOpen] = useState<boolean>(false);

  // declare the form controller==>
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormFieldWrapper
      label={label}
      error={error?.message}
      required={required}
      tooltip={tooltip}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full rounded-md h-10 focus:bg-white   bg-white',
              className
            )}
            disabled={disabled}
          >
            {field.value ? (
              format(field.value, dateFormat)
            ) : (
              <span className="text-[#888]">{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          // side="bottom"
          sideOffset={5}
          // avoidCollisions={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              // Update the field value
              field.onChange(selectedDate);

              // Mark field as touched to trigger validation
              field.onBlur();

              // Close the popover after selection
              setOpen(false);

              // Call callback if provided
              if (cb) {
                cb(selectedDate);
              }
            }}
            disabled={disableDateFn}
            defaultMonth={field.value || new Date()}
            startMonth={new Date(fromYear, 0)}
            endMonth={toYear ? new Date(toYear, 0) : undefined}
            autoFocus
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  );
}

export default FormDatePicker;
