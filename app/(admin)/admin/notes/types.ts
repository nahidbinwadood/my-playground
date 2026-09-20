import { TTopic } from '@/types';

// Slim shape for the blog picker and the timeline's blog backlinks.
// Deliberately not IBlog — shipping full post bodies to the client just to
// render a dropdown is waste.
export type TBlogOption = {
  id: string;
  title: string;
  type: TTopic;
  slug: string;
};
