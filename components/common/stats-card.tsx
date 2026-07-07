import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

// Accent colors for the icon tile. Each entry is a Tailwind bg + text pair
// that works in both light and dark mode. Add more here if needed.
const accents = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
} as const;

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  accent?: keyof typeof accents; // color of the icon tile, default emerald
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  accent = 'emerald',
  className,
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        'transition-shadow hover:shadow-md',
        className
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {/* Tinted icon tile in the card's accent color */}
        {icon && (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              accents[accent]
            )}
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
