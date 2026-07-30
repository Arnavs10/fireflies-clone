<div align="center">

# Fireflies Clone

### Meeting Notes & Transcription Platform

**A full-stack Fireflies.ai clone with AI meeting summaries, searchable transcripts, action items, and a premium split-panel UI.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)

**[Live Demo](https://fireflies-clone-psi.vercel.app)** · **[API Docs](https://fireflies-clone-uxaz.onrender.com/docs)**

</div>

---

## ✨ Features

### Core Functionality
- **Meetings Dashboard** — Browse all meetings with title search, type filters, and sorting by date, title, or duration
- **Split-Panel Detail View** — AI Summary + Key Topics on the left, searchable transcript on the right
- **Full CRUD** — Create, edit, and delete meetings, with the UI refreshing on each change
- **Action Items** — Add, edit, toggle completion, and delete action items per meeting
- **Interactive Transcript** — Click any speaker segment to seek the media player to that timestamp; the active segment highlights automatically as playback advances
- **Transcript Search** — Search within a meeting's transcript with matches highlighted inline
- **Global Search** — Search across all meeting titles, summaries, transcripts, and action items, with results grouped by meeting
- **Export** — Download any meeting as Markdown or plain text

### Design & UX
- **Fireflies.ai Design Language** — Purple accent palette, DM Sans + Inter typography, glassmorphism cards
- **Dark Mode** — Full theme toggle backed by CSS custom properties
- **Responsive Layout** — Split panels stack vertically on tablet/mobile
- **Micro-animations** — Hover effects, slide transitions, skeleton loading states
- **Toast Notifications** — Auto-dismissing success/error/info toasts for all actions

### Technical
- **5 Pre-seeded Meetings** — Realistic multi-speaker transcripts totalling 73 segments and 23 action items
- **Media Player** — Play/pause, seek bar, playback speed control, transcript sync
- **13 REST API Endpoints** — Full CRUD for meetings, transcripts, and action items, plus search and health
- **Typed End-to-End** — TypeScript interfaces on the client mirroring Pydantic schemas on the server

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, CSS Custom Properties |
| Backend | FastAPI, Python 3.11+, SQLAlchemy 2.x ORM |
| Database | SQLite with foreign-key cascade deletes and JSON columns |
| Validation | Pydantic v2 schemas at the API boundary |
| Styling | Vanilla CSS design system (700+ lines) with dark mode |
| Typography | DM Sans (headings), Inter (body) via Google Fonts |

---

## 🧭 Architecture Overview

Two independently deployable applications communicating over a REST API.

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│   Next.js 16 (App Router)   │         │      FastAPI (Python)        │
│                             │         │                              │
│  app/          pages        │  HTTP   │  routers/    HTTP + params   │
│  components/   UI + Context │ ──────▶ │  services/   business logic  │
│  lib/api.ts    typed client │  JSON   │  schemas.py  Pydantic I/O    │
│  lib/types.ts  interfaces   │ ◀────── │  models.py   SQLAlchemy ORM  │
└─────────────────────────────┘  CORS   └──────────────┬───────────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  SQLite         │
                                              │  3 tables       │
                                              └─────────────────┘
```

**Backend layering.** Three layers with one responsibility each:

- **Routers** (`routers/`) own HTTP concerns only — path and query parameters, status codes, and `404` handling. They contain no queries beyond existence checks.
- **Services** (`services/meeting_service.py`) own business logic — filtering, sorting, aggregating action-item counts, and the multi-source search. This keeps the logic reusable and testable independently of the HTTP layer.
- **Models** (`models.py`) own persistence — table definitions, relationships, and cascade rules.

**Pydantic as the contract boundary.** Separate `Create`, `Update`, and `Response` schemas per resource rather than one shared model. `Update` schemas have all-optional fields and are applied with `exclude_unset=True`, so a partial update only touches the fields the client actually sent. This also makes the schema an allowlist — fields like `id` and `created_at` can't be written from a request body.

**Session management.** A single `get_db()` dependency yields a scoped SQLAlchemy session per request and closes it in a `finally` block. `PRAGMA foreign_keys=ON` is set on each connection via an event listener, since SQLite disables foreign-key enforcement per-connection by default.

**Frontend state.** Local React state per page, with one Context for the global toast system. Data fetching goes through a single generic `fetchApi<T>()` wrapper that centralises the base URL, JSON headers, `204 No Content` handling, and error throwing — so every call site gets consistent typing and error behaviour.

### Request flow — toggling an action item

```
checkbox onChange
  → updateActionItem(id, { completed })          lib/api.ts
  → PUT /api/action-items/{id}                   fetch, JSON body
  → update_action_item()                         routers/action_items.py
  → ActionItemUpdate validation                  schemas.py
  → get_db() session                             database.py
  → SELECT → setattr → commit → refresh          SQLAlchemy
  → ActionItemResponse                           serialised via from_attributes
  → fetchMeeting() refresh → re-render           React
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```

The database is created and seeded with 5 meetings automatically on first startup. Seeding is idempotent — it checks for existing rows and skips if the database is already populated.

Interactive API docs are available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

To point the frontend at a non-local backend, set `NEXT_PUBLIC_API_URL`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url npm run dev
```

### Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://fireflies-clone-psi.vercel.app |
| Backend | Render | https://fireflies-clone-uxaz.onrender.com |
| API Docs | Render | https://fireflies-clone-uxaz.onrender.com/docs |

The frontend reads the backend base URL from `NEXT_PUBLIC_API_URL`; the backend allows the Vercel origin via CORS. Note that on Render's free tier the backend sleeps after inactivity, so the first request after an idle period takes roughly 30–60 seconds to cold-start.

---

## 📁 Project Structure

```
fireflies-clone/
├── frontend/                        # Next.js (TypeScript) App
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── layout.tsx           # Root layout — sidebar + toast provider
│   │   │   ├── page.tsx             # Dashboard / Meetings Library
│   │   │   ├── globals.css          # Design system (700+ lines)
│   │   │   ├── meetings/[id]/
│   │   │   │   └── page.tsx         # Meeting Detail (split panel)
│   │   │   ├── search/page.tsx      # Dedicated global search
│   │   │   └── integrations|team|settings/
│   │   │                            # Placeholder pages
│   │   ├── components/
│   │   │   ├── Sidebar.tsx          # Icon nav + dark mode toggle
│   │   │   ├── Toast.tsx            # Toast context + provider
│   │   │   └── CreateMeetingModal.tsx  # Form + transcript paste parser
│   │   └── lib/
│   │       ├── api.ts               # Typed API client + formatters
│   │       └── types.ts             # TypeScript interfaces
│   └── package.json
│
├── backend/                         # FastAPI (Python) API
│   ├── app/
│   │   ├── main.py                  # App instance, CORS, startup seed
│   │   ├── database.py              # Engine, session factory, FK pragma
│   │   ├── models.py                # ORM models (3 tables)
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── seed.py                  # 5 meetings with transcripts + tasks
│   │   ├── routers/
│   │   │   ├── meetings.py          # Meeting CRUD
│   │   │   ├── transcripts.py       # Transcript endpoints
│   │   │   ├── action_items.py      # Action item CRUD
│   │   │   └── search.py            # Global search
│   │   └── services/
│   │       └── meeting_service.py   # Business logic
│   ├── data/meetings.db             # SQLite database (auto-created)
│   └── requirements.txt
│
└── README.md
```

---

## 🗄️ Database Schema

Three tables — one parent and two children, both cascade-deleting with the meeting.

```
┌──────────────────────────────┐
│  meetings                    │
│  ─────────────────────────── │
│  id            INTEGER  PK   │
│  title         VARCHAR  NOT NULL
│  date          VARCHAR  NOT NULL   ISO 8601
│  duration      INTEGER  NOT NULL   seconds
│  participants  JSON     NOT NULL   ["Sarah Chen", ...]
│  summary       TEXT     NULL
│  key_topics    JSON     NULL
│  meeting_type  VARCHAR  DEFAULT 'general'
│  tags          JSON     NULL
│  created_at    VARCHAR  NOT NULL
│  updated_at    VARCHAR  NOT NULL
└──────────┬───────────────────┘
           │ 1
           ├──────────────────────────────┬────────────────────────────┐
           │ N                            │ N                          │
┌──────────▼─────────────────┐  ┌─────────▼──────────────────┐
│  transcript_segments       │  │  action_items              │
│  ───────────────────────── │  │  ───────────────────────── │
│  id             INTEGER PK │  │  id          INTEGER PK    │
│  meeting_id     FK CASCADE │  │  meeting_id  FK CASCADE    │
│  speaker        VARCHAR    │  │  text        TEXT NOT NULL │
│  text           TEXT       │  │  assignee    VARCHAR NULL  │
│  start_time     FLOAT      │  │  completed   BOOLEAN       │
│  end_time       FLOAT      │  │  due_date    VARCHAR NULL  │
│  segment_order  INTEGER    │  │  created_at  VARCHAR       │
└────────────────────────────┘  └────────────────────────────┘
```

### Schema decisions

**`duration` and timestamps in seconds.** Stored as integer seconds — the smallest unit the media player needs — and formatted for display at the UI layer rather than in the database.

**Dates as ISO 8601 strings.** SQLite has no native date type; it stores dates as TEXT, REAL, or INTEGER regardless. ISO 8601 sorts lexicographically in the same order it sorts chronologically, so `ORDER BY date` is correct. The tradeoff is that date arithmetic isn't expressible in SQL — on PostgreSQL this would be `TIMESTAMPTZ`.

**`start_time` alongside `segment_order`.** `start_time` drives player seeking and highlight sync; `segment_order` is the stable display sequence. They're kept separate because real transcripts can have overlapping speakers sharing timestamps while still needing a deterministic order.

**`participants`, `key_topics`, and `tags` as JSON columns.** These are denormalised into JSON arrays rather than split into join tables. The tradeoff was write simplicity for a seeded, single-user application — one insert per meeting instead of coordinating three tables. The cost is that filtering by participant or tag matches against serialised JSON rather than an indexed relation, and there's no referential integrity across name spellings. For a multi-user production version I would normalise `participants` and `tags` into `people` / `tags` lookup tables with `meeting_participants` / `meeting_tags` join tables keyed on `(meeting_id, entity_id)`. `key_topics` is display-only and never filtered on, so it would stay denormalised.

**Two cascade layers.** `ondelete="CASCADE"` on the foreign keys (enforced by SQLite via the `foreign_keys` pragma) and `cascade="all, delete-orphan"` on the ORM relationships. The ORM-level cascade is what actually runs on `db.delete(meeting)`; the database-level constraint guarantees integrity for any writes that bypass the ORM.

---

## 🌐 API Overview

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings` | List meetings — supports `search`, `participant`, `meeting_type`, `tag`, `sort_by`, `sort_order` |
| `GET` | `/api/meetings/{id}` | Meeting detail with transcript and action items |
| `POST` | `/api/meetings` | Create meeting, optionally with nested transcript segments and action items |
| `PUT` | `/api/meetings/{id}` | Partial update of meeting metadata |
| `DELETE` | `/api/meetings/{id}` | Delete meeting and cascade to its children |
| `GET` | `/api/meetings/{id}/transcript` | Transcript segments, ordered by `segment_order` |
| `POST` | `/api/meetings/{id}/transcript` | Bulk-add transcript segments |
| `GET` | `/api/meetings/{id}/action-items` | Action items for a meeting |
| `POST` | `/api/meetings/{id}/action-items` | Create action item |
| `PUT` | `/api/action-items/{id}` | Update or toggle action item |
| `DELETE` | `/api/action-items/{id}` | Delete action item |
| `GET` | `/api/search?q=...` | Global search across titles, summaries, transcripts, and action items |
| `GET` | `/api/health` | Health check |

**Conventions.** `201` on create, `204` on delete, `404` with a JSON `detail` message when a resource is missing, and `422` from Pydantic on validation failure. Action-item update and delete are addressed by the item's own globally unique ID rather than nested under the meeting, since the parent is redundant for lookup.

**Search behaviour.** `/api/search` performs case-insensitive substring matching (SQL `LIKE`) across four sources, tagging each result with its `match_type` so the UI can badge and group them. Summary matches return a surrounding snippet rather than the full text. This is substring search, not a stemmed full-text index — a production version would use SQLite FTS5 or a dedicated search engine.

---

## 🎨 Design Decisions

- **Fireflies.ai visual language** — Purple (`#7C5CFC`) accents, light lavender backgrounds, clean card-based layout
- **Split-panel meeting view** — Summary and notes on the left, scrollable transcript on the right, mirroring the real Fireflies interface
- **CSS Custom Properties** — All colors, shadows, and spacing tokenised, so dark mode is a single `data-theme` attribute swap rather than a duplicated stylesheet
- **No external UI library** — All components hand-built for full control over the design and a minimal bundle
- **Separate frontend and backend** — Chosen over Next.js API routes so the data layer could use Python's SQLAlchemy and Pydantic ecosystem, and so either side can be deployed or replaced independently. The cost is CORS configuration and maintaining type definitions in two languages.

---

## 📝 Assumptions & Scope

Per the assignment brief, the following are mocked or presented as placeholders:

- **Authentication** — Not implemented; the app assumes a single default logged-in user
- **Audio transcription** — The media player simulates playback and syncs the transcript; real speech-to-text is out of scope
- **AI summaries** — Summaries and key topics are seeded rather than generated at runtime
- **Real-time meeting bot** — Out of scope
- **Integrations / Team / Settings** — Present as "Coming Soon" placeholder pages

Additional implementation notes:

- **Meeting creation** accepts a form plus pasted transcript text, parsed into speaker-labelled segments with estimated timings. File upload (`.txt` / `.vtt` / `.json`) is not implemented.
- **Dashboard filtering** exposes title search, meeting type, and sort order in the UI. The API additionally supports `participant` and `tag` filters, which are available to API consumers but not surfaced as dashboard controls.
- **Seed data** covers 5 meetings across three meeting types, with 73 transcript segments and 23 action items, so the app is immediately usable on first run.

---

## Contact

**Arnav Shukla** · arnavshuklaforbusiness@gmail.com
