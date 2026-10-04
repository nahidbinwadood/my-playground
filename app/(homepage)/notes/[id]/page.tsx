import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getCompleteNotes } from '@/actions/note.action';
import CategoryLabel from '@/components/common/category-label';
import { formatNoteDate } from '@/lib/journal';
import { cleanMarkdownSnippet, readingMinutes } from '@/lib/utils';
import { ArrowLeft, CornerDownRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import '../../blogs/[slug]/markdown-content.css';

export const revalidate = 3600;
export const dynamicParams = true;

type TParams = { params: Promise<{ id: string }> };

// ponytail: reads the cached public list and picks one — no single-note public
// endpoint needed. Add GET /notes/complete/:id if the list gets large.
const findNote = async (id: string) => {
  try {
    const notes = (await getCompleteNotes())?.data ?? [];
    return notes.find((note) => note.id === id);
  } catch {
    return undefined;
  }
};

export async function generateStaticParams() {
  try {
    const notes = (await getCompleteNotes())?.data ?? [];
    return notes.map((note) => ({ id: note.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: TParams): Promise<Metadata> {
  const note = await findNote((await params).id);

  if (!note) {
    return { title: 'Note not found — DevPlayground' };
  }

  const description =
    note.description || cleanMarkdownSnippet(note.content, 160);

  return {
    title: `${note.title} — Study Notes`,
    description,
    alternates: { canonical: `/notes/${note.id}` },
    openGraph: { type: 'article', title: note.title, description },
  };
}

const NoteDetailsPage = async ({ params }: TParams) => {
  const note = await findNote((await params).id);

  if (!note) {
    notFound();
  }

  const [categories, blogs] = await Promise.all([
    getAllCategoriesAction()
      .then((res) => res?.data ?? [])
      .catch(() => []),
    note.blog
      ? getAllBlogs()
          .then((res) => res?.data ?? [])
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  const category = categories.find((item) => item.id === note.category);
  const blog = blogs.find((item) => item.id === note.blog);

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link
        href="/notes"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All notes
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs tabular-nums text-muted-foreground">
        <CategoryLabel category={category} />
        <span>{formatNoteDate(note.createdAt)}</span>
        <span>{readingMinutes(note.content, 180)} min read</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight break-words sm:text-4xl">
        {note.title}
      </h1>

      {note.description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {note.description}
        </p>
      ) : null}

      <div className="markdown-content mt-10 max-w-[68ch] break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {note.content}
        </ReactMarkdown>
      </div>

      {blog ? (
        <Link
          href={`/blogs/${blog.slug}`}
          className="mt-12 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-muted"
        >
          <span className="min-w-0">
            <span className="label-mono">Parent study reference</span>
            <span className="block truncate text-sm font-medium">
              {blog.title}
            </span>
          </span>
          <CornerDownRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      ) : null}
    </article>
  );
};

export default NoteDetailsPage;
