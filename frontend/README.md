This is a [Next.js](https://nextjs.org) App Router project — the frontend for Wine Tracker. It talks to the `backend` app over HTTP only (see `src/lib/api-client.ts`); it never touches the database directly.

## Local development

```bash
cp .env.example .env.local   # set BACKEND_URL to the backend's local/deployed URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
