# Weight Monitor (MVP)

This workspace contains a minimal fullstack TypeScript app for tracking daily morning weight.

- `server` — Express + TypeScript backend using SQLite (`sqlite` + `sqlite3`).
- `client` — Vite + React TypeScript frontend.

Quick start (two terminals):

1) Server

```bash
cd server
npm install
npm start
```

2) Client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5000` to use the UI. The client proxies `/api` calls to `http://localhost:4000`.
