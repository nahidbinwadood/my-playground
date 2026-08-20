'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

const ThemeToggler = () => {
  const { resolvedTheme, setTheme } = useTheme();

  // The name stays static: the resolved theme is unknown on the server, so a
  // state-dependent label would mismatch on hydration. The icons swap via the
  // `dark` class, which next-themes sets before paint.
  const label = 'Toggle theme';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
      }}
      className="relative rounded-md border border-line text-muted-foreground hover:text-foreground"
    >
      <Sun
        aria-hidden="true"
        className="size-4 rotate-0 scale-100 transition-transform duration-300 ease-out dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-4 rotate-90 scale-0 transition-transform duration-300 ease-out dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
};

export default ThemeToggler;
