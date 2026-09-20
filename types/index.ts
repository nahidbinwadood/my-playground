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

// Mirrors the backend's BlogTypes enum. Notes reuse the same three values and the
// tracker's topic-coverage map reads them, so this stays a single source of truth.
export type TTopic = 'FRONTEND' | 'BACKEND' | 'JAVASCRIPT';

// Mirrors the backend's BlogStatus enum.
export type TBlogStatus = 'DRAFT' | 'PUBLISHED';

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
  type: TTopic;
}

// A personal takeaway written by hand. Attached to a blog of reference material,
// or standalone. Many notes can belong to one blog.
export interface INote {
  id: string;
  blog: string | null;
  title: string;
  description?: string;
  content: string;
  type: TTopic;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the quick-note form submits.
export interface INoteInput {
  title: string;
  content: string;
  type: TTopic;
  description?: string;
  blog?: string | null;
}
