import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getCompleteNotes } from '@/actions/note.action';
import { CATEGORY_TONE_FILL } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { IBlog, ICategory, INote } from '@/types';

// Counted from the repo: the challenges on /form-playground that have a working form.
const CHALLENGE_COUNT = 9;

export async function HeroPanel() {
  let blogs: IBlog[] | null = null;
  let categories: ICategory[] = [];
  let notes: INote[] | null = null;

  try {
    blogs = ((await getAllBlogs()).data ?? []) as IBlog[];
  } catch {
    blogs = null;
  }

  try {
    categories = (await getAllCategoriesAction()).data ?? [];
  } catch {
    categories = [];
  }

  try {
    notes = ((await getCompleteNotes()).data ?? []) as INote[];
  } catch {
    notes = null;
  }

  const byTopic = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      count: blogs?.filter((blog) => blog.category === category.id).length ?? 0,
    }))
    .filter((topic) => topic.count > 0);
  const total = byTopic.reduce((sum, topic) => sum + topic.count, 0);

  const tiles = [
    { label: 'posts', value: blogs ? blogs.length : null },
    { label: 'notes', value: notes ? notes.length : null },
    { label: 'challenges', value: CHALLENGE_COUNT },
  ];

  return (
    <div className="rounded-[18px] bg-card p-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Reading list by topic</span>
        <span className="font-mono text-muted-foreground">
          {blogs ? `${blogs.length} published` : '—'}
        </span>
      </div>

      {total > 0 ? (
        <>
          <div
            aria-hidden="true"
            className="mt-4 flex h-3 gap-[3px] overflow-hidden rounded-full"
          >
            {byTopic.map((topic) => (
              <div
                key={topic.category.id}
                className={cn(
                  'h-full',
                  CATEGORY_TONE_FILL[topic.category.tone] ??
                    'bg-muted-foreground'
                )}
                style={{ width: `${(topic.count / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {byTopic.map((topic) => (
              <li
                key={topic.category.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-2 rounded-[2px]',
                      CATEGORY_TONE_FILL[topic.category.tone] ??
                        'bg-muted-foreground'
                    )}
                  />
                  {topic.category.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {topic.count}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {!blogs
            ? 'Could not load the reading list.'
            : blogs.length === 0
              ? 'Nothing published yet.'
              : 'Topic breakdown unavailable.'}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-[14px] bg-surface p-3.5">
            <p className="font-display text-3xl font-semibold tracking-[-0.03em] tabular-nums">
              {tile.value ?? <span aria-label="count unavailable">—</span>}
            </p>
            <p className="text-sm text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
