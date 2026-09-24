# Night Studio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's Geist/graphite/indigo look with the Night Studio direction (Bricolage Grotesque + Hanken Grotesk + DM Mono, dark-first, lime accent) on every route in one pass.

**Architecture:** Nearly everything flows from tokens: `app/globals.css` gets new values (names kept, `brand` + `heat-*` added), `app/layout.tsx` swaps fonts, and a base rule puts every `h1–h3` in the display face. Only four areas change structure: admin shell (shadcn `inset` sidebar variant), admin dashboard (journal tiles + reminder chip + segmented topics), public header (pill nav), landing hero (public blog panel). The rest is a mechanical sweep.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (`@theme inline`), shadcn/ui, next-themes, next/font/google, motion. No test runner exists — the one logic check is a Node assert script run with `--experimental-strip-types` (Node 22.17 is installed).

**Spec:** `docs/superpowers/specs/2026-09-24-night-studio-redesign-design.md`

## Global Constraints

- Semantic tokens only. No raw palette classes (`zinc-*`, `emerald-*`, `lime-*`) or hex in components; a missing colour goes in `app/globals.css`.
- Lime **as text** is always `text-brand-ink`, never `text-brand` / `text-primary` (light-mode lime on white is ~1.3:1).
- `iris` is a stored category tone (`'iris'` in Mongo) — never rename it; it is a data colour now, not the accent.
- Unknown renders as `—`, never `0`.
- Accent budget: one lime element per region; dashboard exception = New note button + streak tile.
- Do not hand-edit `components/ui/*`. Accepted consequence: shadcn controls keep their own sizes (`h-9`) and `rounded-md` (= 12px on the new scale); the spec's 10px/40px applies to custom controls only.
- Do not deploy, push, or touch the backend (CLAUDE.md).
- Commit after every task, message ending with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. **API down** — landing panel and dashboard tiles must show `—`, not `0`. Pinned by Task 6 Step 4 and Task 9 Step 3 (dev server pointed at a dead URL).
2. **Light mode lime text** — any `text-brand` / `text-primary` on a light card fails contrast. Pinned by the grep in Task 9 Step 2.
3. **Reminder across Dhaka midnight** while the server runs in UTC — pinned by the 00:30 case in Task 2's check script.
4. **Mobile 390px** — pill nav must hide under `lg`, hero panel must stack under the copy, tiles go 2-up. Pinned by Task 9 Step 5 screenshots.
5. **Collapsed sidebar (icon rail) under the inset variant** — wordmark square must stay centred and the inset panel must not overflow the viewport. Pinned by Task 4 Step 4.

---

### Task 1: Tokens, fonts, theme default

**Files:**
- Modify: `app/globals.css` (whole `@theme inline` font lines, `:root`, `.dark`, `@layer base`, `@layer utilities`)
- Modify: `app/layout.tsx`
- Modify: `providers/theme-provider.tsx:7`

**Interfaces:**
- Produces: Tailwind classes `font-display`, `bg-brand`, `text-brand-ink`, `bg-heat-0` … `bg-heat-4`; `h1,h2,h3` default to `font-display`; `.label-mono` / `.eyebrow` become sentence-case styles.

- [ ] **Step 1: Swap fonts in `app/layout.tsx`**

Replace the Geist import and both font constants with:

```tsx
import { Bricolage_Grotesque, DM_Mono, Hanken_Grotesk } from 'next/font/google';

// Bricolage for headings and big figures, Hanken for everything a person
// reads, DM Mono for what a machine produced (dates, counts, paths).
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-src',
  display: 'swap',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-src',
  display: 'swap',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});
```

and the body className:

```tsx
className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}
```

- [ ] **Step 2: Dark default in `providers/theme-provider.tsx`**

```tsx
<NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
```

- [ ] **Step 3: `@theme inline` in `app/globals.css`**

Replace the two font lines:

```css
  --font-sans: var(--font-sans-src);
  --font-mono: var(--font-mono-src);
  --font-display: var(--font-display-src);
```

(The `-src` suffix matters: `--font-display: var(--font-display)` would be a circular custom property and resolve to nothing.)

After `--color-iris-ink: var(--iris-ink);` add:

```css
  --color-brand: var(--brand);
  --color-brand-ink: var(--brand-ink);
  --color-heat-0: var(--heat-0);
  --color-heat-1: var(--heat-1);
  --color-heat-2: var(--heat-2);
  --color-heat-3: var(--heat-3);
  --color-heat-4: var(--heat-4);
```

- [ ] **Step 4: Replace the whole `:root { … }` block (light)**

