# CLAUDE.md

Context map for AI agents. Read this first — skip re-scanning the tree.

## What this is

Personal **Next.js 16 (App Router) + React 19 + TS + Tailwind v4** playground.
Three domains: UI component showcase, form-validation challenges, blog CMS
(public read + admin CRUD). shadcn/ui + Radix primitives, `motion` for animation.

## Project direction (agreed)

This is becoming a **learning journal**, not a portfolio. The owner's portfolio lives
elsewhere — do not add contact forms, résumé pages, or client-facing marketing copy.

- `blogs/` holds **reference material being studied**, not posts the owner authored.
- The **notes** domain holds the owner's handwritten takeaways, attached to a blog or
standing alone. Many notes per blog; each is a dated entry. **COMPLETE** notes are
**public**: `/notes` lists them with full content (reader dialog, search, copy).
DRAFT notes stay admin-only.
- Progress views — timeline, stats, topic coverage, streak — live **under `/admin`**,
and all derive from the same note data. No extra storage.
- If no note is created or edited on a given day, a Telegram reminder fires at
18:00 / 22:00 / 23:00 Asia/Dhaka. Later slots skip if a note was logged.

**Current status:** the notes domain is built on both ends — the `/admin/notes`
quick-note form plus timeline feed on the frontend, the `note/` and
`reminders/` modules on the backend — and the notes loop has now been verified
against the live DB end to end (2026-09-21: create, list, patch, delete, reminder
check). The reminder is configured and proven on the deployed host (`sent: true`
for slot 23 on 2026-09-21, then `already_sent`) — the only missing piece is the
owner's cron-job.org job, which is why no scheduled message had ever arrived. Phase 4 is done on the frontend: the dashboard is
the tracker — activity calendar, streak, entries this month, current focus, topic
coverage — and every figure is derived from the note list at request time, so
`blogs.json` is gone. `/admin/notes` is the notes index (table + view/edit/delete
dialogs) and `/admin/notes/create-note` is the logging page. Blogs, the component
showcase and form-playground are live. The topic axis is **data now**: a
`category/` module on the backend (`GET /categories` is public, writes are
guarded) with `/admin/categories` CRUD on the frontend, and blogs/notes store a
category **id** instead of the old `type` enum — three categories seeded
(Frontend / Backend / Javascript).

### Owner decisions — do not relitigate

- **Notes are public** (decided 2026-10-04). `/notes` reads the unauthenticated
`GET /notes/complete`, which returns only `status: 'COMPLETE'` notes; that filter is
the privacy boundary. Drafts, writes and every other note route stay admin-only.
`isPublished` on notes is unused; `status` is the switch.
- **The tracker replaces the admin dashboard.** The dashboard no longer reads the seed
JSON (`blogs.json`, `viewCount`, lowercase `'draft'`) — that data was fake. Every figure
is now counted from the API, and unknown is rendered as unknown, never as `0`.
- **No `/lab`.** The component showcase and form-playground stay public at their
current root routes (`/components`, `/form-playground`); do not relocate them.
- Build order: fix existing bugs → note API → quick-note UI → reminder → tracker
visuals. The logging loop ships before any chart.

## Constraints

- **The owner deploys. Agents must not deploy, push, or configure hosting.** Never run
a deploy, `git push`, or hosting/DNS setup here — the owner does all of it.
- **Free tier only — no paid services.** Rules out Vercel Pro crons and paid messaging
APIs.
- **Vercel Hobby crons run once per day and fail at deploy if scheduled more often.** A
3×/day schedule needs an external scheduler (cron-job.org), not Vercel.

## Commands (pnpm)

- `pnpm dev` — dev server
- `pnpm build` / `pnpm start`
- `pnpm lint` — eslint (includes a rule: no `DialogContent` outside `components/modal/**`,
  `components/ui/**` and the showcase demos)
- `pnpm check:journal`, `pnpm check:auth` — assert scripts for the day/streak and
  token-expiry logic
- `npx next typegen` before `npx tsc --noEmit` on a fresh clone (route types)
- CI (`.github/workflows/ci.yml`): typegen → tsc → lint → both checks, on every push/PR.
  No build step — `next build` would fetch the live backend.
- `pnpm build` fails on **Windows only** while the legacy blog slug containing `:`
  exists (illegal filename); Vercel/Linux is fine. Re-saving that post fixes it.

Env: validated once in `lib/env.ts` (Zod) — `NEXT_PUBLIC_SERVER_URL` (required),
`NEXT_PUBLIC_SITE_URL` (optional). Import `env` from there; never read
`process.env.NEXT_PUBLIC_*` elsewhere. No local DB.

## Architecture

- **Backend is external** (REST at `NEXT_PUBLIC_SERVER_URL`). App talks to it via
  server actions in `actions/`. No API routes here.
