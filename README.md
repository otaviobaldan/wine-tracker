# Wine Tracker

A private, 2-user web app for logging and browsing wines. Dark-themed, mobile-first, installable as a PWA.

## Layout

This is a monorepo with two independent apps, each deployed as its own Vercel project:

- `backend/` — standalone JSON API (Vercel serverless functions), owns the database and JWT auth. See [backend/README.md](backend/README.md).
- `frontend/` — Next.js App Router app, calls the backend over HTTP only. See [frontend/README.md](frontend/README.md).

There is no root `package.json` — each app is run independently (`cd backend` / `cd frontend`).

## First-time setup

1. **Provision Neon Postgres**: in the Vercel dashboard, add the Neon integration (Marketplace) to the `backend` project. This injects `DATABASE_URL`.
2. **Provision Vercel Blob**: create a Blob store and link it to both the `backend` and `frontend` projects (injects `BLOB_READ_WRITE_TOKEN` on each).
3. **Generate a JWT secret**: `openssl rand -hex 32`, set it as `JWT_SECRET` on the `backend` project.
4. **Run migrations**: from `backend/`, run `npx drizzle-kit migrate` with `DATABASE_URL` pointed at your Neon database.
5. **Seed the 2 user accounts**: from `backend/`, set `SEED_OTAVIO_EMAIL`/`SEED_OTAVIO_PASSWORD`/`SEED_WIFE_EMAIL`/`SEED_WIFE_NAME`/`SEED_WIFE_PASSWORD` locally and run `npm run seed`.
6. **Point the frontend at the backend**: set `BACKEND_URL` on the `frontend` project to the backend's deployed URL.

See each app's README for local dev instructions, and the root of this repo's deployment notes below.

## Local development

The backend's `npm run dev` runs `vercel dev`, which needs the [Vercel CLI](https://vercel.com/docs/cli) installed and the project linked to your Vercel account (`vercel link`, run once from `backend/`) so it can read the env vars you set in step 1–3 above. Run it in one terminal, then in a second terminal `cd frontend && npm run dev` with `BACKEND_URL=http://localhost:3000` (or whatever port `vercel dev` prints) in `frontend/.env.local`.

## Verifying it works

Once deployed (or running locally) with Neon migrated and the 2 accounts seeded:

**Backend**, replace `$BACKEND_URL` and `$TOKEN` as you go:

```bash
curl -X POST $BACKEND_URL/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"otavio@example.com","password":"..."}'
# → 200 with { token, user }

curl $BACKEND_URL/api/auth/me -H "Authorization: Bearer $TOKEN"
# → 200 with the user; omit the header and expect 401

curl -X POST $BACKEND_URL/api/wines -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"name":"Raquis","winery":"...","type":"Tinto","grape":"Malbec","grapeOrigin":"Argentina","whereTried":"Home","score":4,"personalFeels":"Great wine"}'
# → 201 with the created wine

curl $BACKEND_URL/api/wines -H "Authorization: Bearer $TOKEN"
curl "$BACKEND_URL/api/wines?type=Tinto&minScore=4" -H "Authorization: Bearer $TOKEN"
```

**Frontend**, in a browser: log in → confirm redirect to the wine list → add a wine (with a photo) → confirm it shows up → search/filter → open its detail view → edit it → delete it → log out → confirm `/` redirects back to `/login`. On a phone, use "Add to Home Screen" (iOS Safari) or the install prompt (Android Chrome) and confirm it opens standalone.

This full authenticated flow needs a real Neon database and can't be exercised in a sandboxed dev environment without one — everything up to this point (schema, migrations, build, typecheck, lint, and the unauthenticated `/login` screen) has been verified directly; run the checklist above once you've completed first-time setup.

## Deployment

Both projects track this same GitHub repo as separate Vercel projects:

- Backend project: Root Directory = `backend`, framework preset "Other".
- Frontend project: Root Directory = `frontend`, framework preset "Next.js".

Set an **Ignored Build Step** on each (Vercel project settings → Git) so a change to only one app doesn't trigger a wasted rebuild of the other, e.g. for the frontend project:

```
git diff HEAD^ HEAD --quiet -- frontend/
```

(inverted exit-code convention per Vercel's docs — a non-zero exit means "build".)
