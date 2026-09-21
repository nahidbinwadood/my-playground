import NotesSkeleton from './_components/notes-skeleton';

// Route-level fallback while the blog list and note feed load, so navigating
// in and refreshing in place look identical.
export default function Loading() {
  return <NotesSkeleton />;
}