- **Auth**: cookie-based JWT. `loginAction` takes the token pair from the login
  response body and sets httpOnly `accessToken`/`refreshToken` cookies whose
  `maxAge` follows each JWT's own `exp` (`lib/auth-cookies.ts`); tokens are never
  returned to the browser. `lib/getToken.ts` reads them, server actions send
  `Authorization: Bearer`. `providers/auth-provider.tsx` holds client `user` state;
  the admin layout hydrates it via `getProfileAction` and redirects to
  `/auth/expired` (route handler: clears cookies → `/auth/login`) if that fails.
  Logout is local only (delete both cookies) so it cannot fail on an expired token.
- **Route protection + refresh**: `proxy.ts` = Next middleware, runs only on `/admin`
  and `/auth/login|signup`. An expired access token is swapped via
  `POST /auth/refresh-token` before the page or server action runs; the new pair is
  set on the response and the forwarded request. No valid session → `/auth/login`;
  non-admin role (read unverified from the JWT, UX only) → `/`; signed-in admin on
  an auth route → dashboard.
- **Data fetching**: server actions (`actions/*.action.ts`) all go through
  `lib/api.ts`: `apiFetch<T>()` throws `ApiError` (has `statusCode`) when the
  envelope says `success: false`; `apiFetchOrNull<T>()` returns null instead (for
  "missing is normal" reads). `auth: true` adds the Bearer token. Reads use
  `getCacheFetchOptions` (`force-cache` + ISR + tag from `lib/cache-tags.ts`);
  writes call `updateTag()`. Never read `headers()`/`cookies()` on public reads —
  it makes the page dynamic and cancels `revalidate`.

## Route groups (`app/`)

- `(homepage)/` — public. `page.tsx` landing (hero centerpiece is
  `components/home/hero-panel.tsx`, public reading-list stats; the live Zod
  `validation-console.tsx` now sits atop `form-playground/`),
  `blogs/` + `blogs/[slug]` (404 on unknown/draft, per-post metadata; the list page
  and its `loading.tsx` live in a `(list)` route group so the skeleton never wraps
  `[slug]` — a wrapping `loading.tsx` streams the page and turns `notFound()` into
  a 200), `notes/` +
  `notes/[id]` (public study notes; the reader dialog links to the page),
  `components/` (showcase; specimens live in
  `components/_components/`), `form-playground/` (validation challenges).
- `(admin)/admin/` — protected. `dashboard/` (the tracker), `blogs/` (table +
  create + edit), `notes/` (table with view/edit/delete dialogs — the view dialog's AI panel calls
  `actions/ai.action.ts` for recall cards / mistake check, results not saved — + `create-note/`
  for the quick-note form and timeline), `categories/` (the taxonomy CRUD), own
  `layout.tsx` (sidebar shell).
- `(auth)/auth/` — `login/`, `signup/`, `expired/route.ts` (clears a dead session).
  Zod schemas colocated in `schema/`.
- `app/sitemap.ts` (static pages + published blogs + COMPLETE notes) and
  `app/robots.ts` (disallows `/admin`, `/auth`). Origin from `lib/site.ts`
  (`NEXT_PUBLIC_SITE_URL`, falls back to the Vercel URL).

## Design

**`docs/design-system.md` is binding — read it before any UI change.** Direction is
"Night Studio": dark-first study desk, raised panels, one lime accent. Use semantic
tokens only (`brand` / `brand-ink` / `signal` / `warn` / `fail` / `iris` / `surface` /
`line`) — never raw palette classes or hex; lime as text is always `text-brand-ink`.
Type: Bricolage Grotesque (`font-display`, headings), Hanken Grotesk (body), DM Mono
(machine text only).

## Conventions

- Feature folders use `_components/` (private), `schema/` or `validation/` (Zod),
  `data/`, `types/`. Page = thin wrapper → `*-main-wrapper.tsx` does the work.
- Forms: React Hook Form + Zod (`@hookform/resolvers`). Reusable field wrappers in
  `components/forms/shadcn/` (form-input, form-select, form-date-picker,
  form-phone-input…). Prefer these over raw inputs.
- Tables: `@tanstack/react-table` wrapped in `components/tables/data-table.tsx`;
  per-feature `column.tsx`.
- shadcn primitives in `components/ui/` — do not hand-edit unless intentional.
  Shared building blocks in `components/common/`, `components/layout/`, `components/home/`.
- Rich text: Markdown. Blogs and notes store markdown, rendered with
  `react-markdown` + `remark-gfm` + `rehype-highlight` and `markdown-content.css`.
  (The TipTap editor was unused and is removed.)
- Shared helpers: `readingMinutes()` / `cleanMarkdownSnippet()` in `lib/utils.ts`,
  `formatNoteDate()` in `lib/journal.ts` — don't re-declare them per component.
- Types: shared in `types/index.ts` (`IUser`, `IBlog`, `IAuthContext`), else colocated.
- Toasts: `sonner`. Theme: `next-themes` (`theme-provider`, `theme-toggler`).
- **Modals: always `components/modal/common-modal.tsx`** — never `DialogContent`
  directly. Fixed header (title, optional `description`, close button) + optional
  fixed footer; only the body scrolls. Width via `className` (`sm:max-w-lg` forms,
  `sm:max-w-2xl` reading). Footer submit buttons use `form="<form id>"`.
  Destructive confirms stay on `common-alert-modal.tsx`.
