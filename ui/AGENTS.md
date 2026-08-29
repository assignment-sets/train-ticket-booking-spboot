# AGENTS.md

Train ticket booking app — React 19 + Vite 8 + Tailwind v4 (JSX, **no TypeScript**).

## Commands
- Install: `pnpm install` (project uses pnpm, has `pnpm-lock.yaml`)
- Dev server: `pnpm dev`
- Lint: `pnpm lint` (oxlint, config in `.oxlintrc.json`)
- Build: `pnpm build`
- There is **no test suite and no typecheck** (pure JS). Verify with `pnpm lint && pnpm build`.

## Architecture / wiring
- Routing: `react-router-dom` v7. `main.jsx` wraps `<App/>` in `<BrowserRouter>`. Routes live in `src/App.jsx`: `/login`, `/register`, and `/` (redirects to `/login` unless authenticated).
- API: axios instance in `src/api/client.js` with `baseURL "/api/v1"`. Endpoints: `src/api/auth.js` → `POST /auth/login`, `POST /auth/register`. A response interceptor throws an `Error` carrying the backend `ApiErrorResponse.message`.
- Auth state: `src/lib/auth.js` stores `token`/`email`/`role` in `localStorage`; `isAuthenticated()` gates the protected route.
- Pages: `src/pages/{LoginPage,RegisterPage}.jsx`. Shared UI: `src/components/`.

## Gotchas
- **Design system is defined in `src/index.css`** via a Tailwind v4 `@theme` block plus custom `@layer utilities` classes (`text-body-md`, `text-display-md`, `text-caption`, etc.). Use these tokens/utilities — not raw Tailwind defaults or hardcoded hexes. The full spec lives in `DESIGN.md` (colors: primary `#ff385c`, ink `#222222`, etc.).
- The API `baseURL` is `/api/v1` (relative). There is **no Vite proxy configured** — hitting the real backend from `pnpm dev` requires adding a `server.proxy` in `vite.config.js`.
- `index.html` `/src/main.jsx` load chain: do not add external asset references that break Vite's asset resolution.
