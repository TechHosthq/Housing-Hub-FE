# Housing-Hub-FE — consumer web app

Next.js 16 (App Router, Turbopack) + Tailwind v4 + TypeScript. The renter and
property-owner facing site for Housing Hub, a Nigerian proptech platform.

Talks to `HousingHub.API` in the **`HousingHub`** repo (`../HousingHub`). The
admin dashboard is a third repo, `Housing-Hub-Admin`.

---

## Commands

```bash
npm run dev      # Turbopack dev server on :3000
npm run build    # production build — see the note on required env vars below
npm run lint
npx tsc --noEmit # typecheck alone; faster than a build when iterating
```

There is no test suite. `tsc --noEmit` and a real build are the verification
available — use both before claiming something works.

---

## Environment variables

`.env.example` is the reference and is kept current. Two are **required for a
production build** and will throw rather than fall back:

- `NEXT_PUBLIC_API_BASE_URL` — includes the API Gateway stage path (`/dev`)
- `NEXT_PUBLIC_S3_ORIGIN` — origin serving uploaded photos and video

They throw because they are baked in at build time. An unset value used to
default to dev, which meant a production deploy that forgot them served dev data
to real users and looked entirely healthy doing it. Local development still
falls back.

`NEXT_PUBLIC_ENABLE_REALTIME` should stay unset in any deployed environment —
see [SignalR](#signalr-is-off-in-deployed-environments).

Deployed on **Vercel**. Production ← `master`. Set variables per environment,
never globally.

---

## Structure

```
src/
  app/          App Router pages. Route = folder path.
  components/   Grouped by feature, mirroring app/ where sensible.
  services/     One module per API domain. Thin axios wrappers, typed.
  hooks/        One per domain. TanStack Query lives here, not in components.
  store/        Zustand. Client state only — never server data.
  types/        Shared interfaces, mirroring backend DTOs.
  providers/    QueryProvider, SignalRProvider, ThemeProvider, ToastProvider.
  lib/          Domain data and integrations (Nigerian states, Sentry, SignalR).
  utils/        Pure helpers.
```

### The service → hook → component pattern

Follow it; every domain already does.

**`services/xService.ts`** — one object of async functions. Each takes typed
arguments, calls `apiClient`, returns `response.data` typed as
`ApiResponse<T>`. No React, no caching, no error handling beyond what axios
does.

**`hooks/useX.ts`** — a single `useX()` returning queries and mutations.
Queries are nested factory functions (`useMyCases`, `useMyCase(id)`) so
components pass arguments. Mutations invalidate the query keys they affect.

**Components** call the hook. They never call a service directly and never
construct a query key.

Prefer invalidating over updating the cache by hand. The server frequently
recomputes derived state — what documents are still missing, whether a case can
be submitted — and reconstructing that client-side gets it wrong.

### State: which tool

| Kind | Where |
|---|---|
| Server data | TanStack Query, via a hook |
| Auth session, theme, toasts, KYC draft | Zustand store |
| One component's UI state | `useState` |

Server data does not belong in Zustand. `useAuthStore` holds the session, not
the user's properties.

---

## Things that have actually gone wrong

**CSP is enforcing, and it fails silently.** `next.config.ts` builds the policy.
A refused request looks like a broken feature, not an error — a blank panel, a
dead button, images that never appear. After touching anything that loads an
external resource, walk the site with the console open and look for
`Refused to ...`.

**A CSP source carrying a path matches only that exact path.** This is why every
API call once failed with `(blocked:csp)`: `NEXT_PUBLIC_API_BASE_URL` ends in
`/dev`, and feeding it to `connect-src` verbatim permitted precisely one URL.
Always pass URLs through `toOrigin()` before putting them in the policy.

**The S3 origin appears twice and both must agree** — the CSP (`img-src`,
`media-src`) and `images.remotePatterns`. They are derived from one variable so
they cannot drift. The two failures look nothing alike: a wrong `remotePattern`
throws a clear next/image error, a wrong CSP silently shows no images.

### SignalR is off in deployed environments

The API runs on Lambda behind an API Gateway **REST** API, which cannot hold a
WebSocket open. `Program.cs` does not map the hubs there, so
`/hubs/chat/negotiate` returning **404 is correct, not a bug**. Chat and
notifications fall back to polling, which works.

`NEXT_PUBLIC_ENABLE_REALTIME=true` is for local development against
`dotnet run`, where the hubs exist.

---

## Conventions

- **Comments explain why, not what.** The codebase is consistent about this;
  match it. A comment restating the line below it is noise.
- Tailwind core utility classes only.
- `lucide-react` for icons; `src/components/icons` for custom ones.
- Errors surface through `useToastStore` via the axios interceptor. Pass
  `skipErrorToast: true` when a form renders the failure inline instead.
- Dark mode is a class set by an inline script in `layout.tsx` before first
  paint, to avoid a flash. That script is why `script-src` needs
  `'unsafe-inline'`.
- **Never use `localStorage` for server data.** Zustand persistence is fine for
  session and theme.

---

## Related

| Repo | Path | Notes |
|---|---|---|
| `HousingHub` | `../HousingHub` | Both APIs. Start here for anything server-side. |
| `Housing-Hub-Admin` | `../Housing-Hub-Admin` | Admin dashboard, same patterns |

Adding a feature that needs a new endpoint is usually four changes: controller
and handler in `HousingHub`, then a type, a service function and a hook here.

`../HousingHub/docs/` holds the design documents — the verification pipeline,
the product roadmap, and the environment separation plan are all there.
