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
      Not yet exercised against a live DB — first real create will also build
      the indexes.

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
- [ ] **Owner** — create the bot with @BotFather, grab the chat id, set
      `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` on the host (local `.env` has dev
      placeholders), then create the cron-job.org job: `0 18,22,23 * * *`, tz
      Asia/Dhaka, header `x-reminder-secret`, failure notifications on.
      **Set env vars before deploying this code** — the boot now fails loudly
      without them.

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

**Zod folder:** used `validation/` rather than `schema/` — `AGENTS.md` allows either, and
`create-blog/validation/blog-schema.ts` is the closer sibling.

**Backed by real endpoints now** — `createNoteAction` targets the built
`POST /notes/create`, and the blog-list call goes to the admin-only
`/blogs/all`. The page still degrades gracefully when the blog list call fails
(the wrapper catches it and the form falls back to standalone entries), but no
note has actually been saved through it against a live DB — that is the next
verification step.

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
- [ ] Stats (counts: entries this month, topics touched, streak, current focus)
- [ ] Topic coverage map (depends on the Phase 0 `type` fix)
- [ ] Streak / activity calendar
- [ ] Remove the `blogs.json` seed import from the dashboard

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

**Message copy** (plain text — no `parse_mode`, so nothing needs escaping):

| Slot | Message |
|---|---|
| 18:00 | `📘 Daily log not written yet — {n}-day streak on the line.` |
| 22:00 | `⚠️ 2 hours left. Still nothing logged today. {n}-day streak at risk.` |
| 23:00 | `🚨 Last call — 1 hour to keep your {n}-day streak. Log it now.` |

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

## Open items

- Whether `REMINDER_TZ` should stay hardcoded to Asia/Dhaka or follow the owner if they travel.
- Pagination on `GET /blogs` and `GET /notes` — currently unbounded.
- Refresh-token flow: the backend route now exists (`POST /auth/refresh-token`); the
  frontend has no auto-refresh yet, so a dead access token still requires re-login.
- `GET /blogs/:slug` still serves drafts to anyone holding the slug — public route,
  left as-is in this pass.
- Reminder values in the local backend `.env` are **dev placeholders** — a real
  `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` is needed before the reminder can send.
- Reminder endpoint has no admin-facing pause UI yet (`ReminderSetting` exists; a
  tiny set-pause endpoint can ride along with the tracker work).
- The `Panel` / panel-header markup is now duplicated between
  `create-blog-form.tsx` and `quick-note-form.tsx`. Worth promoting to
  `components/common/panel.tsx` once a third caller appears.
- `revalidateTag('notes', ...)` only has an effect when a caller passes
  `enableCache: true` — otherwise Next's fetch default is no-store and nothing is
  cached to invalidate. Same as the existing blog actions.
- The timeline renders entries but has no detail view yet — note bodies are
  never fetched for the feed (`includeContent: false`), so reading a full note
  needs a future `/admin/notes/[id]` or an expandable row.
- Timeline has no pagination/virtualization — unbounded like the backend list.
  Fine until the journal has months of entries; revisit with the stats phase.