```css
:root {
  /* 14px base: sm 10 (controls), md 12, lg 14 (cards), xl 18 (shell panels). */
  --radius: 0.875rem;

  /* Warm off-white ground, white panels. Lime stays a fill here; lime as text
     uses --brand-ink, which is darkened until it clears 4.5:1 on white. */
  --background: oklch(0.966 0.004 106.5);
  --surface: oklch(0.966 0.004 106.5);
  --foreground: oklch(0.205 0.012 270.8);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.205 0.012 270.8);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.205 0.012 270.8);

  /* Primary is lime in both themes, always with near-black text on it. */
  --primary: oklch(0.913 0.165 120.2);
  --primary-foreground: oklch(0.165 0.009 274.3);
  --secondary: oklch(0.942 0.007 106.5);
  --secondary-foreground: oklch(0.205 0.012 270.8);
  --muted: oklch(0.942 0.007 106.5);
  --muted-foreground: oklch(0.51 0.015 266.6);
  --accent: oklch(0.942 0.007 106.5);
  --accent-foreground: oklch(0.205 0.012 270.8);
  --destructive: oklch(0.594 0.191 25.1);

  --border: oklch(0.911 0.008 106.6);
  --line: oklch(0.911 0.008 106.6);
  --input: oklch(0.883 0.009 106.6);
  --ring: oklch(0.514 0.124 126.2);

  /* The one accent. */
  --brand: oklch(0.913 0.165 120.2);
  --brand-ink: oklch(0.514 0.124 126.2);

  /* Validation palette — meaning, not mood. */
  --signal: oklch(0.614 0.15 152.3);
  --signal-foreground: oklch(1 0 0);
  --warn: oklch(0.729 0.145 77.7);
  --fail: oklch(0.594 0.191 25.1);
  /* Category/data colour only (stored tone 'iris'). Not the accent. */
  --iris: oklch(0.525 0.196 268.5);

  /* Text-safe variants, ≥4.5:1 on card, background and muted (checked). */
  --signal-ink: oklch(0.467 0.11 153.1);
  --warn-ink: oklch(0.508 0.108 73.3);
  --fail-ink: oklch(0.501 0.181 26.8);
  --iris-ink: oklch(0.452 0.18 267.1);

  /* Activity heatmap ramp: empty → most. */
  --heat-0: oklch(0.942 0.007 106.5);
  --heat-1: oklch(0.934 0.087 118.5);
  --heat-2: oklch(0.868 0.152 121.9);
  --heat-3: oklch(0.726 0.167 125.8);
  --heat-4: oklch(0.514 0.124 126.2);

  --chart-1: var(--iris);
  --chart-2: var(--brand-ink);
  --chart-3: var(--warn);
  --chart-4: var(--fail);
  --chart-5: var(--signal);

  --sidebar: var(--background);
  --sidebar-foreground: oklch(0.205 0.012 270.8);
  --sidebar-primary: oklch(0.913 0.165 120.2);
  --sidebar-primary-foreground: oklch(0.165 0.009 274.3);
  --sidebar-accent: oklch(0.911 0.008 106.6);
  --sidebar-accent-foreground: oklch(0.205 0.012 270.8);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}
```

- [ ] **Step 5: Replace the whole `.dark { … }` block**

```css
.dark {
  /* Near-black ground, raised panels one step lighter, wells back down to the
     ground. Depth is surface stacking plus hairlines, never shadow. */
  --background: oklch(0.165 0.009 274.3);
  --surface: oklch(0.165 0.009 274.3);
  --foreground: oklch(0.925 0.007 88.6);
  --card: oklch(0.205 0.012 270.8);
  --card-foreground: oklch(0.925 0.007 88.6);
  --popover: oklch(0.231 0.014 266.9);
  --popover-foreground: oklch(0.925 0.007 88.6);

  --primary: oklch(0.913 0.165 120.2);
  --primary-foreground: oklch(0.165 0.009 274.3);
  --secondary: oklch(0.239 0.014 267);
  --secondary-foreground: oklch(0.925 0.007 88.6);
  --muted: oklch(0.239 0.014 267);
  --muted-foreground: oklch(0.65 0.02 269);
  --accent: oklch(0.239 0.014 267);
  --accent-foreground: oklch(0.925 0.007 88.6);
  --destructive: oklch(0.723 0.148 21.4);

  --border: oklch(0.269 0.017 270.7);
  --line: oklch(0.269 0.017 270.7);
  --input: oklch(0.301 0.019 268.1);
  --ring: oklch(0.913 0.165 120.2);

  --brand: oklch(0.913 0.165 120.2);
  --brand-ink: oklch(0.913 0.165 120.2);

  --signal: oklch(0.787 0.155 153.6);
  --signal-foreground: oklch(0.165 0.009 274.3);
  --warn: oklch(0.843 0.12 82.6);
  --fail: oklch(0.723 0.148 21.4);
  --iris: oklch(0.712 0.149 268.9);

  --signal-ink: oklch(0.84 0.149 155.5);
  --warn-ink: oklch(0.843 0.12 82.6);
  --fail-ink: oklch(0.781 0.112 19.9);
  --iris-ink: oklch(0.779 0.112 271.3);

  --heat-0: oklch(0.239 0.014 267);
  --heat-1: oklch(0.385 0.069 125.2);
  --heat-2: oklch(0.589 0.128 126);
  --heat-3: oklch(0.784 0.159 123.9);
  --heat-4: oklch(0.913 0.165 120.2);

  --chart-1: var(--iris);
  --chart-2: var(--brand);
  --chart-3: var(--warn);
  --chart-4: var(--fail);
  --chart-5: var(--signal);

  --sidebar: var(--background);
  --sidebar-foreground: oklch(0.925 0.007 88.6);
  --sidebar-primary: oklch(0.913 0.165 120.2);
  --sidebar-primary-foreground: oklch(0.165 0.009 274.3);
  --sidebar-accent: oklch(0.239 0.014 267);
  --sidebar-accent-foreground: oklch(0.925 0.007 88.6);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}
```

- [ ] **Step 6: Base headings + utilities**

In `@layer base` add after the `body` rule:

```css
  /* Headings are the display voice everywhere; size and tracking stay at the call site. */
  h1,
  h2,
  h3 {
    @apply font-display;
  }
```

In `@layer utilities` replace `.label-mono`, `.eyebrow` and delete `.text-gradient-signal` (its only user, the hero, is rewritten in Task 6):

```css
  /* Machine label: paths, ids, versions. Mono, sentence case, no tracking. */
  .label-mono {
    @apply font-mono text-xs text-muted-foreground;
  }

  /* Human label: section eyebrows. */
  .eyebrow {
    @apply text-sm font-medium text-muted-foreground;
  }
```

- [ ] **Step 7: Build**

