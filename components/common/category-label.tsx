import { CATEGORY_FALLBACK_CLASS, toneClassOf } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { ICategory } from '@/types';

/**
 * The topic tag, shared by the public blog cards, the admin tables, the note
 * timeline and the tracker. It renders the category's *name* with its stored
 * tone — the badge shows data, so renaming a category in the admin renames it
 * everywhere, and no component needs to know the taxonomy.
 */
const CategoryLabel = ({
  category,
  className,
  size = 'sm',
}: {
  category?: ICategory | null;
  className?: string;
  size?: 'sm' | 'md';
}) => {
  if (!category) return null;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border font-mono font-medium uppercase',
        size === 'sm'
          ? 'px-2 py-0.5 text-[0.625rem] leading-5 tracking-[0.16em]'
          : 'px-2 py-0.5 text-[0.6875rem] tracking-[0.12em]',
        toneClassOf(category.tone) || CATEGORY_FALLBACK_CLASS,
        className
      )}
    >
      {category.name}
    </span>
  );
};

export default CategoryLabel;
