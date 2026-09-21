import { INote } from '@/types';

// ---------------------------------------------------------------------------
// The journal's day boundary is the reminder's day boundary: a note logged at
// 01:00 counts for the day the 23:00 slot was nagging about. Everything that
// counts days — the timeline's group labels, the streak, the activity calendar
// — has to agree with REMINDER_TZ in the backend, so it all starts here.
// ---------------------------------------------------------------------------

export const JOURNAL_TIME_ZONE = 'Asia/Dhaka';

// Weeks of history the activity calendar shows.
export const ACTIVITY_WEEKS = 16;

// "Current focus" looks at recent activity only, so a topic logged heavily
// months ago cannot keep claiming the slot.
export const FOCUS_WINDOW_DAYS = 14;

const MS_PER_DAY = 86_400_000;

const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: JOURNAL_TIME_ZONE,
});

// Weekday, month and month-year are read off a key's own UTC midnight — the
// key is a calendar label, and the zone was already applied when it was made.
const weekdayFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'short',
});

const monthFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
});

const monthYearFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  year: 'numeric',
});

// YYYY-MM-DD of an instant, in the journal's timezone
export const dateKeyOf = (value: string | Date) =>
  dateKeyFmt.format(new Date(value));

export const todayKey = () => dateKeyOf(new Date().toISOString());

// Date-key arithmetic. Keys sort and compare as strings, which is what makes
// range checks like `key >= windowStart` work without parsing.
export const shiftKey = (key: string, days: number) =>
  new Date(Date.parse(`${key}T00:00:00Z`) + days * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);

export const weekdayOfKey = (key: string) =>
  weekdayFmt.format(new Date(`${key}T00:00:00Z`));

export const monthYearOfKey = (key: string) =>
  monthYearFmt.format(new Date(`${key}T00:00:00Z`));

// Monday-first, matching the calendar's rows.
const MONDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

// ---------------------------------------------------------------------------
// Everything below derives from the note list alone. There is no counter
// stored anywhere: the tracker is a view of the notes, so it can never drift
// from them.
// ---------------------------------------------------------------------------

// day key -> notes logged that day
type TDayCounts = Map<string, number>;

