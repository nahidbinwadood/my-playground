import { cn } from '@/lib/utils';
import { TActivity, weekdayOfKey } from '@/lib/journal';

// Cell pitch in px. The month axis labels are sized from the same numbers, so
// they stay aligned with the columns they annotate.
const CELL_PX = 12; // size-3
const GAP_PX = 4; // gap-1
const PITCH_PX = CELL_PX + GAP_PX;

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// The fill is the ink scale rather than the iris accent: a heatmap is many
// marks, and the accent budget on this page belongs to the topic bars.
const LEVEL_CLASS = [
  'bg-muted',
  'bg-primary/25',
  'bg-primary/45',
  'bg-primary/70',
  'bg-primary',
];

// Four steps plus empty. Anything above the fourth lands on the darkest step —
// the number in the tooltip stays exact.
const levelOf = (count: number) => (count === 0 ? 0 : Math.min(count, 4));

const Cell = ({
  count,
  day,
  future,
  isToday,
}: {
  count: number;
  day: string;
  future: boolean;
  isToday: boolean;
}) => {
  // A day still to come is a blank slot, not a day off — it gets no fill.
  if (future) {
    return <div className="size-3 rounded-sm" />;
  }

  return (
    <div
      title={`${count} ${count === 1 ? 'note' : 'notes'} · ${weekdayOfKey(day)} ${day}`}
      className={cn(
        'size-3 rounded-sm',
        LEVEL_CLASS[levelOf(count)],
        isToday && 'outline-1 outline-offset-1 outline-foreground/30'
      )}
    />
  );
};

// The key to the fills. Decorative — the caption states the same facts in text.
const Legend = () => (
  <div aria-hidden="true" className="flex items-center gap-1.5">
    <span className="font-mono text-[0.625rem] text-muted-foreground">
      less
    </span>
    {LEVEL_CLASS.map((level) => (
      <span key={level} className={cn('size-3 rounded-sm', level)} />
    ))}
    <span className="font-mono text-[0.625rem] text-muted-foreground">
      more
    </span>
    <span className="ml-2 size-3 rounded-sm bg-muted outline-1 outline-offset-1 outline-foreground/30" />
    <span className="font-mono text-[0.625rem] text-muted-foreground">
      today
    </span>
  </div>
);

/**
 * The streak's other half: the streak number says where things stand, this says
 * how the last few months actually went. Cells are day counts in the journal's
 * timezone, so the columns line up with the days the reminder nags about.
 *
 * The grid itself is decorative to a screen reader — per-day titles are hover
 * only — so the caption carries the same information as text.
 */
const ActivityCalendar = ({ activity }: { activity: TActivity }) => {
  const { columns, months, loggedDays, elapsedDays } = activity;

  // the last column is the week containing today
  const today = columns[columns.length - 1].find((cell) => !cell.future);

  return (
    <div className="px-4 py-4 sm:px-5">
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex gap-2">
          {/* Weekday gutter. Every row keeps its height, labelled or not, so the
              three visible labels line up with the grid's rows. */}
          <div aria-hidden="true" className="flex flex-col gap-1 pt-4">
            {WEEKDAY_LABELS.map((day, index) => (
              <span
                key={day}
                className="h-3 font-mono text-[0.5625rem] leading-3 text-muted-foreground"
              >
                {index % 2 === 0 ? day : ''}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {/* Month axis: one label per run of columns in the same month. */}
            <div aria-hidden="true" className="flex h-3">
              {months.map((month) => (
                <span
                  key={`${month.label}-${month.span}`}
                  style={{ width: month.span * PITCH_PX - GAP_PX }}
                  className="shrink-0 font-mono text-[0.625rem] leading-3 text-muted-foreground"
                >
                  {month.label}
                </span>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="grid grid-flow-col grid-rows-7 gap-1"
            >
              {columns.flatMap((column) =>
                column.map((cell) => (
                  <Cell
                    key={cell.key}
                    count={cell.count}
                    day={cell.key}
                    future={cell.future}
                    isToday={cell.key === today?.key}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {loggedDays} of {elapsedDays} days logged · last {columns.length} weeks
          {' · '}today outlined
        </p>
        <Legend />
      </div>
    </div>
  );
};

export default ActivityCalendar;
