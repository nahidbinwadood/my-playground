import Link from 'next/link';
import { CornerDownRight } from 'lucide-react';
import { INote } from '@/types';
import { cn } from '@/lib/utils';
import { TBlogOption } from '../types';

// The journal's day boundary is the reminder's day boundary — a note logged at
// 01:00 counts for the day the 23:00 slot was nagging about. Keep in sync with
// REMINDER_TZ in the backend.
const JOURNAL_TIME_ZONE = 'Asia/Dhaka';

const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: JOURNAL_TIME_ZONE,
});

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: JOURNAL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

// group labels are derived from the plain YYYY-MM-DD key, so the weekday is
// read off the key's own midnight in UTC — not the render-time clock
const utcWeekdayFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'short',
});

// YYYY-MM-DD of an instant, in the journal's timezone
const dateKeyOf = (iso: string) => dateKeyFmt.format(new Date(iso));

const weekdayOfKey = (key: string) =>
  utcWeekdayFmt.format(new Date(`${key}T00:00:00Z`));

const shiftKey = (key: string, days: number) =>
  new Date(Date.parse(`${key}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);

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
  const todayKey = dateKeyOf(new Date().toISOString());
  const yesterdayKey = shiftKey(todayKey, -1);

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
        label: groupLabel(key, todayKey, yesterdayKey),
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
  isLastOfLastGroup,
}: {
  note: INote;
  blogById: Map<string, TBlogOption>;
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
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          {note.type}
        </span>
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
  unavailable,
}: {
  notes: INote[];
  blogById: Map<string, TBlogOption>;
  unavailable: boolean;
}) => {
  const groups = buildGroups(notes);

  return (
    <section className="mt-6 max-w-3xl" aria-label="Timeline of logged notes">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <CardHeader count={notes.length} />

        {unavailable ? (
          <div className="p-4 sm:p-5">
            <p className="label-mono text-warn">Timeline unavailable</p>
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
