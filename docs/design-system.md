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
