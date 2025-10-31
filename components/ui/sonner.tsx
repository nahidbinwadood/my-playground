'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'hsl(var(--background))',
          '--normal-text': 'hsl(var(--foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(142 76% 36%)',
          '--success-text': 'hsl(355 7% 97%)',
          '--error-bg': 'hsl(0 84% 60%)',
          '--error-text': 'hsl(0 0% 98%)',
          '--warning-bg': 'hsl(38 92% 50%)',
          '--warning-text': 'hsl(26 83% 14%)',
          '--info-bg': 'hsl(221 83% 53%)',
          '--info-text': 'hsl(0 0% 98%)',
        } as React.CSSProperties
      }
      position="top-center"
      expand={false}
      richColors={true}
      closeButton={false}
      duration={5000}
      {...props}
    />
  );
};

export { Toaster };