Run: `pnpm build`
Expected: compiles. `grep -rn text-gradient-signal app components` lists only `components/home/hero-section.tsx`; that stale class is harmless (Tailwind ignores unknown classes) and Task 6 removes it.

- [ ] **Step 8: Commit**

```bash
git add app/globals.css app/layout.tsx providers/theme-provider.tsx
git commit -m "style: Night Studio tokens, fonts and dark default"
```

---

### Task 2: Reminder status logic

**Files:**
- Modify: `lib/journal.ts:1` (type-only import) and append new export
- Create: `scripts/check-journal.mjs`
- Modify: `package.json` (`scripts`)

**Interfaces:**
- Produces: `REMINDER_SLOTS: readonly [18, 22, 23]`; `type TReminderStatus = { kind: 'logged' } | { kind: 'next'; slot: number } | { kind: 'done' }`; `getReminderStatus(loggedToday: boolean, now: Date): TReminderStatus`.

- [ ] **Step 1: Make the types import strippable**

`lib/journal.ts:1`:

```ts
import type { INote } from '@/types';
```

(Node's type stripping keeps plain `import { X }` as a runtime import, which would fail to resolve `@/types`.)

- [ ] **Step 2: Write the failing check** — `scripts/check-journal.mjs`

```js
// Run: pnpm check:journal. Dhaka is UTC+6, so each instant below is written in
// UTC with its Dhaka wall time beside it.
import assert from 'node:assert/strict';
import { getReminderStatus } from '../lib/journal.ts';

const at = (iso) => new Date(iso);

assert.deepEqual(getReminderStatus(true, at('2026-09-24T16:30:00Z')), { kind: 'logged' }); // 22:30, logged
assert.deepEqual(getReminderStatus(false, at('2026-09-24T11:59:00Z')), { kind: 'next', slot: 18 }); // 17:59
assert.deepEqual(getReminderStatus(false, at('2026-09-24T12:30:00Z')), { kind: 'next', slot: 22 }); // 18:30
assert.deepEqual(getReminderStatus(false, at('2026-09-24T16:00:00Z')), { kind: 'next', slot: 23 }); // 22:00
assert.deepEqual(getReminderStatus(false, at('2026-09-24T17:10:00Z')), { kind: 'done' }); // 23:10
assert.deepEqual(getReminderStatus(false, at('2026-09-24T18:30:00Z')), { kind: 'next', slot: 18 }); // 00:30 next day

console.log('journal: ok');
```

Add to `package.json` `scripts`:

```json
"check:journal": "node --experimental-strip-types scripts/check-journal.mjs"
```

- [ ] **Step 3: Run it to see it fail**

Run: `pnpm check:journal`
Expected: FAIL — `SyntaxError: The requested module '../lib/journal.ts' does not provide an export named 'getReminderStatus'`.

- [ ] **Step 4: Implement** — append to `lib/journal.ts`

```ts
// ---------------------------------------------------------------------------
// Reminder status. Mirrors the backend's slots: a Telegram nudge fires at each
// of these Dhaka hours unless a note was logged that day.
// ---------------------------------------------------------------------------

export const REMINDER_SLOTS = [18, 22, 23] as const;

const hourFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: JOURNAL_TIME_ZONE,
  hour: '2-digit',
  hourCycle: 'h23',
});

export type TReminderStatus =
  | { kind: 'logged' }
  | { kind: 'next'; slot: number }
  | { kind: 'done' };

// A slot at the current hour has already fired, so "next" is strictly later.
export const getReminderStatus = (
  loggedToday: boolean,
  now: Date
): TReminderStatus => {
  if (loggedToday) return { kind: 'logged' };

  const hour = Number(hourFmt.format(now));
  const slot = REMINDER_SLOTS.find((s) => s > hour);

  return slot === undefined ? { kind: 'done' } : { kind: 'next', slot };
};
```

- [ ] **Step 5: Run it to see it pass**

Run: `pnpm check:journal`
Expected: `journal: ok` (an `ExperimentalWarning` line about type stripping is fine).

- [ ] **Step 6: Commit**

```bash
git add lib/journal.ts scripts/check-journal.mjs package.json
git commit -m "feat: derive next reminder slot from the journal day"
```

---

### Task 3: Shared components — category chip, page header, wordmark

**Files:**
- Modify: `lib/categories.ts`
- Modify: `components/common/category-label.tsx`
- Modify: `components/common/page-header.tsx`
- Create: `components/common/wordmark.tsx`

**Interfaces:**
- Produces: `CATEGORY_TONE_FILL: Record<TCategoryTone, string>`; `<Wordmark className? />` (lime square + "playground"; the text hides in a collapsed sidebar via the caller's class).

- [ ] **Step 1: `lib/categories.ts`** — replace `CATEGORY_TONE_CLASS`, `CATEGORY_FALLBACK_CLASS`, `CATEGORY_TONE_LABEL` and add the fill map:

```ts
// Chip: tinted fill, readable ink, no border.
export const CATEGORY_TONE_CLASS: Record<TCategoryTone, string> = {
  iris: 'bg-iris/12 text-iris-ink',
  signal: 'bg-signal/12 text-signal-ink',
  warn: 'bg-warn/15 text-warn-ink',
};

export const CATEGORY_FALLBACK_CLASS = 'bg-muted text-muted-foreground';

// Solid fills for bars and legend swatches.
export const CATEGORY_TONE_FILL: Record<TCategoryTone, string> = {
  iris: 'bg-iris',
  signal: 'bg-signal',
  warn: 'bg-warn',
};

// Human labels for the tone picker — a tone name is not a colour name.
export const CATEGORY_TONE_LABEL: Record<TCategoryTone, string> = {
  iris: 'Blue',
  signal: 'Green',
  warn: 'Amber',
};
```

- [ ] **Step 2: `components/common/category-label.tsx`** — replace the `className={cn(…)}` of the span:

```tsx
className={cn(
  'inline-flex shrink-0 items-center rounded-md font-medium',
  size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
  toneClassOf(category.tone),
  className
)}
```

Remove the now-unused `CATEGORY_FALLBACK_CLASS` import (`toneClassOf` already falls back).

- [ ] **Step 3: `components/common/page-header.tsx`**

- `BreadcrumbList` className → `"font-mono text-xs"`.
- `h1` className → `"text-2xl font-semibold tracking-[-0.02em] text-balance break-words sm:text-[2rem]"`.
- Update the doc comment's first line to: `Page header: mono route trail, display-face title, sans description,`.

- [ ] **Step 4: Create `components/common/wordmark.tsx`**

```tsx
import { cn } from '@/lib/utils';

// Lime square + name. The square is the one brand mark; it survives a
// collapsed sidebar, the text does not (callers hide it).
const Wordmark = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => (
  <span className={cn('flex items-center gap-2.5', className)}>
    <span aria-hidden="true" className="size-5 shrink-0 rounded-md bg-brand" />
    <span
      className={cn(
        'font-display text-lg font-bold tracking-[-0.02em] text-foreground',
        textClassName
      )}
    >
      playground
    </span>
  </span>
);

export default Wordmark;
```

- [ ] **Step 5: Lint + commit**

Run: `pnpm lint` — Expected: no new errors.

```bash
git add lib/categories.ts components/common/category-label.tsx components/common/page-header.tsx components/common/wordmark.tsx
git commit -m "style: tinted category chips, display page titles, wordmark"
```

---

### Task 4: Admin shell

**Files:**
- Modify: `components/layout/admin-layout.tsx`
- Modify: `components/layout/app-sidebar.tsx`
- Modify: `components/layout/dashboard-header.tsx:31`

**Interfaces:**
- Consumes: `Wordmark` (Task 3).

- [ ] **Step 1: Inset shell** — `components/layout/admin-layout.tsx`

Replace the header comment with `// Admin shell: sidebar sits on the page ground, content lives in one rounded card panel (shadcn's inset variant).` and the `SidebarInset` line with:

```tsx
<SidebarInset className="h-svh overflow-hidden bg-card md:h-[calc(100svh-1rem)] md:border md:border-line md:shadow-none">
```

- [ ] **Step 2: Sidebar** — `components/layout/app-sidebar.tsx`

- `<Sidebar collapsible="icon">` → `<Sidebar collapsible="icon" variant="inset">`.
- `SidebarHeader` className: drop `border-b border-line`.
- Replace the whole `<Link href="/" …>…</Link>` inside it with:

```tsx
<Link href="/" aria-label="playground home" className="rounded-md">
  <Wordmark textClassName="whitespace-nowrap group-data-[collapsible=icon]:hidden" />
</Link>
```

and add `import Wordmark from '../common/wordmark';`, remove `Code2` from the lucide import.
- `SidebarGroupLabel` text `/admin` → `Journal`, className → `"eyebrow mb-1 h-6 px-2"`.
- Delete the `{isActive && (<span … bg-primary … />)}` left-rule block and its comment.
- `SidebarMenuButton` (nav) className → `"h-10 gap-2.5 rounded-[10px] px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:font-medium data-[active=true]:text-foreground"`.
- `SidebarFooter` className: drop `border-t border-line`.

- [ ] **Step 3: Header on the card** — `components/layout/dashboard-header.tsx:31`

`bg-background` → `bg-card`.

- [ ] **Step 4: Check both sidebar states**

Run: `pnpm dev`, log in, open `/admin/dashboard` at 1280px, then press the sidebar trigger to collapse.
Expected: expanded — lime square + "playground", content in a rounded panel with a 8px gutter, no page scrollbar besides the panel's own. Collapsed — only the lime square, centred in the rail; panel still fits the viewport. At 390px the sidebar is an off-canvas sheet and the panel is full-bleed without border.

- [ ] **Step 5: Commit**

```bash
git add components/layout/admin-layout.tsx components/layout/app-sidebar.tsx components/layout/dashboard-header.tsx
git commit -m "style: inset admin shell with lime wordmark"
```

---

### Task 5: Admin dashboard

**Files:**
- Modify: `app/(admin)/admin/dashboard/_components/admin-dashboard-main-wrapper.tsx`
- Modify: `app/(admin)/admin/dashboard/_components/activity-calendar.tsx:12-20`

**Interfaces:**
- Consumes: `getReminderStatus`, `TReminderStatus`, `JOURNAL_TIME_ZONE` (Task 2 / existing), `CATEGORY_TONE_FILL` (Task 3).

- [ ] **Step 1: Heatmap ramp** — `activity-calendar.tsx`

```tsx
// The lime ramp is a token set (--heat-0..4) so light mode gets an olive ramp
// that still reads on white.
const LEVEL_CLASS = [
  'bg-heat-0',
  'bg-heat-1',
  'bg-heat-2',
  'bg-heat-3',
  'bg-heat-4',
];
```

Cells: in `Cell` and `Legend`, `rounded-sm` → `rounded-[3px]`; the legend's today swatch `bg-muted` → `bg-heat-0`.

- [ ] **Step 2: Imports and helpers in the wrapper**

Imports: remove `StatsCard`, and from lucide remove `Clock, FileText, TrendingUp` (keep `NotebookPen`, `Plus`). Add:

```tsx
import {
  JOURNAL_TIME_ZONE,
  getActivity,
  getJournalStats,
  getReminderStatus,
  TReminderStatus,
} from '@/lib/journal';
import { CATEGORY_TONE_FILL } from '@/lib/categories';
```

(replacing the existing `@/lib/journal` import).

Change `Panel`'s section className to `'flex flex-col overflow-hidden rounded-[14px] border border-border bg-surface'`.

Add below `Unavailable`:

```tsx
const todayFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: JOURNAL_TIME_ZONE,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

// One figure. The streak tile is the page's lime moment; the rest sit in wells.
const Tile = ({
  label,
  value,
  note,
  brand = false,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  brand?: boolean;
}) => (
  <div
    className={cn(
      'rounded-[14px] p-5',
      brand ? 'bg-brand text-primary-foreground' : 'border bg-surface'
    )}
  >
    <p
      className={cn(
        'text-sm font-medium',
        brand ? 'text-primary-foreground/75' : 'text-muted-foreground'
      )}
    >
      {label}
    </p>
    <p className="mt-1 truncate font-display text-[2.75rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
      {value}
    </p>
    {note ? (
      <p
        className={cn(
          'mt-2 font-mono text-xs',
          brand ? 'text-primary-foreground/75' : 'text-muted-foreground'
        )}
      >
        {note}
      </p>
    ) : null}
  </div>
);

const REMINDER_CHIP: Record<TReminderStatus['kind'], string> = {
  logged: 'bg-signal/12 text-signal-ink',
  next: 'bg-warn/15 text-warn-ink',
  done: 'bg-muted text-muted-foreground',
};

const reminderText = (status: TReminderStatus) =>
  status.kind === 'logged'
    ? 'Logged today'
    : status.kind === 'next'
      ? `Next reminder ${status.slot}:00`
      : 'No more reminders today';
```

- [ ] **Step 3: Derivations** — after `const activity = getActivity(notes);` add:

```tsx
const reminder = getReminderStatus(journal.loggedToday, new Date());
const unknown = '—';
```

Replace `peakTopicCount` with:

```tsx
const topicTotal = notesByTopic.reduce((sum, t) => sum + t.count, 0);
```

Delete the `dashboardStats` array.

- [ ] **Step 4: Header + tiles** — replace the `<PageHeader …/>` element and the `{/* KPIs … */}` grid with:

```tsx
<PageHeader
  eyebrow={todayFmt.format(new Date()).toLowerCase()}
  title="Overview"
  subtitle="Where the streak stands, what was logged, and what is still a draft."
  action={
    <>
      {notesUnavailable ? null : (
        <span
          className={cn(
            'rounded-full px-3 py-1.5 font-mono text-xs',
            REMINDER_CHIP[reminder.kind]
          )}
        >
          {reminderText(reminder)}
        </span>
      )}
      <Button asChild variant="outline" className="gap-2">
        <Link href="/admin/blogs/create-blog">New post</Link>
      </Button>
      <Button asChild className="gap-2">
        <Link href="/admin/notes/create-note">
          <Plus className="size-4" aria-hidden="true" />
          New note
        </Link>
      </Button>
    </>
  }
/>

<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
  <Tile
    brand
    label="Streak"
    value={notesUnavailable ? unknown : `${journal.currentStreak}d`}
    note={notesUnavailable ? undefined : `longest ${journal.longestStreak}d`}
  />
  <Tile
    label="This month"
    value={notesUnavailable ? unknown : journal.entriesThisMonth}
    note={notesUnavailable ? undefined : journal.monthLabel}
  />
  <Tile
    label="Topics touched"
    value={
      notesUnavailable || categoriesUnavailable
        ? unknown
        : `${topicsCovered}/${categories.length}`
    }
  />
  <Tile
    label="Current focus"
    value={notesUnavailable ? unknown : (focusCategory?.name ?? unknown)}
    note={
      focusCategory
        ? `${journal.focusNotes} ${journal.focusNotes === 1 ? 'note' : 'notes'} · ${journal.focusWindowDays}d`
        : undefined
    }
  />
</div>
```

- [ ] **Step 5: Row two** — delete the whole `<Panel label="Momentum">…</Panel>`; move the `<Panel label="Topics" …>` block (from row three) into row two in its place, and replace its non-empty branch (`<dl className="space-y-4 …">…</dl>`) with:

```tsx
<div className="space-y-4 px-4 py-4 sm:px-5">
  {/* The bar repeats the legend's numbers, so it stays decorative */}
  <div aria-hidden="true" className="flex h-3 gap-[3px] overflow-hidden rounded-full">
    {notesByTopic
      .filter((row) => row.count > 0)
      .map((row) => (
        <div
          key={row.category.id}
          className={cn('h-full', CATEGORY_TONE_FILL[row.category.tone] ?? 'bg-muted-foreground')}
          style={{ width: `${(row.count / Math.max(1, topicTotal)) * 100}%` }}
        />
      ))}
  </div>
  <dl className="space-y-2.5">
    {notesByTopic.map((row) => (
      <div key={row.category.id} className="flex items-center justify-between gap-3 text-sm">
        <dt className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn('size-2 rounded-[2px]', CATEGORY_TONE_FILL[row.category.tone] ?? 'bg-muted-foreground')}
          />
          {row.category.name}
        </dt>
        <dd className="font-mono text-xs tabular-nums text-muted-foreground">{row.count}</dd>
      </div>
    ))}
  </dl>
</div>
```

- [ ] **Step 6: Rows three and four** — row three is now `Recent notes` (2/3) + `Drafts` (1/3) (the existing row four, unchanged). `Recent posts` becomes the last row, full width: remove `className="xl:col-span-2"` from it, wrap it in a plain `<div>` instead of the `xl:grid-cols-3` grid, and set its meta to:

```tsx
meta={blogsUnavailable ? undefined : `${published.length} published · ${drafts.length} drafts`}
```

In all list rows replace `hover:bg-accent/40` with `hover:bg-muted/60`.

- [ ] **Step 7: Verify**

Run: `pnpm lint && pnpm build`
Expected: clean (no unused-import errors for `StatsCard`, `Clock`, `FileText`, `TrendingUp`).
Run: `pnpm dev`, open `/admin/dashboard` in dark and light.
Expected: lime streak tile, three well tiles, reminder chip matching the current Dhaka hour, heatmap in the lime (dark) / olive (light) ramp, segmented topic bar with legend, then notes + drafts, then posts.

- [ ] **Step 8: Commit**

```bash
git add "app/(admin)/admin/dashboard/_components"
git commit -m "feat: Night Studio dashboard with journal tiles and reminder chip"
```

---

### Task 6: Public header and landing

**Files:**
- Modify: `components/layout/header.tsx`
- Create: `components/home/hero-panel.tsx`
- Modify: `components/home/hero-section.tsx`
- Modify: `app/(homepage)/page.tsx`
- Delete: `components/home/stats-section.tsx`
- Modify: `app/(homepage)/form-playground/_components/form-playground-main-wrapper.tsx`

**Interfaces:**
- Consumes: `Wordmark`, `CATEGORY_TONE_FILL` (Task 3); `getAllBlogs({ enableCache })`, `getAllCategoriesAction()` (existing, both public).
- Produces: `HeroPanel` (async server component, no props); `HeroSection({ panel }: { panel: React.ReactNode })`.

- [ ] **Step 1: Header** — `components/layout/header.tsx`

`navigation` becomes:

```tsx
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Reading', href: '/blogs' },
  { name: 'Components', href: '/components' },
  { name: 'Forms', href: '/form-playground' },
];
```

(There is no public journal route — notes are private — so the mockup's "Journal" item is dropped.)

- Wordmark: replace the whole `<Link href="/" …>` contents with `<Wordmark />` (keep the Link, className `"flex shrink-0 items-center rounded-md"`), import `Wordmark from '../common/wordmark'`, drop `Code2` from lucide imports.
- Desktop `<ul>` className → `"mx-auto hidden items-center gap-1 rounded-full border bg-card p-1 lg:flex"`.
- Desktop link className → 

```tsx
cn(
  'flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
  isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
)
```

and delete the `{isActive && (<span … />)}` underline.
- Mobile panel link: `rounded-sm` → `rounded-[10px]`; delete the mono `{item.href}` span.
- Mobile toggle: `rounded-sm` → `rounded-[10px]`.

- [ ] **Step 2: Create `components/home/hero-panel.tsx`**

```tsx
import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { CATEGORY_TONE_FILL } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { IBlog, ICategory } from '@/types';

// Counted from the repo: previews registered on /components, and the
// challenges on /form-playground that have a working form.
const COMPONENT_COUNT = 5;
const CHALLENGE_COUNT = 9;

// Public figures only — notes are private, so the reading list stands in for
// activity. A failed fetch is unknown (—), never zero.
export async function HeroPanel() {
  let blogs: IBlog[] | null = null;
  let categories: ICategory[] = [];

  try {
    blogs = ((await getAllBlogs({ enableCache: true })).data ?? []) as IBlog[];
  } catch {
    blogs = null;
  }

  try {
    categories = (await getAllCategoriesAction()).data ?? [];
  } catch {
    categories = [];
  }

  const byTopic = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      count: blogs?.filter((blog) => blog.category === category.id).length ?? 0,
    }))
    .filter((topic) => topic.count > 0);
  const total = byTopic.reduce((sum, topic) => sum + topic.count, 0);

  const tiles = [
    { label: 'posts', value: blogs ? blogs.length : null },
    { label: 'components', value: COMPONENT_COUNT },
    { label: 'challenges', value: CHALLENGE_COUNT },
  ];

  return (
    <div className="rounded-[18px] border bg-card p-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Reading list by topic</span>
        <span className="font-mono text-muted-foreground">
          {blogs ? `${blogs.length} published` : '—'}
        </span>
      </div>

      {total > 0 ? (
        <>
          <div aria-hidden="true" className="mt-4 flex h-3 gap-[3px] overflow-hidden rounded-full">
            {byTopic.map((topic) => (
              <div
                key={topic.category.id}
                className={cn('h-full', CATEGORY_TONE_FILL[topic.category.tone] ?? 'bg-muted-foreground')}
                style={{ width: `${(topic.count / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {byTopic.map((topic) => (
              <li key={topic.category.id} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn('size-2 rounded-[2px]', CATEGORY_TONE_FILL[topic.category.tone] ?? 'bg-muted-foreground')}
                  />
                  {topic.category.name}
                </span>
                <span className="font-mono text-muted-foreground">{topic.count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {blogs ? 'Nothing published yet.' : 'Could not load the reading list.'}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-[14px] bg-surface p-3.5">
            <p className="font-display text-3xl font-semibold tracking-[-0.03em] tabular-nums">
              {tile.value ?? <span aria-label="count unavailable">—</span>}
            </p>
            <p className="text-sm text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Hero** — `components/home/hero-section.tsx`

- Remove the `ValidationConsole` import; signature → `export function HeroSection({ panel }: { panel: React.ReactNode })`.
- Replace the `<motion.p variants={item} className="eyebrow">…</motion.p>` with:

```tsx
<motion.p variants={item} className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
  <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
  reading · components · form challenges
</motion.p>
```

- Replace the `<motion.h1 …>…</motion.h1>` with:

```tsx
<motion.h1
  variants={item}
  className="mt-5 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl xl:text-[4.75rem]"
>
  Learning in public, <span className="text-brand-ink">logged daily.</span>
</motion.h1>
```

- Lede text → `A developer's study desk: what I'm reading, what I built to understand it, and the playgrounds where it gets tested.`
- Secondary button: `variant="outline"` → `variant="secondary"`.
- Grid: copy column `lg:col-span-5` → `lg:col-span-6`; the panel column:

```tsx
<motion.div variants={item} className="lg:col-span-6">
  {panel}
</motion.div>
```

- Section className: drop `border-b border-line`.

- [ ] **Step 4: Page** — `app/(homepage)/page.tsx`

Remove the `StatsSection` import and element; import `HeroPanel` from `@/components/home/hero-panel`; render `<HeroSection panel={<HeroPanel />} />`. Then:

Run: `git rm components/home/stats-section.tsx`

Check nothing else imported it: `grep -rn "stats-section" app components` → no output.

Dead-API check: `NEXT_PUBLIC_SERVER_URL=http://127.0.0.1:9 pnpm dev` (PowerShell: `$env:NEXT_PUBLIC_SERVER_URL='http://127.0.0.1:9'; pnpm dev`), open `/`.
Expected: panel says "Could not load the reading list.", header figure `—`, posts tile `—`, components 5, challenges 9. No crash. Stop the server.

- [ ] **Step 5: Console moves** — `form-playground-main-wrapper.tsx`

Add `import { ValidationConsole } from '@/components/home/validation-console';` and, directly after the closing `</header>`, insert:

```tsx
{/* Live Zod demo — moved here from the landing hero */}
<div className="mt-8">
  <ValidationConsole />
</div>
```

- [ ] **Step 6: Build + commit**

Run: `pnpm lint && pnpm build` — Expected: clean.

```bash
git add components/layout/header.tsx components/home "app/(homepage)/page.tsx" "app/(homepage)/form-playground/_components/form-playground-main-wrapper.tsx"
git commit -m "feat: pill nav and public reading-list hero panel"
```

---

### Task 7: Sweep — accent, labels, radii

**Files (modify):**
- `app/(homepage)/blogs/[slug]/_components/blog-details-main-wrapper.tsx:56`
- `app/(homepage)/blogs/_components/all-blogs-main-wrapper.tsx:45`
- `components/home/latest-blogs-section.tsx:29`
- `components/forms/shadcn/form-text-editor.tsx:450`
- the `uppercase` files: `app/(admin)/admin/blogs/create-blog/_components/create-blog-form.tsx`, `app/(admin)/admin/notes/create-note/_components/notes-timeline.tsx`, `app/(admin)/admin/notes/create-note/_components/quick-note-form.tsx`, `app/(auth)/auth/login/_components/login-form.tsx`, `app/(auth)/auth/signup/_components/signup-form.tsx`, `app/(homepage)/blogs/_components/all-blogs-main-wrapper.tsx`, `app/(homepage)/components/_components/demos/data-demos.tsx`, `app/(homepage)/components/_components/demos/form-demos.tsx`, `app/(homepage)/components/_components/demos/overlay-demos.tsx`, `app/(homepage)/components/_components/specimen.tsx`, `app/(homepage)/form-playground/_components/challenge-tab-button.tsx`, `app/(homepage)/form-playground/_components/challenges-tab-container.tsx`, `app/(homepage)/form-playground/_components/challenges-tab-content-container.tsx`, `components/common/status-pill.tsx`, `components/forms/shadcn/form-image-uploader.tsx`, `components/forms/shadcn/form-text-editor.tsx`, `components/forms/shadcn/form-textarea.tsx`, `components/home/validation-console.tsx`, `components/showcase/component-sidebar.tsx`
- `app/tiptap-content.css` (or wherever `tiptap-content.css` lives — `find . -name tiptap-content.css -not -path ./node_modules/*`)

- [ ] **Step 1: Accent uses of `iris` → `brand`**

| File:line | From | To |
|---|---|---|
| `blog-details-main-wrapper.tsx:56` | `bg-iris` | `bg-brand` |
| `all-blogs-main-wrapper.tsx:45` | `text-iris-ink` | `text-brand-ink` |
| `latest-blogs-section.tsx:29` | `bg-iris` | `bg-brand` |
| `form-text-editor.tsx:450` | `[&_a]:text-iris-ink` | `[&_a]:text-brand-ink` |

`components/common/stats-card.tsx` keeps `iris` (it's a tone map, used by the showcase).

- [ ] **Step 2: Drop shouting labels**

In each `uppercase` file above, on elements that also carry `font-mono` or `eyebrow`/`label-mono`, delete `uppercase` and any `tracking-[0.1…em]` / `tracking-[0.2…em]` / `tracking-widest` on the same element. Leave `uppercase` alone on `<kbd>` and inside `components/ui/`.

Check: `grep -rn "uppercase" app components --include=*.tsx | grep -v components/ui | grep "font-mono\|label-mono\|eyebrow"` → no output.

- [ ] **Step 3: Custom radii**

Replace `rounded-sm` on custom (non-`components/ui`) buttons, inputs and nav items with `rounded-[10px]`, and `rounded-lg` on custom cards/panels with `rounded-[14px]`:

Run: `grep -rln "rounded-sm\|rounded-lg" app components --include=*.tsx | grep -v components/ui` and edit each hit by that rule (heatmap cells and tiny swatches keep their small radius).

- [ ] **Step 4: TipTap content** — in `tiptap-content.css`: headings `font-family: var(--font-display)`; `code`/`pre` `font-family: var(--font-mono)` and `pre` background `var(--surface)` with `border: 1px solid var(--line)` and `border-radius: 14px`; links `color: var(--brand-ink)`.

- [ ] **Step 5: Build + commit**

Run: `pnpm lint && pnpm build` — Expected: clean.

```bash
git add -A app components
git commit -m "style: sweep accent, labels and radii onto Night Studio"
```

---

### Task 8: Docs

**Files:**
- Modify (full rewrite): `docs/design-system.md`
- Modify: `CLAUDE.md` (the `## Design` paragraph)

- [ ] **Step 1: Rewrite `docs/design-system.md`**

```markdown
# playground design system — Night Studio

Binding contract for every UI change. Spec and rationale:
`docs/superpowers/specs/2026-09-24-night-studio-redesign-design.md`.

## Direction

A developer's study desk at night: near-black ground, raised panels, one lime
accent, a characterful grotesk for headings. Dark is the default; light mode
is a full peer, not an afterthought. Not doing: glassmorphism, glows, gradient
washes or gradient text, emoji in headings, shadows on non-floating surfaces.

## Type

| Role | Family | Class |
|---|---|---|
| Headings, big figures | Bricolage Grotesque | `font-display` (default for `h1–h3`) |
| Body, UI | Hanken Grotesk | `font-sans` (default) |
| Machine text: dates, counts, paths, keys | DM Mono | `font-mono` |

Large headings: `font-bold`/`font-semibold`, tracking `-0.02em` to `-0.035em`.
Labels are sentence case — no uppercase letter-spaced labels. Mono means a
machine produced it, never prose.

## Colour

Semantic tokens only; a missing colour goes in `app/globals.css`.

| Token | Role |
|---|---|
| `background` / `card` / `surface` | Ground → raised panel → well inside a panel |
| `muted`, `line`/`border` | Hover/active fills; hairlines |
| `primary` | Lime CTA fill, dark text on it, both themes |
| `brand` | The one accent fill (streak tile, status dot, active mark) |
| `brand-ink` | Lime **as text**. Never use `text-brand`/`text-primary` for text |
| `iris` / `iris-ink` | Category/data colour (stored tone `'iris'`). Not an accent |
| `signal` / `warn` / `fail` (+ `-ink`) | Valid / pending / invalid. Functional only |
| `heat-0..4` | Activity heatmap ramp |

Accent budget: one lime element per region (dashboard: New note + streak tile).
Category chips: `bg-<tone>/12 text-<tone>-ink`, no border. Every `-ink` token
clears 4.5:1 on `card`, `background` and `muted` in both themes.

## Shape

Radius: custom controls `10px`, cards/tiles `14px`, shell panels `18px`
(`--radius: 0.875rem`; shadcn `rounded-md` = 12px is accepted). Depth is surface
stacking plus hairlines; shadows only on popovers, dropdowns, dialogs.

## Motion

Unchanged: short travel, small stagger, `prefers-reduced-motion` respected.
```

- [ ] **Step 2: `CLAUDE.md` Design paragraph** — replace the body under `## Design` with:

```markdown
**`docs/design-system.md` is binding — read it before any UI change.** Direction is
"Night Studio": dark-first study desk, raised panels, one lime accent. Use semantic
tokens only (`brand` / `brand-ink` / `signal` / `warn` / `fail` / `iris` / `surface` /
`line`) — never raw palette classes or hex; lime as text is always `text-brand-ink`.
Type: Bricolage Grotesque (`font-display`, headings), Hanken Grotesk (body), DM Mono
(machine text only).
```

- [ ] **Step 3: Commit**

```bash
git add docs/design-system.md CLAUDE.md
git commit -m "docs: Night Studio design system"
```

---

### Task 9: Verification

**Files:** none (fix-forward in the owning task's files if a check fails, then commit `fix: …`).

- [ ] **Step 1: Static checks**

Run: `pnpm lint && pnpm build && pnpm check:journal`
Expected: all clean, `journal: ok`.

- [ ] **Step 2: Grep guards**

```bash
grep -rn "geist" app components lib providers --include=*.tsx --include=*.ts --include=*.css -i
grep -rnE "text-(brand|primary)( |\"|')" app components --include=*.tsx | grep -v components/ui
grep -rnE "(zinc|emerald|slate|lime|indigo)-[0-9]" app components --include=*.tsx | grep -v components/ui
grep -rn "bg-iris\|text-iris" app components --include=*.tsx
```

Expected: first three print nothing; the last lists only `lib/categories.ts`-driven or `stats-card.tsx` tone uses (no accent uses).

- [ ] **Step 3: Dead API** — repeat Task 6 Step 4's dead-URL run on the final build. Expected: landing shows `—` for unknown figures and does not crash. (The dashboard's `—` tiles can't be reached this way — login needs the API — so they're covered by code review of Task 5 Step 4's `notesUnavailable` branches.)

- [ ] **Step 4: Dashboard reminder** — with the real API, open `/admin/dashboard`; compare the chip to the current Dhaka hour (e.g. 19:10 Dhaka, nothing logged → "Next reminder 22:00").

- [ ] **Step 5: Screenshots** — with the real API and the owner logged in, screenshot at 1280×800 and 390×844, dark and light (toggle via the header): `/`, `/blogs`, one `/blogs/[slug]`, `/components`, `/form-playground`, `/auth/login`, `/admin/dashboard`, `/admin/blogs`, `/admin/notes`, `/admin/notes/create-note`, `/admin/categories`.
Expected: no horizontal scroll at 390; pill nav hidden under `lg`; hero panel below the copy on mobile; dashboard tiles 2-up on mobile; no near-invisible lime text in light mode. If admin login is unavailable in the environment, ask the owner to sign in in the browser rather than handling credentials.
