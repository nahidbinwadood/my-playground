import { CATEGORY_TONE_FILL } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { TNotesByTopic } from './dashboard-data';
import { EmptyRegion, Panel, Unavailable } from './dashboard-primitives';

const TopicsPanel = ({
  notesUnavailable,
  categoriesUnavailable,
  topicsCovered,
  categoryCount,
  noteCount,
  notesByTopic,
  topicTotal,
}: {
  notesUnavailable: boolean;
  categoriesUnavailable: boolean;
  topicsCovered: number;
  categoryCount: number;
  noteCount: number;
  notesByTopic: TNotesByTopic;
  topicTotal: number;
}) => (
  <Panel
    label="Topics"
    meta={
      notesUnavailable || categoriesUnavailable
        ? undefined
        : `${topicsCovered} of ${categoryCount}`
    }
  >
    {notesUnavailable ? (
      <Unavailable what="notes" />
    ) : categoriesUnavailable ? (
      <Unavailable what="categories" />
    ) : noteCount > 0 ? (
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {/* The bar repeats the legend's numbers, so it stays decorative */}
        <div
          aria-hidden="true"
          className="flex h-3 gap-[3px] overflow-hidden rounded-full"
        >
          {notesByTopic
            .filter((row) => row.count > 0)
            .map((row) => (
              <div
                key={row.category.id}
                className={cn(
                  'h-full',
                  CATEGORY_TONE_FILL[row.category.tone] ??
                    'bg-muted-foreground'
                )}
                style={{
                  width: `${(row.count / Math.max(1, topicTotal)) * 100}%`,
                }}
              />
            ))}
        </div>
        <dl className="space-y-2.5">
          {notesByTopic.map((row) => (
            <div
              key={row.category.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <dt className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-2 rounded-[2px]',
                    CATEGORY_TONE_FILL[row.category.tone] ??
                      'bg-muted-foreground'
                  )}
                />
                {row.category.name}
              </dt>
              <dd className="font-mono text-xs tabular-nums text-muted-foreground">
                {row.count}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    ) : (
      <EmptyRegion
        title="No topics covered"
        hint="Coverage is counted from notes. Log one and its topic appears here."
        href="/admin/notes/create-note"
        cta="Log a note"
      />
    )}
  </Panel>
);

export default TopicsPanel;
