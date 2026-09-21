import { ICategory, TCategoryTone } from '@/types';

// The tones the API accepts, in the order the picker offers them.
export const CATEGORY_TONES = ['iris', 'signal', 'warn'] as const;

// The category's tone is a token; this is the one place it becomes classes. Fill
// plus matching hairline, low opacity — the same badge language the blog type
// tag used before the taxonomy became data.
export const CATEGORY_TONE_CLASS: Record<TCategoryTone, string> = {
  iris: 'border-iris/35 bg-iris/10 text-iris-ink',
  signal: 'border-signal/35 bg-signal/10 text-signal-ink',
  warn: 'border-warn/40 bg-warn/10 text-warn-ink',
};

export const CATEGORY_FALLBACK_CLASS =
  'border-border bg-muted text-muted-foreground';

// Human labels for the tone picker — a tone name is not a colour name.
export const CATEGORY_TONE_LABEL: Record<TCategoryTone, string> = {
  iris: 'Indigo',
  signal: 'Green',
  warn: 'Amber',
};

// Blogs, notes and the tracker all carry a category id, never the document. One
// request for the list plus this map is cheaper than populating on every call,
// and it keeps the stored shape a plain reference.
export const categoryMapById = (categories: ICategory[]) =>
  new Map(categories.map((category) => [category.id, category]));

export const toneClassOf = (tone?: TCategoryTone) =>
  (tone && CATEGORY_TONE_CLASS[tone]) || CATEGORY_FALLBACK_CLASS;
