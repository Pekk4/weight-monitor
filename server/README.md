# Weight Monitor Server

Server is a minimal Express + TypeScript backend using SQLite (the `sqlite` and `sqlite3` packages).

Quick start:

```bash
cd server
npm install
npm start
```

Server runs at `http://localhost:4000` by default and exposes:

- `GET /api/weights` — returns all saved weights (sorted ascending by date)
- `POST /api/weights` — body: `{ date?: string (YYYY-MM-DD), weight: number }`
