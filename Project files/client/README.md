# Customer Registry — Frontend

A single-file React app (React + React Router + Axios + Tailwind, all via CDN) for the
Customer Care Registry. No build step required — open the file directly or serve it
with any static server.

## Run it

**Option A — just open it:**
Double-click `index.html`, or open it directly in a browser.

**Option B — serve it (recommended, avoids any `file://` quirks):**
```bash
npx serve .
# or
python3 -m http.server 5500
```
Then visit the printed URL.

## Connect it to the backend

The app expects the backend API at:
```js
const API_BASE = "http://localhost:5000/api";
```
This is set near the top of the `<script type="text/babel">` block in `index.html`.
If your backend runs on a different port or host, update that one line.

Make sure the backend's CORS config allows requests from wherever you're serving this
file (the backend's `cors()` middleware with no options allows all origins, which is
fine for local development).

## How it's structured

Everything lives in one HTML file for easy review, split into clear sections marked
with `// ====` comment banners:

- **API client** — single Axios instance, JWT auto-attached from `localStorage`, auto-redirects to login on a 401
- **Auth context** — `login`, `register`, `logout`, current `user` (id, name, email, role)
- **Shared UI primitives** — `Button`, `Input`, `Select`, `Textarea`, `Card`, `Badge`, `Banner`, `Spinner`, `EmptyState`
- **Layout** — role-aware navbar (`Shell`) that shows different links for Customer / Agent / Admin
- **Pages**:
  - `LoginPage`, `RegisterPage`
  - `CustomerDashboard`, `NewComplaintPage`
  - `AgentDashboard`
  - `AdminDashboard`, `AdminUsersPage`
  - `ComplaintDetailPage` — shared by all three roles; the actions shown (assign agent,
    update status, leave feedback) change based on `user.role`
  - `MessageThread` — chat-style thread embedded in the complaint detail page
  - `ProfilePage`
- **Routing** — `HashRouter` (so it works from a plain static file with no server
  rewrite rules), with a `ProtectedRoute` wrapper that checks login + role

## Role behavior at a glance

| Role | Lands on | Can do |
|---|---|---|
| Customer | `/customer` | Submit complaints, view own complaints, message about them, rate resolution |
| Agent | `/agent` | View complaints assigned to them, update status, message customer |
| Admin | `/admin` | View all complaints, assign agents, update status, manage users, message |

## Styling

Tailwind is loaded via the CDN script (`cdn.tailwindcss.com`), which scans the page's
HTML for class names at runtime — so if you add new dynamic class names (e.g.
`` `text-${role}-600` ``), make sure the full class string also appears somewhere as a
literal in the file, or add it to the `tailwind.config` `safelist`. Dynamically built
class names that never appear as literal text won't be picked up.

## Known limitation

This CDN + in-browser Babel setup is meant for review and local development — it's
not optimized for production (no minification, JSX is compiled in the browser on each
load). For production, this would normally be migrated to a Vite or Create React App
project with a real build step.
