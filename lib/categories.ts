import { ICategory, TCategoryTone } from '@/types';

// The tones the API accepts, in the order the picker offers them.
export const CATEGORY_TONES = ['iris', 'signal', 'warn'] as const;

// Chip: tinted fill, readable ink, no border.
export const CATEGORY_TONE_CLASS: Record<TCategoryTone, string> = {
  iris: 'bg-iris/12 text-iris-ink',
  signal: 'bg-signal/12 text-signal-ink',
  warn: 'bg-warn/15 text-warn-ink',
};

export const CATEGORY_FALLBACK_CLASS = 'bg-muted text-muted-foreground';

// Solid fills for bars and legend swatches.
export const CATEGORY_TONE_FILL: Record<TCategoryTone, string> = {
  iris: 'bg-iris',
  signal: 'bg-signal',
  warn: 'bg-warn',
};

// Human labels for the tone picker — a tone name is not a colour name.
export const CATEGORY_TONE_LABEL: Record<TCategoryTone, string> = {
  iris: 'Blue',
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