const bucketByDay = (notes: INote[]): TDayCounts => {
  const counts: TDayCounts = new Map();

  for (const note of notes) {
    if (!note.createdAt) continue;

    const key = dateKeyOf(note.createdAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
};

// Consecutive logged days ending today. Today is still open — a streak only
// breaks once a whole day passes with nothing logged — so an empty today walks
// back from yesterday instead of reporting 0.
const currentStreakOf = (counts: TDayCounts, today: string) => {
  let cursor = (counts.get(today) ?? 0) > 0 ? today : shiftKey(today, -1);
  let streak = 0;

  while ((counts.get(cursor) ?? 0) > 0) {
    streak++;
    cursor = shiftKey(cursor, -1);
  }

  return streak;
};

// Longest run of consecutive logged days, ever. Walks the distinct days in
// order; a gap resets the run.
const longestStreakOf = (counts: TDayCounts) => {
  let best = 0;
  let run = 0;
  let previous = 0;

  for (const key of [...counts.keys()].sort()) {
    const day = Date.parse(`${key}T00:00:00Z`);
    run = day - previous === MS_PER_DAY ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }

  return best;
};

// The category being studied right now: the most-logged one inside the focus
// window. Ties go to whichever was logged more recently. Tallying across
// categories rather than trusting the newest note means one stray note on an
// old topic does not read as a change of focus.
//
// The result is the category *id*, not its name — the label lives in the
// category document, so a rename is picked up without touching this file.
const focusOf = (notes: INote[], today: string) => {
  const windowStart = shiftKey(today, -(FOCUS_WINDOW_DAYS - 1));
  const tally = new Map<string, { count: number; latest: string }>();

  for (const note of notes) {
    if (!note.createdAt || !note.category) continue;

    const key = dateKeyOf(note.createdAt);
    if (key < windowStart) continue;

    const entry = tally.get(note.category) ?? { count: 0, latest: key };
    tally.set(note.category, {
      count: entry.count + 1,
      latest: key > entry.latest ? key : entry.latest,
    });
  }

  let focus: string | null = null;
  let focusNotes = 0;

  for (const [category, entry] of tally) {
    const best = focus ? tally.get(focus) : undefined;

    if (
      !best ||
      entry.count > best.count ||
      (entry.count === best.count && entry.latest > best.latest)
    ) {
      focus = category;
      focusNotes = entry.count;
    }
  }

  return { focus, focusNotes };
};

export type TJournalStats = {
  totalNotes: number;
  loggedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  entriesThisMonth: number;
  monthLabel: string;
  // ICategory id — resolve to a name at the render site
  currentFocus: string | null;
  focusNotes: number;
  focusWindowDays: number;
};

export const getJournalStats = (notes: INote[]): TJournalStats => {
  const counts = bucketByDay(notes);
  const today = todayKey();
  const monthKey = today.slice(0, 7);

  const { focus, focusNotes } = focusOf(notes, today);

  return {
    totalNotes: notes.length,
    loggedToday: (counts.get(today) ?? 0) > 0,
    currentStreak: currentStreakOf(counts, today),
    longestStreak: longestStreakOf(counts),
    // the day keys are already Dhaka-local, so the month boundary is too
    entriesThisMonth: [...counts.keys()].filter((key) =>
      key.startsWith(monthKey)
    ).length,
    monthLabel: monthYearOfKey(today),
    currentFocus: focus,
    focusNotes,
    focusWindowDays: FOCUS_WINDOW_DAYS,
  };
};

export type TActivityCell = {
  key: string;
  count: number;
  future: boolean; // still to come — a blank slot, not a zero day
};

export type TActivityMonth = { label: string; span: number };

export type TActivity = {
  columns: TActivityCell[][]; // one column per week, Monday → Sunday
  months: TActivityMonth[];
  loggedDays: number;
  elapsedDays: number; // window size minus the days that have not happened yet
  maxCount: number;
};

// Consecutive columns sharing a month collapse into one axis label.
const monthSpansOf = (columns: TActivityCell[][]): TActivityMonth[] => {
  const spans: TActivityMonth[] = [];

  for (const column of columns) {
    const label = monthFmt.format(new Date(`${column[0].key}T00:00:00Z`));
    const last = spans[spans.length - 1];

    if (last && last.label === label) {
      last.span++;
    } else {
      spans.push({ label, span: 1 });
    }
  }

  return spans;
};

export const getActivity = (
  notes: INote[],
  weeks = ACTIVITY_WEEKS
): TActivity => {
  const counts = bucketByDay(notes);
  const today = todayKey();

  // Columns run Monday → Sunday, so the grid ends on the Sunday of the current
  // week rather than on today — otherwise every weekday row would shift as the
  // week progressed.
  const weekday = MONDAY_INDEX[weekdayOfKey(today)] ?? 0;
  const gridEnd = shiftKey(today, 6 - weekday);
  const gridStart = shiftKey(gridEnd, -(weeks * 7 - 1));

  const columns: TActivityCell[][] = [];
  let loggedDays = 0;
  let elapsedDays = 0;
  let maxCount = 0;

  for (let week = 0; week < weeks; week++) {
    const column: TActivityCell[] = [];

    for (let day = 0; day < 7; day++) {
      const key = shiftKey(gridStart, week * 7 + day);

      // a day that has not happened yet is not a day off
      if (key > today) {
        column.push({ key, count: 0, future: true });
        continue;
      }

      const count = counts.get(key) ?? 0;
      loggedDays += count > 0 ? 1 : 0;
      elapsedDays++;
      maxCount = Math.max(maxCount, count);

      column.push({ key, count, future: false });
    }

    columns.push(column);
  }

  return {
    columns,
    months: monthSpansOf(columns),
    loggedDays,
    elapsedDays,
    maxCount,
  };
};
