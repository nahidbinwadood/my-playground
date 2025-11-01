import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import type { FormFieldWrapperProps } from './types';

export function FormFieldWrapper({
  label,
  description,
  required,
  error,
  children,
  className,
  tooltip,
  customIcon,
  labelClassName,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-2 relative', className)}>
      <Label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-destructive -ml-1.5">*</span>}

        {/* Tooltip (now safely wrapped) */}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center">
                  <CircleAlert className="-ml-1 h-3.5 w-3.5 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {customIcon && customIcon}
      </Label>

      {children}

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      {description && (
        <p
          className={cn(
            'text-sm text-muted-foreground leading-relaxed',
            error ? 'pt-0' : 'pt-4'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
