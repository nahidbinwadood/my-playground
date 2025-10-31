import { cn } from '@/lib/utils';

const PageHeader = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
