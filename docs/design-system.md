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
(`--radius: 0.875rem`, so `rounded-sm` = 10px, `rounded-lg` = 14px,
`rounded-xl` = 18px; shadcn's `rounded-md` = 12px is accepted). Depth is surface
stacking plus hairlines; shadows only on popovers, dropdowns, dialogs.

## Motion

Unchanged: short travel, small stagger, `prefers-reduced-motion` respected.

## Modals

Every modal — details, edit, create, anything — is
`components/modal/common-modal.tsx`. Do not reach for `DialogContent` directly.

The shape is fixed: a **header that does not move** (title, optional
description, close button) over a **scrolling body**, and a footer that stays
put when one is passed. `CommonModal` is a flex column with `p-0`, so each
region owns its padding; only the body scrolls. `description` is optional and
`footer` is optional — nothing else is.

- Width lives in `className`: `sm:max-w-lg` for forms, `sm:max-w-2xl` for reading.
- A footer submit button is outside the `<form>`: give the form an `id` and the
  button `form="<that id>"`.
- Destructive confirmations keep using `components/modal/common-alert-modal.tsx`.

## Controls vs links

An underline means prose. A control — "View all", "Log a note", an empty
state's next step — is a `Button` (`ghost` for panel headers, `outline` for
empty states) with a chevron, never underlined text. Row titles get a row-level
`hover:bg-muted/50` instead of a hover underline.

## Dashboard shape

The journal is one panel, not a scoreboard: the lime streak block, the counted
ledger under it, and the heatmap share a single `18px` shell, because the streak
and the calendar are the same fact at two resolutions. Figures belong in that
ledger — label left, mono reading right — not in a row of identical big-number
tiles, which gave a category name the same weight as a streak. Below it the page
keeps one column split (narrow counted view, wide list) on every row.
