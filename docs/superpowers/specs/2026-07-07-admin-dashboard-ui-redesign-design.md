# Admin Dashboard UI Redesign — Design

Date: 2026-07-07

## Goal

Make the admin dashboard modern, user-friendly, and eye-catching. Works in
both light and dark mode. No logic changes — pure visual/layout work. Code
stays simple, reusable, and well-commented so anyone can follow it.

## Decisions

- **Accent color:** Emerald / teal (via theme tokens).
- **Scope:** Full visual overhaul (theme, layout, stats, dashboard, blogs page, blog form).
- **Blog form layout:** Two-column split (main content left, settings right).
- **Blog form save bar:** Sticky action bar at top (title + Cancel/Save always visible).
- **Surface:** Unified — sidebar, header, and main content share ONE background
  color in both modes. Regions divided by thin borders only, not color shifts.
  Cards float above with `--card` elevation.

## Principles (apply to every file touched)

- **Reuse first:** extend existing `StatsCard` and `PageHeader`. No duplicate
  components. Any new shared piece (e.g. a status pill) → one small file in
  `components/common/`, reused everywhere.
- **Simple over clever:** plain JSX + Tailwind tokens. No abstraction for a
  single use. No new dependencies.
- **Comments:** each component file starts with a one-line purpose comment.
  Non-obvious blocks get a short "why" comment. Obvious code left uncommented.
- **Follow existing patterns:** naming, file structure, and token usage match
  what's already in the repo.
- **All colors via CSS tokens** so light/dark work automatically.

## Changes by file

### 1. Theme tokens — `app/globals.css`
- Set `--primary` to emerald in both `:root` and `.dark`
  (light `oklch(0.55 0.13 165)`, dark a brighter emerald so it pops on dark bg).
  Update `--primary-foreground`, `--ring` to match.
- Set `--sidebar` = `--background` and `--sidebar-border` = `--border` in both
  modes → unified surface (sidebar/header/content same color).
- Set `--chart-1..3` to a teal→emerald ramp for recharts consistency.

### 2. Sidebar — `components/layout/app-sidebar.tsx`
- **Bug fix:** active nav link uses hardcoded `bg-black text-white` → replace with
  token classes `data-[active=true]:bg-primary data-[active=true]:text-primary-foreground`
  so dark mode works.
- Logo tile "A": flat primary → emerald gradient (`bg-gradient-to-br from-emerald-500 to-teal-600`).
- Footer avatar/name/email: currently hardcoded "Admin User". Wire to real
  `user` from `useAuthContext` (name/email/initials fallback).

### 3. Header — `components/layout/admin-layout.tsx`
- Background already `--background`; ensure header + content share it (no change
  needed beyond token) and border-bottom uses `--border`.
- Keep theme toggle + profile menu. No structural change.

### 4. Stats card — `components/common/stats-card.tsx`
- Add optional `accent` prop (`'emerald' | 'blue' | 'amber' | 'violet'`,
  default emerald). Icon sits in a rounded tinted tile using that accent.
- Larger value text, subtle hover lift (`transition` + `hover:shadow`).
- Backward-compatible: existing callers work unchanged.

### 5. Status pill — `components/common/status-pill.tsx` (NEW, reusable)
- Tiny component: takes `status` ('published' | 'draft' or boolean), renders a
  colored rounded pill (green = published, amber = draft). Token/utility colors
  that work in both modes. Reused in dashboard + (optionally) table/column.

### 6. Dashboard — `app/(admin)/admin/dashboard/_components/admin-dashboard-main-wrapper.tsx`
- Stats grid: pass per-card `accent` (Total=emerald, Published=blue,
  Drafts=amber, Views=violet) for a colorful analytics feel.
- Recent/Top blog rows: index badge, hover background, `StatusPill`, view count
  with eye icon, card headers with a small icon.
- No data/logic change (same `blogs.json`, same sort/slice).

### 7. Blogs page — `app/(admin)/admin/blogs/_components/`
- `admin-blogs-main-wrapper.tsx`: header + "Add Blog" button on the same row.
- `admin-blogs-stats-container.tsx`: pass accents like the dashboard.
- `admin-blogs-table-container.tsx`: wrap `DataTable` in a `Card` for elevation.

### 8. Blog form — `app/(admin)/admin/blogs/create-blog/_components/create-blog-form.tsx`
Biggest visual change. **Logic untouched** (same `useForm`, `onSubmit`,
`createBlogAction`/`updateBlogAction`, validation). Used by both create and edit
(edit passes `blogData`). Only JSX/layout changes:
- **Sticky top action bar:** page title (`Create Blog` / `Edit Blog`) + Cancel
  and Save buttons; `sticky top-0 z-10` with background + border so it stays
  visible while scrolling the editor. Bottom button row removed.
- **Two-column grid** (`lg:grid-cols-3`, stacks on mobile):
  - Left (span 2) card "Content": Title, Excerpt, Content editor.
  - Right (span 1): "Publish" card (Status, Type) + "Media" card (Cover Image
    with a small preview thumbnail when a URL is present).
- Responsive: single column on small screens.

## Out of scope (no changes)
Server actions, zod schema, data-table core, types, routing, auth.

## Testing / verification
No unit-testable logic added (pure presentational). Verification = build passes
(`npm run build`) and manual check of both light and dark mode on dashboard,
blogs list, and create/edit blog pages. Existing form submit path unchanged.
