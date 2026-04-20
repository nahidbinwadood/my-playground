export interface IBlogs {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  content: string;
  viewCount: number;
  readTime: number;
  featured: boolean;
  status: string;
  metaDescription: string;
  metaKeywords: string[];
  createdAt: string;
  updatedAt: string;
}
