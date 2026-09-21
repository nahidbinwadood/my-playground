# Learning Journal — Build Plan

The single source of truth for what we're building, why, and in what order.
`AGENTS.md` / `CLAUDE.md` carry the short version; this file carries the detail.

---

## Goal

A **private learning journal with a public face.** Reference material being studied
lives in `blogs/`; the owner's own handwritten takeaways live in a new **notes** domain.
The point is not reading — it is the streak.

> Open quick-note → write → save → streak holds.
> If nothing is logged, Telegram nudges at 18:00, 22:00 and 23:00 Asia/Dhaka.

This is **not a portfolio**. The owner's portfolio lives elsewhere — no contact forms,
no résumé pages, no client-facing marketing copy.

---

## Locked decisions

Do not relitigate these without the owner.

| Decision | Rationale |
|---|---|
| Notes stay **private** for now, with `isPublished: false` written from day one | Going public later becomes a query change, not a migration |
| **Many notes per blog**, and notes may be standalone (`blog: null`) | Each learning is its own dated entry — otherwise streaks and timelines are meaningless |
| Topic axis = the existing `type` enum (FRONTEND / BACKEND / JAVASCRIPT), stored **on the note** | Standalone notes need a topic; re-classifying a blog must not silently shift the coverage map |
| **Tracker replaces the admin dashboard** | The dashboard currently renders seed JSON (`blogs.json`, `viewCount`, lowercase `'draft'`) — that data is fake and must not sit beside real API data |
| Playgrounds stay public under **`/lab`** | The component showcase and form-playground are proof of range |
| Public site may show **aggregate stats only** (streak, note count, topics, current focus) | Evidence of momentum without exposing raw note prose |
| **Loop before charts** | The journal is worthless until logging is fast and the reminder is live. Trackers are the fun part — that's exactly why they wait |

## Constraints

- **The owner deploys.** Agents must not deploy, `git push`, or configure hosting.
- **Free tier only — no paid services.** Rules out Vercel Pro crons and paid messaging APIs.
- **Vercel Hobby crons run once per day and fail at deploy if scheduled more often.** A
  3×/day schedule must come from an external scheduler (cron-job.org), never `vercel.json`.
- **The backend is a separate repo outside this workspace** (`playground-backend`). It is
  not editable from here — backend phases run in their own session.

---

## Phases

### Phase 0 — Fix what's already broken

Small, and it protects everything downstream.

- [x] `lib/getToken.ts` — `refreshToken` was reading the `accessToken` cookie
- [x] `proxy.ts` — exact-match route list left nested `/admin/*` routes unprotected;
      also fixed `'auth/signup'` (missing leading slash). Now prefix-matched
- [x] Backend: `blog.model.ts` does not declare `status`, `type`, `isDeleted`,
      `deleteImageUrl` → Mongoose silently drops them. **Fixed** — all four
      declared (`type` required, `status` defaults to DRAFT)
- [x] Backend: `getAllBlogs()` has no `isPublished` filter → drafts leak onto
      public pages. **Fixed** — public `GET /blogs` returns published only;
      drafts moved to a new admin-only `GET /blogs/all` (declared before
      `/:slug`), and the two admin call sites now pass `includeDrafts: true`
- [x] Backend: `env.ts` requires `FRONTEND_URL_LOCAL` despite a comment calling
      it optional. **Fixed** — removed from `requiredVariables`
- [x] Backend: `createNewAccessToken` is dead code — no refresh route exists, so
      sessions die silently when the access token expires. **Fixed** —
      `POST /auth/refresh-token` reads the httpOnly `refreshToken` cookie
      (added `cookie-parser`) and rotates both cookies
- [x] Frontend: `signup-form.tsx` is a `setTimeout` stub; schema lacks
      `name`/`role`, both required by `/auth/create`. **Fixed** — `name` field
      added, `role: 'user'` sent as a constant, real `signupAction` wired,
      redirects to login (create returns no tokens)

### Phase 1 — Backend: `note/` module

