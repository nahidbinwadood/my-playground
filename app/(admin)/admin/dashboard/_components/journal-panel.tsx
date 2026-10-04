import CategoryLabel from '@/components/common/category-label';
import { getActivity, getJournalStats } from '@/lib/journal';
import { ICategory } from '@/types';
import ActivityCalendar from './activity-calendar';
import {
  EmptyRegion,
  LedgerRow,
  Meta,
  Unavailable,
  unknown,
} from './dashboard-primitives';

// The journal, as one object: the streak is the same fact the calendar
// draws at day resolution, so they share a panel instead of sitting in
// two boxes that repeat each other. This is the page's lime moment.
const JournalPanel = ({
  journal,
  activity,
  notesUnavailable,
  categoriesUnavailable,
  topicsCovered,
  categoryCount,
  focusCategory,
  completedCount,
  draftCount,
}: {
  journal: ReturnType<typeof getJournalStats>;
  activity: ReturnType<typeof getActivity>;
  notesUnavailable: boolean;
  categoriesUnavailable: boolean;
  topicsCovered: number;
  categoryCount: number;
  focusCategory: ICategory | undefined;
  completedCount: number;
  draftCount: number;
}) => (
  <section className="grid overflow-hidden rounded-[18px] border border-border bg-surface xl:grid-cols-[19rem_minmax(0,1fr)]">
    <div className="flex flex-col border-b border-line xl:border-b-0 xl:border-r">
      <div className="bg-brand px-5 py-6 text-primary-foreground">
        <p className="text-sm font-medium text-primary-foreground/75">
          Current streak
        </p>
        <p className="mt-1 font-display text-[3.25rem] leading-none font-semibold tracking-[-0.035em] tabular-nums">
          {notesUnavailable ? unknown : `${journal.currentStreak}d`}
        </p>
        <p className="mt-2.5 font-mono text-xs text-primary-foreground/75">
          {notesUnavailable
            ? 'notes unavailable'
            : `longest ${journal.longestStreak}d · ${
                journal.loggedToday ? 'logged today' : 'nothing logged yet'
              }`}
        </p>
      </div>

      <dl className="divide-y divide-line">
        <LedgerRow
          label="Entries this month"
          value={notesUnavailable ? unknown : journal.entriesThisMonth}
          note={notesUnavailable ? undefined : journal.monthLabel}
        />
        <LedgerRow
          label="Topics touched"
          value={
            notesUnavailable || categoriesUnavailable
              ? unknown
              : `${topicsCovered}/${categoryCount}`
          }
        />
        <LedgerRow
          label="Current focus"
          value={
            focusCategory ? (
              <CategoryLabel category={focusCategory} />
            ) : (
              unknown
            )
          }
          note={
            focusCategory
              ? `${journal.focusNotes} ${journal.focusNotes === 1 ? 'note' : 'notes'} · ${journal.focusWindowDays}d`
              : undefined
          }
        />
        <LedgerRow
          label="Notes logged"
          value={notesUnavailable ? unknown : journal.totalNotes}
          note={
            notesUnavailable
              ? undefined
              : `${completedCount} completed · ${draftCount} draft`
          }
        />
      </dl>
    </div>

    <div className="flex min-w-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold tracking-tight">Activity</h2>
        {notesUnavailable ? null : (
          <Meta>
            {activity.loggedDays} of {activity.elapsedDays} days
          </Meta>
        )}
      </header>

      <div className="flex-1">
        {notesUnavailable ? (
          <Unavailable what="notes" />
        ) : journal.totalNotes > 0 ? (
          <ActivityCalendar activity={activity} />
        ) : (
          <EmptyRegion
            title="No activity yet"
            hint="The calendar fills a day at a time. A logged note lights up today."
            href="/admin/notes/create-note"
            cta="Log a note"
          />
        )}
      </div>
    </div>
  </section>
);

export default JournalPanel;
