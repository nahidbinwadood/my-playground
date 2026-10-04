import CategoryLabel from '@/components/common/category-label';
import StatusPill from '@/components/common/status-pill';
import { IBlog, ICategory } from '@/types';
import Link from 'next/link';
import {
  EmptyRegion,
  formatDate,
  Panel,
  PanelAction,
  Unavailable,
} from './dashboard-primitives';

export const DraftsPanel = ({
  blogsUnavailable,
  drafts,
}: {
  blogsUnavailable: boolean;
  drafts: IBlog[];
}) => (
  <Panel label="Drafts" meta={blogsUnavailable ? undefined : `${drafts.length}`}>
    {blogsUnavailable ? (
      <Unavailable what="posts" />
    ) : drafts.length > 0 ? (
      <ul className="space-y-1 px-2 pb-2">
        {drafts.map((blog) => (
          <li
            key={blog.id}
            className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/blogs/edit-blog/${blog.slug}`}
                className="block truncate text-sm font-medium"
              >
                {blog.title}
              </Link>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                {formatDate(blog.updatedAt)}
              </p>
            </div>
            <StatusPill status={blog.isPublished} className="shrink-0" />
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRegion
        title="Nothing in draft"
        hint="Every post is published. Saving one without publishing it queues it here."
      />
    )}
  </Panel>
);

export const RecentPostsPanel = ({
  blogsUnavailable,
  publishedCount,
  draftCount,
  recentBlogs,
  categoryById,
}: {
  blogsUnavailable: boolean;
  publishedCount: number;
  draftCount: number;
  recentBlogs: IBlog[];
  categoryById: Map<string, ICategory>;
}) => (
  <Panel
    className="xl:col-span-2"
    label="Recent posts"
    meta={
      blogsUnavailable
        ? undefined
        : `${publishedCount} published · ${draftCount} drafts`
    }
    action={<PanelAction href="/admin/blogs">All posts</PanelAction>}
  >
    {blogsUnavailable ? (
      <Unavailable what="posts" />
    ) : recentBlogs.length > 0 ? (
      <ul className="space-y-1 px-2 pb-2">
        {recentBlogs.map((blog) => (
          <li
            key={blog.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-muted/60 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/blogs/edit-blog/${blog.slug}`}
                className="block truncate text-sm font-medium"
              >
                {blog.title}
              </Link>
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                /blogs/{blog.slug}
              </p>
            </div>

            <CategoryLabel
              className="shrink-0"
              category={categoryById.get(blog.category)}
            />

            <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
              {formatDate(blog.updatedAt)}
            </span>

            <StatusPill status={blog.isPublished} className="shrink-0" />
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRegion
        title="No posts yet"
        hint="Nothing has been created. Write the first post and it lands here."
        href="/admin/blogs/create-blog"
        cta="Write a post"
      />
    )}
  </Panel>
);