See [Backend spec](#backend-spec) below.

- [x] **Built** — all six files mirroring `blog/`, registered at `/notes`,
      `GET /blog/:blogId` declared before `/:id`, `?includeContent=false`
      supported, blog-existence guard on create/update. `tsc --noEmit` clean.
      **Verified against the live DB on 2026-09-21** — created a standalone and
      an attached note, read them back both ways, updated and deleted them.
      See the progress log.

### Phase 2 — Backend: reminder module + scheduler

See [Backend spec](#backend-spec) below.

- [x] **Built** — `GET /reminders/check` with `x-reminder-secret`
      (`timingSafeEqual`), Dhaka day window via `Intl`, activity check on
      `createdAt`/`updatedAt`, most-recent-slot derivation, `ReminderLog`
      idempotency claim (compound unique index, released on failed send),
      streak walk-back from yesterday, message copy per slot, `sendTelegram`
      over the Telegram Bot API with `AbortSignal.timeout(15_000)` and `ok`-flag
      inspection. Pause switch included as a `ReminderSetting` singleton (no
      admin UI yet).
- [x] **Channel switched to Telegram** — CallMeBot dropped before it ever sent a
      message. `sendWhatsApp.ts` → `sendTelegram.ts`,
      `CALLMEBOT_PHONE`/`CALLMEBOT_APIKEY` →
      `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`. The reminder logic itself did not
      change — that is exactly what the provider seam was for.
- [ ] **Owner** — the credentials are in place, and the deployed host was
      confirmed armed on 2026-09-21: a live call to
      `https://playground-backend-rho.vercel.app/api/v1/reminders/check` with the
      local secret returned `{ sent: true, slot: '23', streak: 0 }`, and an
      immediate repeat returned `already_sent`. So the host's `REMINDER_SECRET`
      **is** the local value and its Telegram credentials work — nothing else
      needs setting. Remaining: create the cron-job.org job — that URL, method
      `GET`, schedule `0 18,22,23 * * *`, timezone Asia/Dhaka (set per job),
      header `x-reminder-secret: <that value>`, failure notifications on.

### Phase 3 — Frontend: quick-note authoring

- [x] `types/index.ts` — `INote`, `INoteInput`, shared `TTopic` / `TBlogStatus`
- [x] `components/forms/shadcn/form-textarea.tsx` — new reusable RHF textarea wrapper
      (the field family had no textarea)
- [x] `actions/note.action.ts` — create / list / list-by-blog / get / update / delete
- [x] `app/(admin)/admin/notes/` — `page.tsx` → `_components/notes-main-wrapper.tsx`
- [x] Quick-note form — blog select prefills title + topic, `Ctrl/Cmd + Enter` saves,
      resets after save so the next entry can be logged immediately
- [x] `validation/note-schema.ts` — Zod, colocated (mirrors `create-blog/validation/`)
- [x] `loading.tsx` + `_components/notes-skeleton.tsx` mirroring the form's layout
- [x] `lib/nav-items.ts` — Notes entry
- [x] **Notes index at `/admin/notes`** — a table shaped like the blogs list:
      title + source line (attached blog, `standalone entry`, or a warn-coloured
      `attached blog was deleted`), topic badge, created, updated, and a row menu
      with **View / Edit / Delete**. Counts strip on top reuses `getJournalStats`,
      so "this month" cannot disagree with the dashboard. Unlike the logging page
      it fetches bodies — the view dialog renders `content` and the edit dialog
      opens prefilled with it, so opening a row costs no extra request
- [x] **`/admin/notes/create-note`** — the quick-note form moved behind the index,
      mirroring `/admin/blogs/create-blog`. The timeline stays under the form, so
      save → `router.refresh()` still shows the new entry immediately. Cost of the
      restructure: logging is one click further from the sidebar (Notes opens the
      table). Editing does **not** prefill the title or topic from a newly picked
      blog, unlike the create form — those belong to the note
- [x] **View and edit in dialogs** — `note-view-dialog.tsx` (read-only, body
      rendered `whitespace-pre-wrap` since it is plain text from a textarea) and
      `note-form-dialog.tsx` (RHF + the same `noteSchema`, `Ctrl/Cmd + Enter`
      saves, an empty description is sent as `''` so clearing one is a real edit)

**Zod folder:** used `validation/` rather than `schema/` — `AGENTS.md` allows either, and
`create-blog/validation/blog-schema.ts` is the closer sibling.

**Backed by real endpoints now** — `createNoteAction` targets the built
`POST /notes/create`, and the blog-list call goes to the admin-only
`/blogs/all`. The page still degrades gracefully when the blog list call fails
(the wrapper catches it and the form falls back to standalone entries). The HTTP
contract it calls was verified end to end on 2026-09-21 (see the progress log) —
including that the `?includeContent=false` payload the timeline fetches still
carries `description` — but the round trip has not been driven from a browser
session yet.

### Phase 4 — Tracker (replaces the admin dashboard)

All four views are derived from the same note data — one source, four presentations.
Build in this order:

- [x] Timeline of entries (also the `/admin/notes` feed) — **built**:
      `notes-timeline.tsx` renders the feed under the quick-note form. Dhaka
      day keys via `Intl` (same boundary the reminder uses), consecutive
      same-day entries collapse into one dated group, Today/Yesterday labels,
      mono time + topic + entry counts, blog backlink to `/blogs/[slug]` when
      the note is attached and the blog still exists. Fetched with
      `includeContent: false` (momentum surface, not a reading surface);
      blog ids joined client-side against the picker list. `router.refresh()`
      after save so the new entry lands immediately. Empty state points at the
      form; degraded state keeps logging usable. Skeleton mirrors the layout.
      `tsc --noEmit`, eslint (0 errors), `pnpm build` pass (build needs
      `NODE_OPTIONS=--max-old-space-size=6144` on this machine — Windows
      workers OOM at the default heap)
- [x] Stats — **built**: `lib/journal.ts` derives every tracker figure from the
      note list alone (`getJournalStats`), so no counter is stored and none can
      drift from the notes. Current streak (today counts as soon as one note
      lands and stays open until midnight Dhaka — an empty today walks back from
      yesterday instead of reporting 0), longest streak, entries this month
      (Dhaka month boundary, via the day keys), and current focus (most-logged
      topic in the last 14 days, ties going to the most recently logged topic —
      one stray note on an old topic is not a change of focus)
- [x] Topic coverage map — **built**: dashboard panel, bars scaled to the busiest
      topic, counted off each note's own category id (see the taxonomy below)
- [x] Streak / activity calendar — **built**: `activity-calendar.tsx`, 16 weeks as
      Monday→Sunday columns in the journal's timezone, four steps plus empty.
      The fill is the **ink scale, not `iris`** — a heatmap is many marks and the
      accent budget on that page belongs to the topic bars. Month axis derived
      from the columns, days still to come rendered as blank slots rather than
      zero days, today outlined, per-cell hover titles, and a caption carrying
      the same information as text. `Activity` (2/3) + `Momentum` (1/3) sit
      directly under the KPIs
- [x] Remove the `blogs.json` seed import from the dashboard — **done**:
      `app/(homepage)/blogs/data/blogs.json` is deleted, and every figure on
      `/admin/dashboard` is counted from the API at request time

### Phase 5 — Public face

- [ ] Aggregate-stats block on the homepage — **needs a public endpoint** (no `checkAuth`)
- [ ] `/lab` — relocate `components/` showcase and `form-playground/`
- [ ] `/about` — links out to the portfolio
- [ ] `sitemap.ts`, `robots.ts`, RSS, per-page metadata, OG images
- [ ] Flip `isPublished` and open the notes feed (owner's call, whenever ready)

### Phase 6 — Launch

- [ ] Frontend deploy (**owner**)
- [ ] Set `NEXT_PUBLIC_SERVER_URL` on the frontend host
- [ ] Confirm `FRONTEND_URL_PRODUCTION` on the backend matches the frontend origin

---

## Backend spec

For the session working in `playground-backend`. Mirror the existing `blog/` module's
file layout and follow its conventions: `catchAsync`, `sendResponse`, `checkAuth`,
`validateRequest`, `AppError`, HTTP codes from `http-status-codes`.

### Registration

`src/app/routes/router.ts` — add to `moduleRoutes`:

```ts
{ path: '/notes', route: NoteRoutes },
{ path: '/reminders', route: ReminderRoutes },
{ path: '/categories', route: CategoryRoutes }, // GET is public; writes are guarded
```

### `note/` module

Files: `note.interface.ts`, `note.model.ts`, `note.validation.ts`, `note.route.ts`,
`note.controller.ts`, `note.service.ts`.

```ts
export interface INote {
  blog?: Types.ObjectId | null; // ref 'Blog'; null = standalone entry
  title: string;                // prefilled from blog.title; owner may override
  description?: string;
  content: string;              // the handwritten body
  type: BlogTypes;              // topic axis — own copy, not inherited
  isPublished: boolean;         // default false; the future public switch
  createdAt?: Date;
  updatedAt?: Date;
}
```

Model: `title` required + trim, `content` required, `type` enum of `Object.values(BlogTypes)`,
`isPublished` default `false`, `blog` ref `Blog` default `null`. Use `timestamps: true`,
`versionKey: false`, and the same `schemaTransform` (`_id` → `id`) as `blog.model.ts`.

Routes — **all wrapped in `checkAuth('admin')`**:

| Method | Path | Notes |
|---|---|---|
| POST | `/create` | validate `createNoteSchema` |
| GET | `/` | all notes — powers the tracker |
| GET | `/blog/:blogId` | notes attached to one blog |
| GET | `/:id` | validate the id with `isValidObjectId` |
| PATCH | `/:id` | validate `updateNoteSchema` |
| DELETE | `/:id` | |

> **Declare `GET /blog/:blogId` before `GET /:id`.** Otherwise Express matches `:id`
> against the literal string `"blog"` and every by-blog lookup 404s.

No Cloudinary, no multipart — notes are plain JSON. Simpler than the blog module.

`GET /` should support an optional `?includeContent=false` to omit the (potentially
large) `content` field for timeline/list views. Nice-to-have, not required.

### `reminders/` module

Files: `reminder.interface.ts`, `reminder.model.ts` (the `ReminderLog`), `reminder.route.ts`,
`reminder.controller.ts`, `reminder.service.ts`, plus `src/app/utils/sendTelegram.ts`.

**Endpoint:** `GET /api/v1/reminders/check`

Auth is **not** `checkAuth` — the scheduler has no JWT. Use a shared secret header:

- Require `x-reminder-secret` to equal `envVars.REMINDER_SECRET`.
- Compare with `crypto.timingSafeEqual`; reject with 401 otherwise.
- Never leave this endpoint unauthenticated — it sends messages to the owner's phone.

**Logic, in order:**

1. **Pause check.** If `ReminderSetting.pauseUntil` is in the future → no-op,
   `reason: 'paused'`. *(Optional for MVP — see below.)*
2. **Compute "today" in Asia/Dhaka**, not UTC. A UTC day window mis-classifies
   late-night entries: at 02:00 Dhaka it is still 20:00 UTC the previous day.
3. **Activity check.** Count notes where `createdAt` **or** `updatedAt` falls inside
   `[startOfDay, now)` in Dhaka. If any → no-op, `reason: 'already_logged'`.
4. **Determine the slot** as the most recent boundary at or before now
   (`now >= 23:00 → '23'`, `else >= 22:00 → '22'`, `else >= 18:00 → '18'`, else none).
   Deriving it this way — rather than matching an exact hour — makes a late or retried
   invocation self-correct instead of falling through a gap.
5. **Idempotency.** Claim `{ dateKey: 'YYYY-MM-DD', slot }` in `ReminderLog` with a
   compound unique index. If the claim already exists → no-op, `reason: 'already_sent'`.
   If the send then fails, **delete the claim** so a retry can re-attempt.
6. **Compute the streak at risk.** Consecutive days with ≥1 note, walking back from
   yesterday until the first empty day. This is the number that makes the 23:00 message
   land.
7. **Send** via `sendTelegram(text)`.
8. **Respond** with a small JSON summary (`{ sent, slot, reason, streak }`) — this is how
   you debug the job from cron-job.org's response view.

**Message copy** (plain text — no `parse_mode`, so nothing needs escaping). Same
three things in the same order every slot: which slot this is, what is missing,
and what it costs. The streak line never folds into the sentence above it — it is
the reason the message lands at all.

```
📘 Daily log · 18:00            ⏳ Daily log · 22:00            🚨 Daily log · 23:00

Nothing has been logged          Two hours left, and today      Last hour, and today
today yet.                       is still empty.                is still empty.
🔥 Streak at risk: 12 days       🔥 Streak at risk: 12 days     🔥 Streak at risk: 12 days

Write one takeaway → /admin/notes
```

A `0` streak is not "at risk", so that line becomes
`🌱 No streak yet — today starts one` instead — nothing to lose yet, and the
number stays meaningful when there is one.

**`sendTelegram(text)` — the provider abstraction.** Telegram today, swappable later
without touching the reminder logic (the reason this function exists at all):

```
POST https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage
{ "chat_id": "<TELEGRAM_CHAT_ID>", "text": "…" }
```

- POST a JSON body rather than a query string — nothing to percent-encode wrong, and
  the message never lands in a proxy's URL log. The token is still in the **path**, so
  never log this URL.
- Send **without `parse_mode`**. MarkdownV2 would require escaping
  `_ * [ ] ( ) ~ > # + - = | { } . !`, and one missed escape fails the send outright
  instead of merely looking wrong.
- Add a timeout (`AbortSignal.timeout(15_000)`) so a hung request can't stall the
  serverless invocation.
- Telegram signals failure as `{ ok: false, description }`, usually with a 4xx. Check
  the body's `ok` flag as well as the HTTP status — `description` is what tells you why.

**Optional (Phase 2b) — the pause switch.** `ReminderSetting` singleton doc with
`pauseUntil`. Without it, a holiday produces three guilt messages a day. Needs a tiny
admin endpoint to set it, which is natural once the tracker UI exists. Not a blocker for
the loop.

### Env vars

Add to `IEnvVariables` **and** to `requiredVariables` in `src/app/config/env.ts`, so a
missing value fails loudly at boot. The failure mode this prevents is the worst one
available: you stop logging, and the reminder that was supposed to catch it never runs.

| Var | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | from @BotFather — shape `123456789:AA…` |
| `TELEGRAM_CHAT_ID` | numeric id of the owner's chat with the bot |
| `REMINDER_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `REMINDER_TZ` | `Asia/Dhaka` |

> **Order matters:** set these on the host **before** deploying the code that requires
> them, or the live backend will fail to boot.
>
> Keep real values in `.env` (gitignored only). Add empty placeholders to `.env.example`.
> **Never commit the bot token or the chat id** — the token alone is enough for
> anyone to send as the bot.

### Scheduler — cron-job.org (free)

| Field | Value |
|---|---|
| URL | `https://<backend>/api/v1/reminders/check` |
| Method | `GET` |
| Schedule | `0 18,22,23 * * *` |
| Timezone | `Asia/Dhaka` — set per job; the default is not Dhaka |
| Header | `x-reminder-secret: <REMINDER_SECRET>` |

Enable failure notifications on the job — that email is how a silently-stopped reminder
gets noticed.

**Owner's one-time setup** (~2 minutes, no activation wait):

1. In Telegram, message **@BotFather** → `/newbot` → pick a display name and a
   `…_bot` username. BotFather replies with the token → `TELEGRAM_BOT_TOKEN`.
2. Open the new bot and send it anything (`/start`). **Not optional** — a bot cannot
   message a chat that has never messaged it first.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy
   `result[0].message.chat.id` → `TELEGRAM_CHAT_ID`.
4. Prove it works before wiring the cron job:
   `curl "https://api.telegram.org/bot<TOKEN>/sendMessage" -d chat_id=<ID> -d text=ping`

### Rejected, and why

- **Vercel Cron** — Hobby runs once per day and *fails at deploy* for anything more
  frequent. Must not appear in `vercel.json`.
- **Twilio / Sinch / Bird** — production-grade, but business-initiated messages need a
  pre-approved template and cost per message.
- **CallMeBot (WhatsApp)** — the original pick, dropped before it ever sent a message.
  Free, but it wants the owner's phone number in an env var, needs a manual
  allow-message activation with a documented 24h retry, and answers HTTP 200 with an
  error string in the body. Telegram has no activation wait, keeps the phone number out
  of config entirely, and returns a real `{ ok }` contract.
- **WhatsApp generally** — still reachable through the same `sendTelegram` seam if the
  owner ever wants it back. Switching providers means rewriting one file.

---

## Progress log

| Date | Change |
|---|---|
| — | Plan agreed and recorded in `AGENTS.md` / `CLAUDE.md` |
| — | Phase 0 (frontend): `getToken.ts`, `proxy.ts` fixed; `types/index.ts` extended |
| — | Phase 3 built: `note.action.ts`, `form-textarea.tsx`, `/admin/notes` form +
loading skeleton, nav entry. `tsc --noEmit` clean, eslint 0 errors, `pnpm build` passes |
| — | Phase 0 backend bugs fixed: `blog.model.ts` fields, draft filter +
admin-only `GET /blogs/all`, `env.ts` optional `FRONTEND_URL_LOCAL`,
`POST /auth/refresh-token` (added `cookie-parser`) |
| — | Phase 0 frontend: signup form wired to `/auth/create` (`name` field,
`role: 'user'`, redirects to login) |
| — | Phase 1 + 2 backend built: `note/` module and `reminders/` module +
`sendWhatsApp`, registered in `router.ts`; reminder env vars added to `env.ts`,
`.env.example`, and local `.env` (dev placeholders). Backend `tsc --noEmit`
clean; frontend `tsc --noEmit` + eslint + `pnpm build` pass |
| — | Phase 4 (first item): timeline feed live under `/admin/notes` —
`notes-timeline.tsx` below the quick-note form, Dhaka day groups, blog
backlinks, empty/degraded states, `router.refresh()` after save. Typecheck,
lint and build clean |
| 2026-09-20 | Reminder channel switched to **Telegram**: `sendWhatsApp.ts` →
`sendTelegram.ts` (POST JSON, no `parse_mode`, `ok`-flag check),
`CALLMEBOT_PHONE`/`CALLMEBOT_APIKEY` → `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`
in `env.ts`, `.env.example` and the local `.env`. Reminder logic untouched; the
owner's phone number is no longer in any tracked file. Backend `tsc --noEmit`
clean |
| 2026-09-21 | Phase 4 finished on the frontend. `lib/journal.ts` — shared Dhaka
day math plus `getJournalStats` / `getActivity`, both derived from the note list
only. `activity-calendar.tsx` heatmap. Dashboard rows: `Activity` + `Momentum`
panels on `/admin/dashboard`; `notes-timeline.tsx` moved onto the shared helpers
so the feed and the tracker cannot disagree about which day a note belongs to.
The math was checked with a throwaway harness before it was deleted (Dhaka day
boundary, streak through a gap, open-today walk-back, day counts of multi-note
days, month count, focus tie-break, grid shape); `tsc --noEmit`, eslint and
`pnpm build` clean |
| 2026-09-21 | Reminder copy rewritten — `SLOT_COPY` + `buildMessage` in
`reminder.service.ts`: multi-line and emoji-led, the streak line never folded
into the sentence above it, and a `0` streak says "today starts one" instead of
claiming a streak is at risk. Why nothing was arriving: **no cron job existed**
— the single `ReminderLog` (2026-09-20, slot `18`, 18:39 Dhaka, i.e. not on the
hour) was a manual call. Deployed host pre-flighted with a live call:
`200 { sent: true, slot: '23', streak: 0 }`, then `already_sent` on the repeat,
so its secret matches and Telegram delivery works. `pnpm build` run afterwards:
23 compiled `dist/` files refreshed (46 on disk, none orphaned, the compiled
tree imports cleanly), so `src/` + `dist/` are ready to commit together —
committing the previously deleted `dist/` on its own would leave Vercel with no
artifact to package |
| 2026-09-21 | Role backfill on the live DB: 2 users (created 2026-07-21, before the
role invariant) went from no `role` field to `role: 'user'` — the value
`createUserSchema` pins — so `checkAuth` and the profile hydration stop seeing
`undefined`. Idempotent (the filter matches only documents missing the field; the
second run reported 0) and no account was granted anything. The journal also
holds its first real note now, logged by the owner after the verification pass |
| 2026-09-21 | Notes loop verified against the live DB — backend already running
locally on port 5000, frontend `.env` pointed at it. HTTP matrix: 401 without a
token; 400 on a bad topic enum, a malformed blog id, a missing body and an empty
title; 400 "Blog does not exist" when a note points at a blog that is not there;
201 on create (standalone and attached); 200 on list (newest first, `id` not
`_id`, `isPublished: false`), on `?includeContent=false` (drops only `content`,
keeps `description`), by-blog, by-id and patch; 404 on a malformed id, an
unknown id and a repeat delete; delete returns the journal to exactly its prior
state (0 notes). Reminder endpoint: 401 without and with a wrong
`x-reminder-secret`, and `already_logged` with the real one — deliberately
ordered **after** a note existed for today, because at 23:31 Dhaka it would
otherwise have sent a real "last call". Deployed backend probed too: `/health`
connected and `/api/v1/notes` answering 401 (not 404), so the committed `dist`
does carry the note module. No residue left — temp harness and the minted admin
token deleted, repo back to its prior state |
| 2026-09-21 | **Taxonomy became data.** The `type` enum (`FRONTEND|BACKEND|JAVASCRIPT`)
on Blog and Note was replaced by a `category` **reference** to a new `category/`
module — `{ name, slug, tone, description?, order }`. Backend: module built
(catchAsync/sendResponse conventions), `router.ts` registers `/categories`,
`GET /categories` is **public (no `checkAuth`)** so signed-out visitors can read
the list, while create/update/delete stay admin-only; Blog and Note models,
interfaces, validation and services swapped `type` → `category` with existence
guards; a migration seeded the three starting documents — **Frontend** (iris,
order 1), **Backend** (signal, 2), **Javascript** (warn, 3) — and moved all 6
blogs and 1 note onto them, then rebuild of `dist/`. Frontend: `actions/category.action.ts`
(public read), `/admin/categories` CRUD (nav entry, table, form dialog with the
tone picker, delete, skeleton), `lib/categories.ts` (tone→class map) and
`components/common/category-label.tsx` (the shared badge, rendering the stored
name — rename once and every surface follows). The category select replaces the
old enum select in the blog form and both note forms; cards, `/blogs/[slug]`, the
blogs and notes tables, the timeline, the note view dialog and the dashboard
(resolved in `lib/journal.ts` as the category id, mapped to a name at the render
site) all show the badge. `tsc --noEmit`, eslint (0 errors) and `pnpm build` pass;
live DB confirmed 3 categories, 6 blogs and 1 note all carrying a category id |
| 2026-09-21 | Notes index built to mirror the blogs list: `/admin/notes` is now a table
(title + source, topic badge, created, updated) whose row menu carries **View**
(read-only dialog, body preserved as plain text), **Edit** (prefilled dialog on
the same schema, `Ctrl/Cmd + Enter` saves, an empty description clears) and
**Delete** (confirm dialog). The quick-note form and timeline moved to
`/admin/notes/create-note`, and every dashboard "Log a note" link points there.
Type rule fixed where it had not been applied: `data-table.tsx` and the blogs
empty state / confirm dialogs no longer set human-written headings in mono (a
panel heading is sans; mono means a machine produced the string). No hardcoded
palette class existed anywhere — the token rules were already clean. Route added,
`tsc --noEmit`, eslint (0 errors) and `pnpm build` pass |

## Open items

- Whether `REMINDER_TZ` should stay hardcoded to Asia/Dhaka or follow the owner if they travel.
- Pagination on `GET /blogs` and `GET /notes` — currently unbounded.
- Refresh-token flow: the backend route now exists (`POST /auth/refresh-token`); the
  frontend has no auto-refresh yet, so a dead access token still requires re-login.
- `GET /blogs/:slug` still serves drafts to anyone holding the slug — public route,
  left as-is in this pass.
- The reminder's send path is **proven on the deployed host** (2026-09-21:
  `sent: true` for slot `23`, then `already_sent` on the repeat), so the only
  missing piece is the scheduler. A failed send deletes its own claim, which is
  why a silently broken *trigger* leaves no trace at all — cron-job.org's failure
  notifications are the only signal to watch.
- **Roles backfilled 2026-09-21.** The two accounts created before the role
  invariant existed (`nahidbinwadood@gmail.com`, `nahidrootdev@gmail.com`) now
  carry `role: 'user'`, the value signup pins. The model declares no default for
  `role`, which is why the field was absent rather than wrong — anything creating
  users outside `createUserSchema` needs to set it.
- Those two accounts still have **no password**, so they cannot sign in, and
  `loginUser` passes an undefined hash to `bcrypt.compare`, which **throws** —
  a login attempt on either returns 500 `Illegal arguments: string, undefined`
  instead of a clean 400. Needs a decision: delete the orphans so the addresses
  are free for signup, or set a password on them.
- Reminder endpoint has no admin-facing pause UI yet (`ReminderSetting` exists; a
  tiny set-pause endpoint can ride along with the tracker work).
- The `Panel` / panel-header markup is now duplicated between
  `create-blog-form.tsx` and `quick-note-form.tsx`. Worth promoting to
  `components/common/panel.tsx` once a third caller appears.
- `revalidateTag('notes', ...)` only has an effect when a caller passes
  `enableCache: true` — otherwise Next's fetch default is no-store and nothing is
  cached to invalidate. Same as the existing blog actions.
- The notes index fetches every body and renders every row, like the timeline —
  unbounded until `GET /notes` paginates. Fine for a personal journal; the first
  thing to fix if it ever lags.
- A server-side 400 surfaces in the toast as the envelope's `message` verbatim, and
  a Zod failure's message is the generic `"Zod Validation Error"` — the field
  messages live in `errors`. The quick-note form validates client-side first, so it
  rarely shows; an edit flow would want them merged.
- The timeline renders entries but has no detail view yet — note bodies are
  never fetched for the feed (`includeContent: false`), so reading a full note
  needs a future `/admin/notes/[id]` or an expandable row.
- Timeline has no pagination/virtualization — unbounded like the backend list.
  The calendar is a fixed 16-week window, so it does not grow with the journal,
  but the feed still renders every entry ever logged.
- `/admin/dashboard` has no `loading.tsx`, unlike `/admin/notes` and the blog
  routes — the quality floor asks for a skeleton that mirrors the layout, and the
  dashboard now fetches both the blog list and the notes list.
- `ACTIVITY_WEEKS` / `FOCUS_WINDOW_DAYS` in `lib/journal.ts` are constants, not
  settings — changing either changes what the calendar and "current focus" mean.
  Promote them to a query param only if the owner ever wants a different slice.
