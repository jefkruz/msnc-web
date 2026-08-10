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

## Netlify deployment

1. Push this repo to GitHub, then in Netlify: **Add new site → Import an existing project → pick the repo**.
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables (Site settings → Environment variables):
   - `VITE_API_URL=https://api.missionsupportnetworkcenter.org`
   - `VITE_APP_NAME=MSNC Recruitment`
   - `NODE_VERSION=20`
4. `public/_redirects` (`/* /index.html 200`) is included, so deep links like `/login/applicant` work with client-side routing.

> Note: the API is cross-origin from the Netlify domain, so make sure
> `api.missionsupportnetworkcenter.org` allows CORS from your site URL.

## Notes

- Pages under `src/Pages` were migrated from the Inertia app.
- `@inertiajs/react` is aliased to `src/lib/inertia.jsx` (Link, usePage, useForm, router) so existing page code keeps working against the JSON API.
- Each route loads page data via `ApiPage` from the matching `/api/...` endpoint.
