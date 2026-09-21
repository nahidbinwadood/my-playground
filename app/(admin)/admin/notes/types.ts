// Slim shape for the blog picker and the timeline's blog backlinks.
// Deliberately not IBlog — shipping full post bodies to the client just to
// render a dropdown is waste.
export type TBlogOption = {
  id: string;
  title: string;
  // The blog's own category id. Optional on purpose: a blog created before the
  // taxonomy existed has none stored, and the picker must not prefill the note
  // with a value the note schema then rejects.
  category?: string;
  slug: string;
};
