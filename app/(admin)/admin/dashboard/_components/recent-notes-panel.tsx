import CategoryLabel from '@/components/common/category-label';
import { IBlog, ICategory, INote } from '@/types';
import {
  EmptyRegion,
  formatDate,
  Panel,
  PanelAction,
  Unavailable,
} from './dashboard-primitives';

const RecentNotesPanel = ({
  notesUnavailable,
  noteCount,
  recentNotes,
  blogById,
  categoryById,
}: {
  notesUnavailable: boolean;
  noteCount: number;
  recentNotes: INote[];
  blogById: Map<string, IBlog>;
  categoryById: Map<string, ICategory>;
}) => (
  <Panel
    className="xl:col-span-2"
    label="Recent notes"
    meta={notesUnavailable ? undefined : `${noteCount} logged`}
    action={<PanelAction href="/admin/notes">All notes</PanelAction>}
  >
    {notesUnavailable ? (
      <Unavailable what="notes" />
    ) : recentNotes.length > 0 ? (
      <ul className="space-y-1 px-2 pb-2">
        {recentNotes.map((note) => {
          const blog = note.blog ? blogById.get(note.blog) : undefined;

          return (
            <li
              key={note.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {blog ? blog.title : 'standalone'}
                </p>
              </div>

              <CategoryLabel
                className="shrink-0"
                category={categoryById.get(note.category)}
              />

              <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
                {formatDate(note.createdAt)}
              </span>
            </li>
          );
        })}
      </ul>
    ) : (
      <EmptyRegion
        title="Nothing logged yet"
        hint="No note has been written. The first one starts the streak and fills this list."
        href="/admin/notes/create-note"
        cta="Log a note"
      />
    )}
  </Panel>
);

export default RecentNotesPanel;