- Controls are buttons, not underlined text. Underline = prose link only.

Error UI: `app/not-found.tsx` (styled 404), `app/(homepage)/error.tsx`,
`app/(admin)/admin/error.tsx`, `app/global-error.tsx`. Security headers
(`X-Frame-Options`, nosniff, referrer, permissions, CSP `frame-ancestors` only) are in
`next.config.ts`.

Large screens are split by concern: notes page → `use-note-filters.ts`,
`use-copy-note.ts` + section components in `notes/_components/`; admin dashboard →
`dashboard-data.ts` (`loadDashboardSources` / pure `deriveDashboardStats`) + panel
components; `components/tables/data-table.tsx` → `use-row-ordering.ts`,
`data-table-sortable-*.tsx`, `data-table-parts.tsx`. Add to those pieces rather than
growing the entry files again.

## Key files

- `actions/*.action.ts` — backend calls via `lib/api.ts`; `lib/env.ts` — validated env
- `lib/getToken.ts` — cookie token read; `lib/auth-cookies.ts` — JWT decode, cookie
  options, refresh call; `lib/nav-items.ts` — admin sidebar; `lib/utils.ts` — `cn`
- `lib/journal.ts` — the journal's Dhaka day keys plus every note-derived tracker figure
  (`getJournalStats`, `getActivity`). Nothing is counted from stored counters
- `lib/categories.ts` — tone→class map; `components/common/category-label.tsx` — the shared badge
- `proxy.ts` — auth middleware
- `types/index.ts` — `IBlog` has `status` DRAFT|PUBLISHED and `category` (an `ICategory` id);
  `INote`, `ICategory`, `TCategoryTone` live here too

## Backend (separate repo, outside this workspace)

`playground-backend` — Express 5 + Mongoose 9 + Zod 4, deployed by the owner. It is
**not editable from this workspace**; open it separately. Base path `/api/v1`; every
response is `{ success, statusCode, message, data, errors }`.

Modules, all built and registered in `src/app/routes/router.ts`:

- `note/` — `{ blog?, title, description?, content, category, isPublished, timestamps }`,
  admin-only, mirroring the `blog/` file layout.
- `category/` — `{ name, slug, tone, description?, order }`. **`GET /categories` is
  public (no `checkAuth`)** so the public site and the pickers can read it;
  create/update/delete are admin-only. Deleting refuses while blogs or notes still
  reference it.
- `reminders/` — secret-protected endpoint, Asia/Dhaka day window, per-slot
  idempotency key, `sendTelegram(text)` abstraction over the Telegram Bot API (free).

Reminder env vars (values live in the backend `.env`, which is gitignored — never
commit them; the bot token alone is enough for anyone to send as the bot):
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `REMINDER_SECRET`, `REMINDER_TZ`.

Backend Phase 0 bugs (model fields, draft leak, optional `FRONTEND_URL_LOCAL`,
dead `createNewAccessToken`) are **fixed**: `GET /blogs` is published-only and
admins use `GET /blogs/all` (frontend `includeDrafts: true`); the refresh route
is `POST /auth/refresh-token` (cookie-based).

Auth hardening (2026-10-04): `GET /blogs/:slug` is published-only (drafts 404) and
the edit page uses admin-only `GET /blogs/all/:slug`. `POST /auth/logout` has no
`checkAuth`. Login locks an email for 15 min after 5 failures (`auth.model.ts`,
Mongo TTL — per-email, not per-IP, because logins arrive via the frontend server),
and unknown-email / wrong-password return the same message. Token lifetimes must
be **access short, refresh long** (`JWT_ACCESS_EXPIRES=1d`,
`JWT_REFRESH_EXPIRES=30d`).

Backend platform (2026-10-04): Vercel builds `src/server.ts` directly (`vercel.json`);
`dist/` is gitignored and untracked. `helmet()` on all routes; uploads are checked by
magic bytes (`utils/isAllowedImage.ts`: JPEG/PNG/GIF/WEBP); the error handler logs
one structured JSON line (no bodies/headers); `/health` connects before reporting.
Indexes: Note `{status,createdAt}`, `{blog,createdAt}`, `{createdAt}`; Blog
`{isPublished,isDeleted,createdAt}`. Tests: `pnpm test` (vitest + supertest +
mongodb-memory-server, `tests/*.test.mjs`, 29 tests on draft/privacy, auth, lockout,
roles, reminder paths, Telegram mocked) + CI workflow (tsc + tests). Locally
`pnpm-workspace.yaml` (gitignored) must set `allowBuilds.mongodb-memory-server: false`
or pnpm 11 refuses to run scripts.

## Notes

- `docs/design-system.md` — tokens, type scale, motion budget, quality floor.
- The old `type` enum on Blog/Note is **gone** — do not reintroduce it. Blogs and
  notes carry a `category` id; labels and tones come from the category documents so
  a rename in `/admin/categories` propagates everywhere.
