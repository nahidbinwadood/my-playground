# DevPlayground design system

Binding contract for every UI change. Read this before touching any component.

## Direction: "professional product UI"

The site is engineering equipment that happens to look like a product, not a
marketing page. It is dense, quiet, and high-contrast: real data, real states,
no decoration that does not carry meaning.

What we are deliberately **not** doing: glassmorphism, glows, neon gradients,
gradient text on every heading, emoji in headings, or "Build. Learn. Ship."
triplet copy. Those read as templated.

The previous direction was an explicitly "spec-sheet" aesthetic — IBM Plex, a
green accent, hairline grid guides everywhere. It was replaced because the mono
labels and green accent competed with the content. What survived from it: the
semantic type split, the hairline vocabulary, and the rule that structure should
encode something true.

## Color

Use semantic Tailwind tokens only. Never hardcode `emerald-500`, `zinc-950`,
`#10b981`, or any raw hex/palette class. If a color is missing, it belongs in
`app/globals.css`, not inline.

| Token | Class | Role |
|---|---|---|
| `--primary` | `bg-primary` `text-primary` | **Ink**, not a colour. Primary CTAs, active states. Near-black on light, near-white on dark. |
| `--iris` | `bg-iris` `border-iris` | **The one accent.** Indigo. Editorial marks, topic bars, one moment per viewport. |
| `--signal` | `bg-signal` `border-signal` | Validation fill: pass, published, resolved. |
| `--warn` | `bg-warn` `border-warn` | Validation fill: pending, draft, still open. |
| `--fail` | `bg-fail` `border-fail` | Validation fill: invalid, error, destructive. |
| `--signal-ink` | `text-signal-ink` | The readable form of the above. **Colored text uses these.** |
| `--warn-ink` | `text-warn-ink` | " |
| `--fail-ink` | `text-fail-ink` | " |
| `--iris-ink` | `text-iris-ink` | " |
| `--surface` | `bg-surface` | Recessed panel behind cards (code wells, terminals, table headers). |
| `--line` | `border-line` | Hairline rules and grid guides. |
| `--ring` | `outline-ring` | Focus only. |
| `background` / `card` / `muted` / `border` | standard shadcn | Everything else. |

Neutrals are **near-neutral graphite**: chroma is held between `0.001` and
`0.008` at a cool hue. Enough to stop large fields looking muddy, not enough to
read as a tinted theme.

**Primary is ink, not a brand colour.** A saturated primary button is the fastest
way to look templated. Do not reintroduce a coloured primary.

Validation colours are the only saturated colours in the interface, and they are
functional — this is a form-validation playground, so pass/warn/fail carry
identity. Green means valid, amber means unresolved, rose means invalid, on every
page. Never use them decoratively.

Accent budget: at most **one** `iris`-coloured element per viewport. If a section
already has an accent CTA, its cards do not get accent borders.

Depth comes from stacking surfaces (`background` → `card` → `surface`) separated
by hairlines — not from shadows. Shadows are allowed only on floating layers
(popovers, dropdowns, dialogs) so they read as detached.

## Type

**Geist Sans** for everything a human reads. **Geist Mono** for everything a
machine produced. Both are variable fonts loaded in `app/layout.tsx`; there is no
weight list to maintain.

- **Headings, body, UI**: `font-sans`. The default; do not declare it. Sentence
  case, tight tracking on display sizes.
- **Machine text**: `font-mono`. Route paths, file paths, slugs, numbers, counts,
  dates, table headers, keyboard hints, code, terminal output.

The split is semantic, not decorative: **mono means the string is something a
machine produced or consumes.** A panel heading a human wrote ("Recent posts")
is sans, even when a mono count sits beside it. Never set prose in mono.

Scale:

| Role | Classes |
|---|---|
| Page hero | `text-4xl sm:text-6xl font-semibold tracking-[-0.03em]` |
| Section heading | `text-2xl sm:text-3xl font-semibold tracking-tight` |
| Panel heading | `text-sm font-semibold tracking-tight` |
| Card title | `text-base font-semibold` |
| Body | `text-sm sm:text-base text-muted-foreground leading-relaxed` |
| Eyebrow / label | `.label-mono` utility |
| Data / stat | `font-mono tabular-nums` |
| Path / code | `font-mono` |

## Structure

