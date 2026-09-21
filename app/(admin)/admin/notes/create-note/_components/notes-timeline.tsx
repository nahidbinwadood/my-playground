import Link from 'next/link';
import { CornerDownRight } from 'lucide-react';
import {
  dateKeyOf,
  JOURNAL_TIME_ZONE,
  shiftKey,
  todayKey,
  weekdayOfKey,
} from '@/lib/journal';
import { INote, ICategory } from '@/types';
import CategoryLabel from '@/components/common/category-label';
import { cn } from '@/lib/utils';
import { TBlogOption } from '../../types';

// Day keys, the week's start and the Today/Yesterday labels all come from
// lib/journal — the same helpers the dashboard's streak and calendar use, so a
// note can never sit on one day here and another day there.
const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: JOURNAL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const groupLabel = (
  key: string,
  todayKey: string,
  yesterdayKey: string
): string => {
  const date = `${weekdayOfKey(key)} ${key}`;
  if (key === todayKey) return `Today · ${date}`;
  if (key === yesterdayKey) return `Yesterday · ${date}`;
  return date;
};

type TTimelineGroup = {
  key: string;
  label: string;
  entries: INote[];
};

// Consecutive same-day entries collapse into one dated group. Notes arrive
// newest-first from the backend, so groups come out newest-first too.
const buildGroups = (notes: INote[]): TTimelineGroup[] => {
  const todayKeyValue = todayKey();
  const yesterdayKey = shiftKey(todayKeyValue, -1);

  const groups: TTimelineGroup[] = [];

  for (const note of notes) {
    if (!note.createdAt) continue;

    const key = dateKeyOf(note.createdAt);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.key === key) {
      lastGroup.entries.push(note);
    } else {
      groups.push({
        key,
        label: groupLabel(key, todayKeyValue, yesterdayKey),
        entries: [note],
      });
    }
  }

  return groups;
};

const CardHeader = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 sm:px-5">
    <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-foreground">
      Timeline
    </h2>
    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
      {count} {count === 1 ? 'entry' : 'entries'}
    </span>
  </div>
);

// A note logged against reference material names it; standalone entries stay
// anonymous. Drafts link too — they render on their public slug page.
const BlogRef = ({
  blogId,
  blogById,
}: {
  blogId: string | null;
  blogById: Map<string, TBlogOption>;
}) => {
  if (!blogId) return null;

  const blog = blogById.get(blogId);
  if (!blog) return null; // blog deleted since — quieter than a broken link

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <CornerDownRight className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{blog.title}</span>
    </Link>
  );
};

const TimelineEntry = ({
  note,
  blogById,
  categoryById,
  isLastOfLastGroup,
}: {
  note: INote;
  blogById: Map<string, TBlogOption>;
  categoryById: Map<string, ICategory>;
  isLastOfLastGroup: boolean;
}) => {
  return (
    <li
      className={cn(
        'px-4 py-4 sm:px-5',
        // every entry gets a hairline except the card's final row, whose rule
        // would double up against the card border
        !isLastOfLastGroup && 'border-b border-line'
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="min-w-0 text-sm font-semibold break-words sm:text-base">
          {note.title}
        </h4>
        {note.createdAt ? (
          <time
            dateTime={note.createdAt}
            className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
          >
            {timeFmt.format(new Date(note.createdAt))}
          </time>
        ) : null}
      </div>

      {note.description ? (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {note.description}
        </p>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <CategoryLabel category={categoryById.get(note.category)} />
        <BlogRef blogId={note.blog ?? null} blogById={blogById} />
      </div>
    </li>
  );
};

/**
 * The /admin/notes feed — the timeline of entries. Deliberately bodyless
 * (fetched with includeContent: false): it is a momentum surface, not a
 * reading surface, and it stays quiet because the form's Save button owns
 * the viewport's one accent.
 */
const NotesTimeline = ({
  notes,
  blogById,
  categoryById,
  unavailable,
}: {
  notes: INote[];
  blogById: Map<string, TBlogOption>;
  categoryById: Map<string, ICategory>;
  unavailable: boolean;
}) => {
  const groups = buildGroups(notes);

  return (
    <section className="mt-6 max-w-3xl" aria-label="Timeline of logged notes">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <CardHeader count={notes.length} />

        {unavailable ? (
          <div className="p-4 sm:p-5">
            <p className="label-mono text-warn-ink">Timeline unavailable</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The entries could not be loaded right now. Logging still works —
              save a note above and it will appear here next refresh.
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="p-4 sm:p-5">
            <p className="label-mono text-muted-foreground">No entries yet</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Log your first takeaway above. It counts toward today&apos;s
              streak the moment it saves.
            </p>
          </div>
        ) : (
          <ol>
            {groups.map((group, groupIndex) => {
              const isLastGroup = groupIndex === groups.length - 1;

              return (
                <li key={group.key}>
                  <div className="border-b border-line bg-surface px-4 py-2 sm:px-5">
                    <h3 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                      {group.label}
                      <span className="ml-2 text-foreground/60 tabular-nums">
                        {group.entries.length}
                      </span>
                    </h3>
                  </div>
                  <ol>
                    {group.entries.map((note, noteIndex) => (
                      <TimelineEntry
                        key={note.id}
                        note={note}
                        blogById={blogById}
                        categoryById={categoryById}
                        isLastOfLastGroup={isLastGroup && noteIndex === group.entries.length - 1}
                      />
                    ))}
                  </ol>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

export default NotesTimeline;
