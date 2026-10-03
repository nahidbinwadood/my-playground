import { INote, ICategory, IBlog } from '@/types';
import { getCompleteNotes } from '@/actions/note.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllBlogs } from '@/actions/blog.action';
import { Reveal } from './motion/reveal';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StudyNotesGrid } from './study-notes-grid';

/**
 * The public Study Notes section on the homepage — elevated Night Studio presentation.
 */
export async function LatestNotesSection() {
  let notes: INote[] = [];
  try {
    const response = await getCompleteNotes();
    notes = response?.data ?? [];
  } catch {
    return null;
  }

  let categories: ICategory[] = [];
  try {
    const response = await getAllCategoriesAction();
    categories = response?.data ?? [];
  } catch {
    categories = [];
  }

  let blogs: IBlog[] = [];
  try {
    const response = await getAllBlogs();
    blogs = response?.data ?? [];
  } catch {
    blogs = [];
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient rim glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(163,230,53,0.07),rgba(0,0,0,0))]"
      />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 font-mono text-[0.6875rem] font-medium text-brand-ink">
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 animate-pulse rounded-full bg-brand"
                  />
                  LIVE TAKEAWAYS ARCHIVE
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {notes.length} {notes.length === 1 ? 'insight' : 'insights'} distilled
                </span>
              </div>

              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Study notes
              </h2>
              <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Key insights, architectural patterns, and runtime findings written by hand
                while researching reference material.
              </p>
            </div>

            <Link
              href="/notes"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-surface px-4 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-brand hover:text-black sm:pb-2"
            >
              <span>Explore all {notes.length} notes</span>
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        {/* Dynamic Asymmetric Grid with Modal Reading */}
        <StudyNotesGrid
          notes={notes}
          categories={categories}
          blogs={blogs}
        />
      </div>
    </section>
  );
}
