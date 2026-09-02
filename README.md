# MSNC Web

React SPA for the MSNC Recruitment portal. Talks to [`msnc-api`](../msnc-api).

## Stack

- React 18
- React Router 6
- Vite
- Tailwind CSS
- Axios (cookie credentials + Sanctum CSRF)

## Setup

```bash
cd msnc-web
npm install
cp .env.example .env   # optional
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api`, `/sanctum`, and `/storage` to the API (`VITE_API_URL`, default `http://localhost:8000`).

Production build (`npm run build`) reads `.env.production` and calls `https://api.missionsupportnetworkcenter.org`. The SPA is served from `https://missionsupportnetworkcenter.org`.

Deploy zip:

```bash
npm run build:zip
```

This deletes `dist/` and any previous `msnc-web.zip`, then builds a clean archive.

Unzip into the frontend docroot (`index.html` at the root). **Delete the existing `assets/` folder on the server first** (or empty the docroot) so old hashed JS like `index-C3_P_Zqn.js` is not left behind. Apache `.htaccess` is included for React Router.

## Notes

- Pages under `src/Pages` were migrated from the Inertia app.
- `@inertiajs/react` is aliased to `src/lib/inertia.jsx` (Link, usePage, useForm, router) so existing page code keeps working against the JSON API.
- Each route loads page data via `ApiPage` from the matching `/api/...` endpoint.
