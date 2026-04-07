# Defence Aspirant Learning Platform

Structured video-first learning platform for defence aspirants, built with Next.js App Router, Tailwind CSS, MongoDB, and custom JWT authentication.

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB (Atlas recommended)
- Custom JWT auth with HttpOnly cookies

## Current access model

- A single host account manages who can use the platform.
- New signups are normal users with `status="pending"`.
- Pending users cannot access protected pages until host approval.
- Host approves/rejects/removes users from `/host`.

## Project structure

- `app/` - Next.js routes (auth, dashboard, subjects, host panel, API)
- `components/` - Shared UI and layout components
- `lib/` - Database, auth, JWT, and JSON loader utilities
- `links/` - JSON source files (one per subject), used directly at runtime
- `proxy.ts` - Global auth and role-based access protection

## Environment variables

Copy `.env.example` to `.env.local` and fill values.

Required:

- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_BASE_URL`

Host seed controls:

- `DEFAULT_HOST_SEED_ENABLED` (`true` or `false`)
- `DEFAULT_HOST_NAME`
- `DEFAULT_HOST_EMAIL`
- `DEFAULT_HOST_PASSWORD`

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Key pages

- `/login` - email/password login
- `/signup` - normal user registration (awaits host approval)
- `/pending-approval` - blocked state for pending users
- `/dashboard` - list of subjects + search
- `/host` - host-only user management panel
- `/subjects/[subjectSlug]` - list of sessions (topics)
- `/subjects/[subjectSlug]/[topicId]` - video viewer with embedded player

## Production checklist

1. Use MongoDB Atlas for `MONGODB_URI`.
2. Use a strong random `JWT_SECRET`.
3. Set `NEXT_PUBLIC_BASE_URL` to the live domain.
4. Keep `DEFAULT_HOST_SEED_ENABLED=false` by default.
5. Temporarily set `DEFAULT_HOST_SEED_ENABLED=true` only when creating the first host.
6. Call `POST /api/dev/create-default-host` once.
7. Set `DEFAULT_HOST_SEED_ENABLED=false` again and redeploy.

## Deployment to Vercel

1. Push this project to GitHub/GitLab/Bitbucket.
2. Import repo in Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Deploy.
5. Run one-time host seed endpoint (if needed), then disable seed.

## MongoDB notes

- A unique index is automatically created for `users.email` on first user creation to prevent duplicates.
- Passwords are stored as secure hashes, not plain text.

