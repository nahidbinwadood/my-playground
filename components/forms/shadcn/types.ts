import { ReactNode } from 'react';

export interface FormFieldWrapperProps {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  customIcon?: ReactNode;
  labelClassName?: string;
}
