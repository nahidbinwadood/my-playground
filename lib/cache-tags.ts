// Every cache tag the app reads and writes, in one place.
//
// Reads opt into Next's data cache with `cache: 'force-cache'` and carry one of
// these tags. Writes expire the tag they touched. A tag is the only thing that
// brings fresh data back, so both sides must spell it the same way — hence this
// file rather than string literals in each action.
//
// Writes use `updateTag`, not `revalidateTag(tag, 'max')`: the second argument
// buys stale-while-revalidate, which is right for content with other readers but
// wrong here. The owner is the only reader of the admin surfaces, and after
// saving they must see their own change on the very next request.
export const CACHE_TAGS = {
  blogs: 'blogs',
  categories: 'categories',
  notes: 'notes',
} as const;

export type TCacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
