import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { endOfDay, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';

interface IFormDateRangePickerProps {
  label: string;
  disabled?: boolean;
  startName?: string;
  endName?: string;
  required?: boolean;
  placeholder?: string;
  disableDateFn?: (date: Date) => boolean;
  numberOfMonths?: number;
  tooltip?: string;
}
function FormDateRangePicker({
  label,
  placeholder = 'Select your date',
  required = false,
  disabled,
  startName = 'startDate',
  endName = 'endDate',
  disableDateFn,
  numberOfMonths = 1,
  tooltip,
}: IFormDateRangePickerProps) {
  // getting the form control from the context==>
  const { control, setValue } = useFormContext();

  // start date field==>
  const {
    field: startDateField,
    fieldState: { error: startDateError },
  } = useController({ name: startName, control });

  //end date field==>
  const {
    field: endDateField,
    fieldState: { error: endDateError },
  } = useController({ name: endName, control });

  //selected date range==>
  const selectedDateRange =
    !!startDateField?.value && !!endDateField?.value
      ? {
          from: new Date(startDateField?.value),
          to: new Date(endDateField?.value),
        }
      : undefined;

  //  <<== main components==>>
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      tooltip={tooltip}
      error={startDateError?.message || endDateError?.message}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-transparent"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>
              {/*=== show the date or the placeholder=== */}
              {!!startDateField?.value && !!endDateField?.value
                ? `${format(startDateField?.value, 'dd MMM yyyy')} - ${format(
                    endDateField?.value,
                    'dd MMM yyyy'
                  )}`
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={numberOfMonths}
            selected={selectedDateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                const start = startOfDay(range?.from);
                const end = endOfDay(range?.to);

                setValue(startName, start, {
                  shouldValidate: true,
                });
                setValue(endName, end, { shouldValidate: true });
              } else {
                setValue(startName, undefined, { shouldValidate: true });
                setValue(endName, undefined, { shouldValidate: true });
              }
            }}
            disabled={disableDateFn}
          />
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  );
}

export default FormDateRangePicker;