- **Public page shell**: `mx-auto w-full max-w-7xl px-5 sm:px-8`.
- **Admin/dashboard pages are full-bleed.** The admin shell supplies padding
  (`p-4 sm:p-6`) and no max-width; do not wrap an admin page in `max-w-*`.
  Constrain individual text blocks (a lede, a form column) — never the page.
- Section rhythm: `py-20 sm:py-28` on public pages.
- Sections are introduced by a **route label**, not a number: `.label-mono`
  showing the real path the section maps to (`/components`, `/blogs`).
  Structure encodes something true. Do not add `01 / 02 / 03` counters unless
  the content is genuinely ordered.
- **Dashboards lay out as 2/3 + 1/3**: a KPI row across the top, then rows of
  `grid gap-4 xl:grid-cols-3` where the primary region takes `xl:col-span-2`.
  Prefer two columns over one long stack on wide screens.
- Separators: hairline `border-line` rules. No drop shadows for separation.
- Cards: `rounded-lg border border-border bg-card`. Hover state is a border
  colour shift or a background shift to `accent/40`, not a glow.
- Radius is `0.375rem` globally — keep corners tight; this is instrumentation.

## Data honesty

Non-negotiable, and the reason the dashboard was rebuilt:

- **Every figure is counted from the API at request time.** Never render seed,
  fixture, or sample data beside real data.
- **Unknown is not zero.** If a fetch fails, say the data could not be loaded and
  mark the value unavailable (an em dash or an explicit "missing, not zero"
  message). Do not print `0`, which reads as a fact.
- A failed fetch degrades one region, not the page. Other panels still render.

## Motion

`motion` (framer) is installed. Budget:

- One orchestrated page-load sequence per page (stagger ≤ 0.08s, y ≤ 12px).
- Scroll reveals use the existing `components/home/motion/reveal.tsx` with
  `viewport={{ once: true }}`.
- Hover micro-interaction on interactive cards only.
- Durations 0.2–0.5s, `ease-out`. No infinite ambient animation except the tech
  marquee and the terminal caret.
- `prefers-reduced-motion` is already handled globally in `globals.css`. Do not
  gate on it manually, but never put essential content behind an animation.

## Quality floor (non-negotiable)

- Responsive from 360px up. Test the mobile stack, not just `sm:`.
- Every interactive element is a real `<button>` / `<a>` / shadcn primitive with
  a visible `:focus-visible` ring (global) and an accessible name.
- Decorative layers get `aria-hidden="true"` and `pointer-events-none`.
- Text on colored surfaces meets 4.5:1. Do not put `text-muted-foreground` on
  `bg-primary`.
- **Colored text uses the `*-ink` token, never the raw fill.** The fills are
  tuned for dots, borders and tints; as small text on paper they fall under the
  floor (measured on white: `--signal` 4.0:1, `--warn` 2.8:1). The ink variants
  carry the same hue and chroma, moved only in lightness, and are verified at
  4.7:1 or better against the 10% tinted pill backgrounds — the least forgiving
  surface they land on.
- Images use `next/image`, always with `alt`.
- Loading skeletons mirror the real layout's shape and spacing.
- Empty states say what to do next, in the interface's voice, and link there.

## Copy

Plain, specific, active. Name what the reader controls. No exclamation marks,
no "Unleash", no "Supercharge", no feature-marketing adjectives. Buttons state
the action and keep the same word through the flow. Errors say what happened
and how to fix it.

## Utilities in `app/globals.css`

- `.label-mono` — eyebrow/label voice (mono, uppercase, tracked).
- `.dot-grid`, `.grid-guides` — decorative field textures; always `aria-hidden`.
- `.text-gradient-signal` — graphite-to-iris headline gradient, one per page.
- `.hide-scrollbar` — horizontal rails (e.g. the tech marquee).

`glow-signal` and the `sweep` animation were removed with the old direction. Do
not add glow utilities back.

## Reusable pieces

Prefer these over new one-offs:

- `components/home/motion/reveal.tsx` — scroll reveal wrapper
- `components/home/motion/count-up.tsx` — animated number
- `components/common/page-header.tsx`, `stats-card.tsx`, `status-pill.tsx`
- `components/ui/*` — shadcn primitives; do not hand-edit them
- `components/forms/shadcn/*` — RHF + Zod field wrappers
