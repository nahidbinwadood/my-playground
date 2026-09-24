# Night Studio redesign — design spec

Date: 2026-09-24 · Status: approved in chat, awaiting spec review
Visual reference: canvas "Playground Redesign Directions", row B
(https://claude.ai/artifact/Av4r5VeMGzjKGVgWGZkQEC — private to the owner).

## Intent

The owner dislikes the current theme, palette and font (Geist, graphite neutrals,
indigo accent). Replace them site-wide with **Night Studio**: a dark-first study
desk — deep near-black ground, raised panels, one lime accent, a characterful
grotesk display face. It must fit a learning journal plus its private tracker,
and must not read as a stock shadcn template.

Owner decisions (from the brainstorm):

- Direction B, **dark default with light mode kept** (toggle stays).
- **One pass** — every route restyled in a single change.
- Landing hero centrepiece becomes an **activity-style panel built from public
  blog data**; the validation console moves to `/form-playground`.
- No backend changes. Note data stays admin-only.

Out of scope: ⌘K search (drawn in the mockup; no search exists — add with search),
new features, backend work, copy rewrites beyond the hero.

## 1. Type

`app/layout.tsx` via `next/font/google`, replacing Geist / Geist Mono:

| Role | Family | Variable | Weights |
|---|---|---|---|
| Display: headings, big figures | Bricolage Grotesque | `--font-display` | 400–700 (variable, opsz) |
| Body + UI | Hanken Grotesk | `--font-sans` | variable |
| Machine text: dates, paths, counts, kbd | DM Mono | `--font-mono` | 400, 500 |

- `globals.css` `@theme`: `--font-sans`, `--font-mono`, new `--font-display`
  (Tailwind class `font-display`).
- `h1`–`h3` and stat figures use `font-display`, tight tracking (`-0.02em` to
  `-0.035em` on large sizes). Body stays `font-sans`.
- The mono rule survives: mono means a machine produced it, never prose. The
  uppercase letter-spaced mono label style is **dropped** — labels become
  sentence-case `font-sans text-sm text-muted-foreground`; mono stays for dates,
  counts, keys.

## 2. Colour tokens

Token **names are kept** so components keep compiling; values change. One new
token, `brand`.

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| `background` | `#0D0E12` | `#F4F4F1` | Page ground |
| `card` / `popover` | `#15171D` | `#FFFFFF` | Raised panels |
| `surface` | `#0D0E12` | `#F4F4F1` | Wells inside panels (inset tiles, code, table head) |
| `muted` | `#1C1F26` | `#ECECE7` | Hover fills, active nav item, heatmap empty cell |
| `line` / `border` / `input` | `#23262F` | `#E2E2DC` | Hairlines |
| `foreground` | `#E8E6E1` | `#15171D` | Text |
| `muted-foreground` | `#8A8F9C` | `#62666F` | Secondary text (≥4.5:1 on card in both) |
| `primary` | `#D4F26A` | `#D4F26A` | **Lime.** Primary CTA fill |
| `primary-foreground` | `#0D0E12` | `#0D0E12` | Text on lime |
| `brand` (new) | `#D4F26A` | `#D4F26A` | The one accent fill: streak tile, active dot, highlight |
| `brand-ink` (new) | `#D4F26A` | `#557310` | Lime used **as text** (light value is readable on white) |
| `iris` / `iris-ink` | `#7C9CFF` / `#9DB3FF` | `#3D5BD9` / `#2A48B8` | Category/data colour only (periwinkle) — **no longer the accent** |
| `signal` / `-ink` | retune: green fill, readable ink | same | Valid / published |
| `warn` / `-ink` | retune: `#F2C46A` fill | amber, darker ink | Draft / pending |
| `fail` / `-ink` | retune: rose | same | Invalid / destructive |
| `ring` | lime | `#557310` | Focus only |

Final values are expressed in `oklch` in `globals.css`; the hexes above are the
targets. Every `-ink` token must pass 4.5:1 on both `card` and `background` in
its theme — light `brand-ink` is the one most at risk.

Why `iris` is not renamed: `'iris'` is a **stored value** — the backend category
enum and `TCategoryTone` (`types/index.ts:19`, `lib/categories.ts:4`) persist it in
Mongo. It stays as a tone; only its colour and role change. `CATEGORY_TONE_LABEL.iris`
becomes `'Blue'`.

Rules:

- **Accent budget:** at most one `brand` / `primary` element per viewport region —
  a lime CTA *or* a lime tile, not both side by side. Exception: admin dashboard,
  where the New note button (header) and the streak tile (stats row) are
  separated by a row.
- Primary **is** a colour now (lime). The old "primary is ink" rule is retired.
- `signal` / `warn` / `fail` stay functional, never decorative.
- Category chips: `bg-<tone>/12 text-<tone>-ink`, no border, `rounded-md`,
  `text-xs font-medium` (mockup chip).
- Depth: `background` → `card` → `surface`, separated by `line`. Shadows only
  on floating layers.

Theme: `providers/theme-provider.tsx` → `defaultTheme="dark"`, keep
`enableSystem` so the toggle's "system" option still works.

## 3. Shape

- Radius scale: controls (button, input, select, chip-sized) `10px`;
  cards/tiles `14px`; shell panels `18px`; pills `9999px`. Set `--radius: 0.875rem`
  and derive shadcn's `sm/md/lg/xl` from it so `components/ui/` follows without edits.
- Controls height 40–42px; touch targets ≥44px on mobile.

## 4. Layouts

### Admin shell — `app/(admin)/admin/layout.tsx` + sidebar

- Page `bg-background`, `p-3 gap-3` flex. Sidebar sits on the ground (no panel):
  wordmark (lime rounded square + "playground", `font-display`), nav links
  (`rounded-[10px]`, active = `bg-muted text-foreground`, idle = muted text).
- Sidebar foot: nothing new (the shell fetches no note data; the reminder status
  lives on the dashboard, below).
- Main: `bg-card border rounded-[18px] p-7`.

### Admin dashboard — `admin/dashboard/_components/*`

Same data as today (`getJournalStats`, `getActivity`); visuals only:

1. Header: mono date (`thu 24 sep`), `font-display` greeting, lime **New note**
   button, and a reminder status chip (`bg-warn/12 text-warn-ink`): "Next reminder
   HH:00" = next of 18/22/23 Dhaka after now when nothing is logged today;
   "Logged today" (`signal`) when a note exists today; "No more reminders today"
   after 23:00. Pure function `getReminderStatus(notes, now)` in `lib/journal.ts`,
   reusing its Dhaka day keys, with one assert-based check.
2. Four tiles: **Streak** tile = `bg-brand text-primary-foreground`; others
   `bg-surface border`. Figures `font-display text-[44px] font-semibold`.
   Unknown stays rendered as unknown (—), never 0.
3. Row: Activity heatmap (`surface` tile; cells `rounded-[3px]`, 5-step lime
   ramp dark / olive ramp light, empty = `muted`) + Topic coverage (segmented bar
   in category tone colours + legend with mono counts).
4. Recent entries: rows with mono date, title, category chip.

Heatmap ramp is a token set: `--heat-0..4` in both themes.

### Public shell — `app/(homepage)/layout.tsx` header/footer

- Header: wordmark · **pill nav** (`bg-card border rounded-full p-1`, active item
  `bg-muted`) Journal/Reading/Components/Forms — mapped to existing routes — ·
  theme toggle + sign-in.
- Footer: one hairline row, mono meta text.

### Landing — `app/(homepage)/page.tsx`, `components/home/*`

- `hero-section.tsx`: left — mono status line with lime dot, `font-display` h1
  ~76px, key phrase in `text-brand-ink`, lede, lime primary + card secondary CTA.
  Right — **public activity panel** (`bg-card rounded-[18px]`):
  - segmented bar of **published blogs per category** (tone colours) + legend with
    counts, from `getAllBlogs` + `GET /categories` (both public);
  - three inset tiles: published posts · components · challenges (the same
    figures `stats-section.tsx` already computes — reuse, don't duplicate).
  - Any failed fetch renders `—` for that figure.
- `validation-console.tsx` leaves the hero and mounts at the top of
  `/form-playground`.
- `stats-section.tsx`: **deleted**. Its post/component/challenge figures move into
  the hero panel, which takes over its counting code; the shadcn-primitives count
  is dropped.
- `tech-marquee`, `features-section`, `latest-blogs-section`, `cta-section`:
  restyle to tokens/radii only.

### Everything else

Blogs list + detail, notes table + dialogs + create-note, categories CRUD, lab
(components showcase, form playground), auth pages: **no structural change** —
they inherit tokens/fonts/radius; fix any hard-coded styles that fight the new
look (old uppercase mono labels, indigo-as-accent uses of `iris` → `brand`).
`tiptap-content.css` updated for fonts and code-block surface.

## 5. Docs

- Rewrite `docs/design-system.md` for Night Studio (this spec's sections 1–3 as
  the binding rules).
- `CLAUDE.md` "Design" paragraph: replace the stale "working spec sheet / IBM
  Plex" text with Night Studio fonts and tokens.

## 6. Verification

- `pnpm lint` and `pnpm build` clean.
- Grep: no `font-geist`, no raw palette classes introduced, `iris` used only for
  category/data colour.
- Screenshot every route group (landing, blogs, blog detail, components,
  form-playground, login, admin dashboard, notes, create-note, categories,
  blogs admin) in **dark and light**, desktop 1280 and mobile 390.
- Contrast spot-check of every `-ink` token and `muted-foreground` on `card` and
  `background` in both themes (≥4.5:1).

## 7. Plan-time adjustments

Found while planning against the code (see the implementation plan):

- Public nav has no "Journal" item — notes are private, there is no public
  journal route. Items: Home, Reading (`/blogs`), Components, Forms.
- Public footer: tokens only, no restructure.
- Dashboard title stays "Overview" with the Dhaka date as eyebrow; the old blog
  KPI cards and Momentum panel are replaced by the four journal tiles (longest
  streak moves under the streak tile, blog counts into the Recent posts meta).
- `components/ui/*` is not hand-edited: shadcn controls keep `h-9` and
  `rounded-md` (12px on the new scale). The 10px / 40px rule applies to custom
  controls.
- Admin shell uses shadcn's built-in `Sidebar variant="inset"`.
