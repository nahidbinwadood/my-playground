import { DraftsPanel, RecentPostsPanel } from './blog-panels';
import { deriveDashboardStats, loadDashboardSources } from './dashboard-data';
import DashboardHeader from './dashboard-header';
import JournalPanel from './journal-panel';
import RecentNotesPanel from './recent-notes-panel';
import TopicsPanel from './topics-panel';

const AdminDashboardMainWrapper = async () => {
  const sources = await loadDashboardSources();
  const { categories, notes, notesUnavailable, categoriesUnavailable } =
    sources;
  const { blogsUnavailable } = sources;
  const stats = deriveDashboardStats(sources, new Date());

  return (
    <div className="space-y-4">
      <DashboardHeader
        reminder={stats.reminder}
        notesUnavailable={notesUnavailable}
      />

      <JournalPanel
        journal={stats.journal}
        activity={stats.activity}
        notesUnavailable={notesUnavailable}
        categoriesUnavailable={categoriesUnavailable}
        topicsCovered={stats.topicsCovered}
        categoryCount={categories.length}
        focusCategory={stats.focusCategory}
        completedCount={stats.completedCount}
        draftCount={stats.draftCount}
      />

      {/* Below the journal the page is a ledger: the narrow column carries the
          counted views, the wide one the entries themselves, and the two rows
          keep the same column split so the eye tracks straight down. */}
      <div className="grid gap-4 xl:grid-cols-3">
        <TopicsPanel
          notesUnavailable={notesUnavailable}
          categoriesUnavailable={categoriesUnavailable}
          topicsCovered={stats.topicsCovered}
          categoryCount={categories.length}
          noteCount={notes.length}
          notesByTopic={stats.notesByTopic}
          topicTotal={stats.topicTotal}
        />

        <RecentNotesPanel
          notesUnavailable={notesUnavailable}
          noteCount={notes.length}
          recentNotes={stats.recentNotes}
          blogById={stats.blogById}
          categoryById={stats.categoryById}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DraftsPanel blogsUnavailable={blogsUnavailable} drafts={stats.drafts} />

        <RecentPostsPanel
          blogsUnavailable={blogsUnavailable}
          publishedCount={stats.published.length}
          draftCount={stats.drafts.length}
          recentBlogs={stats.recentBlogs}
          categoryById={stats.categoryById}
        />
      </div>
    </div>
  );
};

export default AdminDashboardMainWrapper;
