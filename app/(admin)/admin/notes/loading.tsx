import NotesListSkeleton from './_components/notes-list-skeleton';

// Route-level fallback while the notes (with bodies) and the blog list load, so
// navigating in and refreshing in place look identical.
export default function Loading() {
  return <NotesListSkeleton />;
}
