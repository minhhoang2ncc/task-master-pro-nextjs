# Task Master Pro

A full-stack task management application built with **Next.js 16**, **Supabase**, and a **Turborepo** monorepo. Manage tasks with priorities, due dates, tags, subtasks, kanban boards, and rich-text descriptions — all as a **Progressive Web App** with offline support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| Rich Text | Tiptap v3 |
| State | Redux Toolkit + Redux Saga + redux-remember |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage) |
| PWA | Serwist + `@serwist/next` |
| Monorepo | Turborepo |
| Containerisation | Docker + Docker Compose |

---

## Monorepo Structure

```
.
├── apps/
│   └── web/               # Next.js application
│       └── src/
│           ├── app/       # App Router pages & layouts
│           │   ├── (auth)/   # Login & sign-up
│           │   ├── dashboard/
│           │   ├── board/    # Kanban board view
│           │   ├── task/[id]/
│           │   ├── analytics/
│           │   └── settings/
│           ├── api/       # API client layer (Axios)
│           ├── redux/     # Store, slices, sagas
│           ├── libs/      # Supabase client, utilities
│           └── shared/    # Shared components & hooks
├── packages/
│   ├── ui/                # Shared React component library
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utility functions
└── supabase/
    ├── migrations/        # SQL migration history
    └── schemas/           # Table schema definitions
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 10
- **Docker** & **Docker Compose** (recommended for running the app)
- A [Supabase](https://supabase.com) project

---

## Environment Variables

Copy `apps/web/.env` and fill in your own values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Session (generate with: openssl rand -base64 32)
SESSION_SECRET=

# Set to "true" only when running behind HTTPS
SECURE_COOKIES=false
```

> **Note:** `NEXT_PUBLIC_*` variables are inlined into the client bundle at **build time**. If you change them, rebuild the image.

---

## Getting Started

### Option A — Docker (recommended)

Builds an optimised production image and starts the server on port `3000`.

```bash
docker compose --env-file apps/web/.env up --build
```

Then open [http://localhost:3000](http://localhost:3000).

### Option B — Local dev server

```bash
npm install
npm run dev        # starts all Turborepo packages in watch mode
```

The web app will be available at [http://localhost:3000](http://localhost:3000) with hot-reload.

---

## Available Scripts

Run from the **workspace root**:

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps and packages |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint all packages |

---

## Database

Migrations live in `supabase/migrations/` and are applied via the [Supabase CLI](https://supabase.com/docs/guides/cli).

### Core schema

| Table | Description |
|---|---|
| `users` | User profiles, preferences, and notification settings |
| `tasks` | Tasks with title, description, priority, due date, tags, and status |
| `subtasks` | Checklist items nested under a parent task |

Row-Level Security (RLS) is enabled on all tables — users can only read and write their own data.

### Apply migrations

```bash
# Link to your remote project
supabase link --project-ref <project-ref>

# Push all pending migrations
supabase db push
```

---

## PWA

Task Master Pro is a Progressive Web App powered by [Serwist](https://serwist.pages.dev). The service worker (`sw.ts`) is auto-generated at build time and handles:

- **Offline caching** of static assets and API responses
- **Background sync** for deferred writes
- **Install prompt** on supported browsers

---

## Contributing

1. Fork the repository and create a feature branch.
2. Follow the existing code style (ESLint config is at `apps/web/eslint.config.mjs`).
3. Run `npm run lint` and ensure no errors before opening a PR.
4. Open a pull request against `main` with a clear description of your changes.
