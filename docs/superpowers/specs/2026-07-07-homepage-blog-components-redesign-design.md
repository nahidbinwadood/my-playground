# Homepage + Blog + Components Redesign — Design

Date: 2026-07-07

## Goal

Make the public site aesthetic, modern, and cool — a developer playground.
Add new homepage sections, redesign blogs list / blog details / blog card,
add showcase components, and add smooth animations with `motion`
(framer-motion). Emerald/teal accent site-wide (matches admin). Everything
token-based so light + dark both work.

## Principles

- Reuse existing pieces (`StatusPill`, `BlogCard`, new `Reveal`). No clones.
- Simple JSX + Tailwind tokens. One-line purpose comment per file; short "why"
  on non-obvious blocks.
- Animations subtle and smooth — no jank, respect reduced motion where trivial.
- New dependency: `motion`.

## Dependency

- `npm i motion` — import via `motion/react`.

## Reusable animation helpers — `components/home/motion/`

- `reveal.tsx` — `<Reveal>` client component. Fades + slides children up when
  they scroll into view (`whileInView`, `viewport={{ once: true }}`). Optional
  `delay` prop for stagger.
- `count-up.tsx` — `<CountUp value={n} />` client component. Animates 0→value
  when scrolled into view (`useInView` + `animate`).

## Homepage — `app/(homepage)/page.tsx`

Compose sections in this order. Each section is its own file in
`components/home/`:

1. **Hero** (`hero-section.tsx`, exists) — polish: staggered fade-in of
   badge/title/buttons using motion. Replace the static `Code2` box with the
   Terminal component (below).
2. **Tech marquee** (`tech-marquee.tsx`, NEW) — infinite horizontal scroll of
   tech badges: Next.js, React, TypeScript, Tailwind, Zod, tiptap, dnd-kit,
   recharts. CSS keyframes marquee, pause on hover. Duplicated list for seamless
   loop.
3. **Stats** (`stats-section.tsx`, NEW) — 3–4 `CountUp` stats (components,
   challenges, blog posts). Reveal on scroll. Counts can be hardcoded/derived
   constants — no backend.
4. **Features grid** (`features-section.tsx`, NEW) — bento/icon cards:
   Components, Form Challenges, Blog, Tech Stack. Emerald icon tiles, hover
   lift, staggered `Reveal`.
5. **Latest blogs** (`latest-blogs-section.tsx`, NEW) — 3 most-recent blogs
   (reuse `BlogCard`), "View all blogs" link. Reads the existing
   `blogs.json` data.
6. **Terminal** (`terminal.tsx`, NEW) — faux terminal card: mac traffic-light
   dots, a typed-out command + output lines, animated with motion (line-by-line
   reveal / caret). Used inside the hero visual slot. Pure presentational.
7. **CTA** (`cta-section.tsx`, exists) — keep; wrap in `Reveal`.

## Blog card — `app/(homepage)/blogs/_components/blog-card.tsx`

- Replace hardcoded `gray-*` classes with tokens (`border-border`,
  `text-muted-foreground`, `text-foreground`) so dark mode works.
- Add type badge (reuse the color map idea) and `StatusPill`.
- Author + date meta row. Hover: image zoom (exists) + card lift.

## Blogs list — `app/(homepage)/blogs/_components/all-blogs-main-wrapper.tsx`

- Add a page header (title "Blog" + subtitle).
- Staggered card reveal (wrap cards in `Reveal` with incremental delay).
- Empty state when no blogs.

## Blog details — `app/(homepage)/blogs/[slug]/_components/blog-details-main-wrapper.tsx`

- Replace hardcoded `gray-*`/`green`/`yellow` with tokens + `StatusPill`.
- Add reading-time estimate (words / 200, derived from stripped content).
- Nicer meta row (type badge, date, reading time).
- Keep `dangerouslySetInnerHTML` + `tiptap-content.css`.
- Wrap content in `Reveal`.

## Components showcase — `app/(homepage)/components/page.tsx`

Add 3 new entries to the `components` array (existing pattern: live
`component` node + `code` string, grouped by `category`):

- **Feature card** (category "Cards") — icon tile + title + description.
- **Testimonial card** (category "Cards") — avatar + quote + name/role.
- **Buttons & badges** (category "Elements") — button variants + gradient
  badges + status pills.

Sidebar already groups by category; no structural change needed.

## Out of scope

form-playground pages, auth, admin, server actions, data sources.

## Testing / verification

Presentational only — no unit-testable logic except reading-time (trivial,
derived). Verification = `npm run build` passes and manual check of homepage,
blogs list, a blog detail page, and components page in both light and dark
mode; confirm animations run and marquee loops.
