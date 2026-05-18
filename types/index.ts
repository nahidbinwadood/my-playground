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
  status: 'DRAFT' | 'PUBLISHED';
  type: 'FRONTEND' | 'BACKEND' | 'JAVASCRIPT';
}
