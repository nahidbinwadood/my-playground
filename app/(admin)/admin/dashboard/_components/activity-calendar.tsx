import { cn } from '@/lib/utils';
import { TActivity, weekdayOfKey } from '@/lib/journal';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// The lime ramp is a token set (--heat-0..4) so light mode gets an olive ramp
// that still reads on white.
const LEVEL_CLASS = [
  'bg-heat-0',
  'bg-heat-1',
  'bg-heat-2',
  'bg-heat-3',
  'bg-heat-4',
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
    return <div className="aspect-square w-full rounded-[3px]" />;
  }

  return (
    <div
      title={`${count} ${count === 1 ? 'note' : 'notes'} · ${weekdayOfKey(day)} ${day}`}
      className={cn(
        'aspect-square w-full rounded-[3px] transition-all duration-150 hover:scale-125 hover:z-10',
        LEVEL_CLASS[levelOf(count)],
        isToday && 'outline-1 outline-offset-1 outline-foreground/40 ring-1 ring-brand'
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
      <span key={level} className={cn('size-3 sm:size-3.5 rounded-[3px]', level)} />
    ))}
    <span className="font-mono text-[0.625rem] text-muted-foreground">
      more
    </span>
    <span className="ml-2 size-3 sm:size-3.5 rounded-[3px] bg-heat-0 outline-1 outline-offset-1 outline-foreground/30 ring-1 ring-brand" />
    <span className="font-mono text-[0.625rem] text-muted-foreground">
      today
    </span>
  </div>
);

/**
 * Well-proportioned compact activity calendar.
 * Columns stretch comfortably across the container with larger cells that fill the space.
 */
const ActivityCalendar = ({ activity }: { activity: TActivity }) => {
  const { columns, months } = activity;

  // The last column is the week containing today
  const today = columns[columns.length - 1]?.find((cell) => !cell.future);

  return (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      <div className="w-full min-w-0 overflow-x-auto hide-scrollbar my-auto p-1.5 sm:p-2">
        <div className="flex w-full min-w-[480px] gap-2.5 sm:gap-3">
          {/* Weekday gutter */}
          <div
            aria-hidden="true"
            className="flex flex-col justify-between pt-4 pb-0.5 shrink-0 w-6"
          >
            {WEEKDAY_LABELS.map((day, index) => (
              <span
                key={day}
                className="font-mono text-[0.625rem] leading-none text-muted-foreground"
              >
                {index % 2 === 0 ? day : ''}
              </span>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-2 min-w-0">
            {/* Month axis: each month spans (month.span / totalColumns * 100%) */}
            <div aria-hidden="true" className="flex h-3.5 w-full">
              {months.map((month) => (
                <span
                  key={`${month.label}-${month.span}`}
                  style={{ width: `${(month.span / columns.length) * 100}%` }}
                  className="shrink-0 font-mono text-[0.6875rem] font-medium leading-none text-muted-foreground truncate"
                >
                  {month.label}
                </span>
              ))}
            </div>

            {/* 7-row calendar grid stretching full width with well-proportioned squares */}
            <div
              aria-hidden="true"
              className="grid w-full grid-flow-col grid-rows-7 gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              }}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line/30 pt-3">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          last {columns.length} weeks · today outlined
        </p>
        <Legend />
      </div>
    </div>
  );
};

export default ActivityCalendar;
