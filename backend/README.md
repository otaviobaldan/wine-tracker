# Wine Tracker — Backend

Standalone JSON API (Vercel serverless functions, file-based routing under `api/`). Owns the Postgres database (via Drizzle ORM + Neon) and all auth (JWT, bcrypt password hashes). No cookies — every protected route expects `Authorization: Bearer <token>`, so any future client (browser frontend, Apple Shortcuts, etc.) can call it the same way.

## Local development

```bash
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev             # runs `vercel dev`, requires the Vercel CLI
```

## Database

Schema lives in `lib/schema.ts`. After changing it:

```bash
npm run db:generate   # writes a new SQL migration under drizzle/
npm run db:migrate    # applies pending migrations to DATABASE_URL
```

## Seeding the 2 user accounts

No public sign-up. Set `SEED_OTAVIO_EMAIL` / `SEED_OTAVIO_PASSWORD` / `SEED_WIFE_EMAIL` / `SEED_WIFE_NAME` / `SEED_WIFE_PASSWORD` in `.env`, then:

```bash
npm run seed
```

Safe to re-run — existing emails are skipped.
