# DevPlayground design system

Binding contract for every UI change. Read this before touching any component.

## Direction: "working spec sheet"

The site is a piece of engineering equipment, not a SaaS landing page. Everything
on it actually runs — the components are live, the forms really validate. The
design says that: precise, instrument-like, legible under scrutiny, with one
loud moment per page and quiet discipline everywhere else.

What we are deliberately **not** doing: neon blob gradients behind everything,
glassmorphism on every card, a glow on every border, emoji in headings, or
"Build. Learn. Ship." triplet copy. Those read as templated.

## Color

Use semantic Tailwind tokens only. Never hardcode `emerald-500`, `zinc-950`,
`#10b981`, or any raw hex/palette class. If a color is missing, it belongs in
`app/globals.css`, not inline.

| Token | Class | Role |
|---|---|---|
| `--signal` | `text-signal` `bg-signal` `border-signal` | Primary accent. Success, pass, active, primary CTA. |
| `--warn` | `text-warn` `bg-warn` | Pending, draft, caution. |
| `--fail` | `text-fail` `bg-fail` | Invalid, error, destructive. |
| `--iris` | `text-iris` `bg-iris` | Secondary accent — blog/editorial surfaces only. |
| `--surface` | `bg-surface` | Recessed panel behind cards (code wells, terminals, table headers). |
| `--line` | `border-line` | Hairline rules and grid guides. |
| `background` / `card` / `muted` / `border` | standard shadcn | Everything else. |

Validation colors are brand colors here — this is a form-validation playground,
so pass/warn/fail carry identity, not just semantics. Use them consistently:
green means valid, amber means unresolved, rose means invalid, on every page.

Accent budget: at most **one** signal-colored element per viewport. If a section
already has a signal CTA, its cards do not get signal borders.

## Type

One superfamily, two roles — **IBM Plex Sans** and **IBM Plex Mono**. They share
a skeleton, so a mono label under a sans heading reads as one voice rather than
two fonts bolted together.

- **Headings, body, UI**: `font-sans` (IBM Plex Sans). The default; do not
  declare it. Sentence case, tight tracking on display sizes.
- **Machine text**: `font-mono` (IBM Plex Mono). Route paths, file paths,
  eyebrows and labels, numbers, code, table headers, keyboard hints, terminal
  and console output.

The split is semantic, not decorative: **mono means the string is something a
machine produced or consumes.** A heading a human wrote is sans, even in a
section whose label right above it is mono. Never set prose in mono.

Scale:

| Role | Classes |
|---|---|
| Page hero | `text-4xl sm:text-6xl font-semibold tracking-[-0.03em]` |
| Section heading | `text-2xl sm:text-3xl font-semibold tracking-tight` |
| Card title | `text-base font-semibold` |
| Body | `text-sm sm:text-base text-muted-foreground leading-relaxed` |
| Eyebrow / label | `.label-mono` utility |
| Data / stat | `font-mono tabular-nums` |
| Path / code | `font-mono` |

## Structure

- Page shell: `mx-auto w-full max-w-7xl px-5 sm:px-8`.
- Section rhythm: `py-20 sm:py-28`. Never stack two full-bleed gradients.
- Sections are introduced by a **route label**, not a number: `.label-mono`
  showing the real path the section maps to (`/components`, `/form-playground`,
  `/blogs`). Structure encodes something true. Do not add `01 / 02 / 03`
  counters unless the content is genuinely ordered.
- Separators: hairline `border-line` rules. No drop shadows for separation.
- Cards: `rounded-lg border border-border bg-card`. Hover state is a border
  color shift to `border-signal/40` plus `-translate-y-0.5`, not a glow.
- Radius is `0.5rem` globally — keep corners tight; this is instrumentation.

## Motion

`motion` (framer) is installed. Budget:

- One orchestrated page-load sequence per page (stagger ≤ 0.08s, y ≤ 12px).
- Scroll reveals use the existing `components/home/motion/reveal.tsx` with
  `viewport={{ once: true }}`.
- Hover micro-interaction on interactive cards only.
- Durations 0.2–0.5s, `ease-out`. No infinite ambient animation except the
  tech marquee and the terminal caret.
- `prefers-reduced-motion` is already handled globally in `globals.css`. Do not
  gate on it manually, but never put essential content behind an animation.

## Quality floor (non-negotiable)

- Responsive from 360px up. Test the mobile stack, not just `sm:`.
- Every interactive element is a real `<button>` / `<a>` / shadcn primitive with
  a visible `:focus-visible` ring (global) and an accessible name.
- Decorative layers get `aria-hidden="true"` and `pointer-events-none`.
- Text on colored surfaces meets 4.5:1. Do not put `text-muted-foreground` on
  `bg-signal`.
- Images use `next/image`, always with `alt`.
- Loading skeletons mirror the real layout's shape and spacing.
- Empty states say what to do next, in the interface's voice.

## Copy

Plain, specific, active. Name what the reader controls. No exclamation marks,
no "Unleash", no "Supercharge", no feature-marketing adjectives. Buttons state
the action and keep the same word through the flow. Errors say what happened
and how to fix it.

## Reusable pieces

Prefer these over new one-offs:

- `components/home/motion/reveal.tsx` — scroll reveal wrapper
- `components/home/motion/count-up.tsx` — animated number
- `components/common/page-header.tsx`, `stats-card.tsx`, `status-pill.tsx`
- `components/ui/*` — shadcn primitives; do not hand-edit them
- `components/forms/shadcn/*` — RHF + Zod field wrappers
