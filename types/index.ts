export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

// Design-system tokens a category can carry. The API stores the token, not a
// colour, so a new category can pick a tone without a code change.
export type TCategoryTone = 'iris' | 'signal' | 'warn';

// The topic axis is a document now, not an enum: blogs and notes reference it by
// id, and the name/tone can change without touching anything that uses it.
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  tone: TCategoryTone;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Mirrors the backend's BlogStatus enum.
export type TBlogStatus = 'DRAFT' | 'PUBLISHED';

// The note lifecycle, mirroring the backend's TNoteStatus. DRAFT is a private
// work-in-progress; COMPLETE is the only state the signed-out homepage reads.
export type TNoteStatus = 'DRAFT' | 'COMPLETE';

export interface IBlog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  status: TBlogStatus;
  category: string; // ICategory id
}

// A personal takeaway written by hand. Attached to a blog of reference material,
// or standalone. Many notes can belong to one blog.
export interface INote {
  id: string;
  blog: string | null;
  title: string;
  description?: string;
  content: string;
  category: string; // ICategory id — the note's own topic, not the blog's
  status: TNoteStatus; // 'DRAFT' | 'COMPLETE' — COMPLETE is what goes public
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the quick-note form submits.
export interface INoteInput {
  title: string;
  content: string;
  category: string; // ICategory id
  description?: string;
  blog?: string | null;
  // optional — the quick-note form does not ask, and the backend defaults a
  // new note to 'DRAFT'. Sent only by the edit dialog.
  status?: TNoteStatus;
}
