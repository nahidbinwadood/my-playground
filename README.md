# 🧪 Playground // Engineering Journal & Specimen Lab

A personal **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4** playground and study journal. Built with **shadcn/ui**, **Radix primitives**, and **Motion**, styled with the **Night Studio** instrument-inspired design system.

🔗 **Live Deployment:** [my-playground-sooty.vercel.app](https://my-playground-sooty.vercel.app)

---

## 📌 What This Is

This project serves as an **engineering sandbox and verified study journal**:

- 🧠 **Takeaways & Study Notes Archive (`/notes`)**: Handwritten takeaways, runtime observations, and architectural mental models documented while analyzing technical references. Features real-time topic filtering, keyword search, responsive grid/list view toggles, and an interactive markdown reader with syntax highlighting.
- 📚 **Curated Reading Ledger (`/blogs`)**: Structured reference materials and technical articles being actively studied.
- ⚡ **Interactive Form Playground (`/form-playground`)**: Real-world form-validation challenges, dynamic schema verification with Zod, and custom input components.
- 📊 **Private Journal Command Center (`/admin`)**: A private tracker calculating active streaks, monthly study volume, topic coverage, and daily activity heatmaps computed directly from note timestamps.
- ⏰ **Automated Study Reminders**: Integrated with Telegram via an external scheduler (cron-job.org) targeting Asia/Dhaka study windows (18:00 / 22:00 / 23:00) with idempotency guards.

---

## 🛠️ Tech Stack

### Core Framework & Architecture
- **[Next.js 16](https://nextjs.org/)** — App Router, Server Actions, Server Components, and 1-hour ISR caching (`cache: 'force-cache'`, `revalidateTag`).
- **[React 19](https://react.dev/)** — Latest React features and compiler compatibility.
- **[TypeScript 5](https://www.typescriptlang.org/)** — Strict, end-to-end type safety.
- **External REST Backend** — Decoupled Express 5 + Mongoose + Zod API via server actions (`actions/*.action.ts`).

### Styling & Visual Identity
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Modern `@theme` CSS token system.
- **[Night Studio Design System](docs/design-system.md)** — Instrument-styled aesthetic: hairline borders, semantic tokens (`signal`, `warn`, `iris`, `surface`, `line`), and dual typography (IBM Plex Sans for headings/prose, IBM Plex Mono for machine metrics).
- **[Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)** — Headless, accessible primitives (dialogs, tooltips, dropdowns, popovers).
- **[Motion](https://motion.dev/)** — Fluid reveals, micro-interactions, and scroll indicators.

### Markdown & Code Engine
- **[React Markdown](https://github.com/remarkjs/react-markdown)** & **[Remark GFM](https://github.com/remarkjs/remark-gfm)** — GitHub-flavored markdown parser.
- **[Rehype Highlight](https://github.com/rehypejs/rehype-highlight)** & **[Highlight.js](https://highlightjs.org/)** — Vibrant syntax highlighting with GitHub Dark theme and horizontally scrollable code containers.
- **[TipTap](https://tiptap.dev/)** — Rich-text editor for notes and blog drafting.

### Forms & Data
- **[React Hook Form](https://react-hook-form.com/)** & **[Zod 4](https://zod.dev/)** — Schema validation with reusable form controls.
- **[TanStack Table v8](https://tanstack.com/table)** — Headless data tables for administrative management.
- **[Sonner](https://sonner.emilkowal.ski/)** — Minimalist toast notifications.

---

## 📂 Project Architecture

```text
my-playground/
├── actions/                  # Next.js Server Actions (auth, blogs, notes, categories)
├── app/
│   ├── (homepage)/           # Public routes
│   │   ├── page.tsx          # Landing page (hero + validation console + live notes)
│   │   ├── blogs/            # Public reading ledger & blog detail pages
│   │   ├── notes/            # Public study notes archive & interactive reader
│   │   ├── form-playground/  # Validation challenges & interactive forms
│   │   └── components/       # UI specimen showcase
│   ├── (admin)/admin/        # Protected admin area
│   │   ├── dashboard/        # Dynamic study journal metrics & activity ledger
│   │   ├── notes/            # Quick-note creation, table index & editor
│   │   ├── blogs/            # Reference creation, draft manager & editor
│   │   └── categories/       # Taxonomy manager (tones, names, slugs)
│   ├── (auth)/auth/          # Sign-in & sign-up forms
│   └── globals.css           # Tailwind v4 theme tokens & utility classes
├── components/
│   ├── common/               # Shared badges, wordmark, theme toggler, reading dialog
│   ├── forms/shadcn/         # Reusable form primitives (input, select, editor)
│   ├── home/                 # Landing page sections, hero panel, motion reveals
│   ├── layout/               # Header, navigation, footer
│   ├── tables/               # Generic TanStack data table wrappers
│   └── ui/                   # Base Radix / shadcn UI components
├── lib/
│   ├── cache-fetch.ts        # Revalidation & cache helper
│   ├── journal.ts            # Asia/Dhaka time calculations, streaks, ledger aggregates
│   ├── categories.ts         # Tone-to-class color mappings
│   └── utils.ts              # Class merging & markdown teaser cleaner
└── types/                    # Shared interfaces (INote, IBlog, ICategory, IUser)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v10.x` or higher

### 2. Clone & Install

```bash
git clone https://github.com/nahidbinwadood/my-playground.git
cd my-playground
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API base URL
NEXT_PUBLIC_SERVER_URL=https://playground-backend-rho.vercel.app/api/v1
NEXT_PUBLIC_ENV=development
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the local dev server using Turbopack |
| `pnpm build` | Compiles and builds the production bundle |
| `pnpm start` | Runs the production build locally |
| `pnpm lint` | Runs ESLint checks across the codebase |
| `pnpm check:journal` | Validates Dhaka timezone streak & journal calculation scripts |

---

## 🔒 Constraints & Deployment Rules

- **Hosting & Deployments:** The project is deployed by the repository owner on Vercel. Automated bots/agents do not run `git push` or trigger deployments directly.
- **Free Tier Commitment:** Built strictly within free-tier limitations (Vercel Hobby + external free Telegram bot + cron-job.org).
- **Zero Synthetic Counters:** Every metric on the dashboard and public ledger is calculated directly from note records at request time—no artificial mock data.

---

## 📄 License

This repository is maintained for personal research, study notes, and frontend experiments. Feel free to reference the architectural patterns and UI components.
