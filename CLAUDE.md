# CLAUDE.md

Context map for AI agents. Read this first — skip re-scanning the tree.

## What this is

Personal **Next.js 16 (App Router) + React 19 + TS + Tailwind v4** playground.
Three domains: UI component showcase, form-validation challenges, blog CMS
(public read + admin CRUD). shadcn/ui + Radix primitives, `motion` for animation.

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

- `(homepage)/` — public. `page.tsx` landing, `blogs/` + `blogs/[slug]`,
  `components/` (showcase), `form-playground/` (validation challenges).
- `(admin)/admin/` — protected. `dashboard/`, `blogs/` (table + create + edit),
  own `layout.tsx` (sidebar shell).
- `(auth)/auth/` — `login/`, `signup/`. Zod schemas colocated in `schema/`.

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

## Notes

- `docs/superpowers/specs/` — design specs for redesigns.
- Blog sample seed: `app/(homepage)/blogs/data/blogs.json`.
