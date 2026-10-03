import { getCompleteNotes } from '@/actions/note.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllBlogs } from '@/actions/blog.action';
import { ICategory, INote, IBlog } from '@/types';
import AllNotesMainWrapper from './_components/all-notes-main-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Notes — Playground',
  description:
    'Handwritten takeaways and insights written while studying reference materials and building experiments.',
};

export const revalidate = 3600;

export default async function NotesPage() {
  let notes: INote[] = [];
  try {
    const res = await getCompleteNotes();
    notes = res?.data ?? [];
  } catch {
    notes = [];
  }

  let categories: ICategory[] = [];
  try {
    const catRes = await getAllCategoriesAction();
    categories = catRes?.data ?? [];
  } catch {
    categories = [];
  }

  let blogs: IBlog[] = [];
  try {
    const blogRes = await getAllBlogs();
    blogs = blogRes?.data ?? [];
  } catch {
    blogs = [];
  }

  return (
    <AllNotesMainWrapper
      notes={notes}
      categories={categories}
      blogs={blogs}
    />
  );
}
