// Mono uppercase type tag, shared by cards + details page (dark-safe).
const typeColors: Record<string, string> = {
  FRONTEND: 'text-blue-600 dark:text-blue-400',
  BACKEND: 'text-violet-600 dark:text-violet-400',
  JAVASCRIPT: 'text-amber-600 dark:text-amber-400',
};

const BlogTypeLabel = ({ type }: { type?: string }) => {
  if (!type) return null;
  return (
    <span
      className={`font-mono text-xs uppercase tracking-widest ${
        typeColors[type] ?? 'text-muted-foreground'
      }`}
    >
      {type.toLowerCase()}
    </span>
  );
};

export default BlogTypeLabel;
