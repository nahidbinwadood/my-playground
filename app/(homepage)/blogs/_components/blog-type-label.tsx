// Mono uppercase type tag, shared by the blog cards and the details page.
// Three fixed tints so the taxonomy is learnable by sight: iris = frontend,
// signal = backend, warn = javascript. Low-opacity fill + matching hairline.
const typeStyles: Record<string, string> = {
  FRONTEND: 'border-iris/35 bg-iris/10 text-iris',
  BACKEND: 'border-signal/35 bg-signal/10 text-signal',
  JAVASCRIPT: 'border-warn/40 bg-warn/10 text-warn',
};

const BlogTypeLabel = ({ type }: { type?: string }) => {
  if (!type) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase leading-5 tracking-[0.16em] ${
        typeStyles[type] ?? 'border-border bg-muted text-muted-foreground'
      }`}
    >
      {type}
    </span>
  );
};

export default BlogTypeLabel;
