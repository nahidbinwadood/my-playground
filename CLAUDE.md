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
- A **notes** domain (not yet built) holds the owner's handwritten takeaways, attached
to a blog or standing alone. Many notes per blog; each is a dated entry.
- Progress views — timeline, stats, topic coverage, streak — are **private, under
`/admin`**, and all derive from the same note data. No extra storage.
- If no note is created or edited on a given day, a Telegram reminder fires at
18:00 / 22:00 / 23:00 Asia/Dhaka. Later slots skip if a note was logged.

**Current status:** the notes domain is built on both ends — the `/admin/notes`
quick-note form plus timeline feed on the frontend, the `note/` and
`reminders/` modules on the backend — but has never been run against a live DB
end to end. The reminder still needs the owner's cron-job.org job + a real
Telegram bot token and chat id. Remaining Phase 4: stats, topic coverage, streak calendar,
dashboard seed removal. Blogs, the component showcase and form-playground are
live.

### Owner decisions — do not relitigate

- **Notes stay private for now** (`isPublished: false` written from day one) so going
public later is a query change, not a migration.
- **The tracker replaces the admin dashboard.** The dashboard currently renders seed
JSON (`blogs.json`, `viewCount`, lowercase `'draft'`) — that data is fake and must not
sit beside real API data.
- **Playgrounds stay public under `/lab`.**
- The public site may show **aggregate stats only** (streak, note count, topics, current
focus) — never note prose.
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
- `pnpm lint` — eslint

Env: `NEXT_PUBLIC_SERVER_URL` — external backend base URL (auth + blogs API). No local DB.

## Architecture

- **Backend is external** (REST at `NEXT_PUBLIC_SERVER_URL`). App talks to it via
  server actions in `actions/`. No API routes here.
- **Auth**: cookie-based JWT. `loginAction` copies backend `Set-Cookie` into
  httpOnly `accessToken`/`refreshToken` cookies. `lib/getToken.ts` reads them,
  server actions send `Authorization: Bearer`. `providers/auth-provider.tsx` holds
  client `user` state; `actions/auth.action.ts` → `getProfileAction` hydrates it.
- **Route protection**: `proxy.ts` = Next middleware. `protectedRoutes` (admin) redirect
  to `/` if no token; `authRoutes` redirect to dashboard if logged in.
- **Data fetching**: server actions (`actions/*.action.ts`), `cache: 'no-store'`.

## Route groups (`app/`)

- `(homepage)/` — public. `page.tsx` landing (hero centerpiece is
  `components/home/validation-console.tsx`, a live Zod `safeParse` demo),
  `blogs/` + `blogs/[slug]`, `components/` (showcase; specimens live in
  `components/_components/`), `form-playground/` (validation challenges).
- `(admin)/admin/` — protected. `dashboard/`, `blogs/` (table + create + edit),
  own `layout.tsx` (sidebar shell).
- `(auth)/auth/` — `login/`, `signup/`. Zod schemas colocated in `schema/`.

## Design

**`docs/design-system.md` is binding — read it before any UI change.** Direction is
"working spec sheet": instrument-like, mono-led, hairline rules, one accent moment
per viewport. Use semantic tokens only (`signal` / `warn` / `fail` / `iris` /
`surface` / `line`) — never `emerald-500`, `zinc-950`, or raw hex. Type is one
superfamily: IBM Plex Sans for headings and prose, IBM Plex Mono for machine text
(paths, labels, numbers, code). Mono means a machine produced it — never prose.

## Conventions

- Feature folders use `_components/` (private), `schema/` or `validation/` (Zod),
  `data/`, `types/`. Page = thin wrapper → `*-main-wrapper.tsx` does the work.
- Forms: React Hook Form + Zod (`@hookform/resolvers`). Reusable field wrappers in
  `components/forms/shadcn/` (form-input, form-select, form-date-picker, form-phone-input,
  form-text-editor…). Prefer these over raw inputs.
- Tables: `@tanstack/react-table` wrapped in `components/tables/data-table.tsx`;
  per-feature `column.tsx`.
- shadcn primitives in `components/ui/` — do not hand-edit unless intentional.
  Shared building blocks in `components/common/`, `components/layout/`, `components/home/`.
- Rich text: TipTap (`form-text-editor.tsx`, render via `tiptap-content.css`).
- Types: shared in `types/index.ts` (`IUser`, `IBlog`, `IAuthContext`), else colocated.
- Toasts: `sonner`. Theme: `next-themes` (`theme-provider`, `theme-toggler`).

## Key files

- `actions/auth.action.ts`, `actions/blog.action.ts` — all backend calls
- `lib/getToken.ts` — cookie token read; `lib/nav-items.ts` — admin sidebar; `lib/utils.ts` — `cn`
- `proxy.ts` — auth middleware
- `types/index.ts` — `IBlog` has `status` DRAFT|PUBLISHED, `type` FRONTEND|BACKEND|JAVASCRIPT

## Backend (separate repo, outside this workspace)

`playground-backend` — Express 5 + Mongoose 9 + Zod 4, deployed by the owner. It is
**not editable from this workspace**; open it separately. Base path `/api/v1`; every
response is `{ success, statusCode, message, data, errors }`.

Planned modules (not built yet):

- `note/` — `{ blog?, title, description?, content, type, isPublished, timestamps }`,
  admin-only, mirroring the `blog/` file layout.
- `reminders/` — secret-protected endpoint, Asia/Dhaka day window, per-slot
  idempotency key, `sendTelegram(text)` abstraction over the Telegram Bot API (free).

Reminder env vars (values live in the backend `.env`, which is gitignored — never
commit them; the bot token alone is enough for anyone to send as the bot):
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `REMINDER_SECRET`, `REMINDER_TZ`.

Backend Phase 0 bugs (model fields, draft leak, optional `FRONTEND_URL_LOCAL`,
dead `createNewAccessToken`) are **fixed**: `GET /blogs` is published-only and
admins use `GET /blogs/all` (frontend `includeDrafts: true`); the refresh route
is `POST /auth/refresh-token` (cookie-based).

## Notes

- `docs/design-system.md` — tokens, type scale, motion budget, quality floor.
- Blog sample seed: `app/(homepage)/blogs/data/blogs.json`.
