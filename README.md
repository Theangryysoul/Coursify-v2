# Coursify

A single Next.js application for organising YouTube courses, tracking progress and
studying without the tab chaos.

The former Vite client and Express server now live in one App Router project:

- `src/app` — routes, layouts and API route handlers (`/api/v1/*`)
- `src/views` — page-level views
- `src/components`, `src/hooks`, `src/store` — UI and client state
- `src/lib/server` — models, services, validators and server helpers

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in the values
pnpm dev
```

Open <http://localhost:3000>.

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start the development server         |
| `pnpm build`      | Create a production build            |
| `pnpm start`      | Serve the production build           |
| `pnpm lint`       | Run ESLint                           |
| `pnpm typecheck`  | Run TypeScript without emitting      |

## Environment

Required:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Feature-specific (the related UI hides or returns a clear error when unset):

- `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google sign-in
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — avatars
- `YOUTUBE_API_KEY` — playlist import

`NEXT_PUBLIC_API_URL` defaults to `/api/v1`, which is served by the route handlers
in this same app.
