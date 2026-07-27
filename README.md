<div align="center">

# 🔥 Fireflies Clone

### Meeting Notes & Transcription Platform

**A full-stack Fireflies.ai clone with AI meeting summaries, searchable transcripts, action items, and a premium split-panel UI.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![Status](https://img.shields.io/badge/status-deployed-success)

</div>

---

## ✨ Features

### Core Functionality
- **Meetings Dashboard** — Browse all meetings with search, type filters, and sorting
- **Split-Panel Detail View** — AI Summary + Key Topics on the left, searchable transcript on the right
- **Full CRUD** — Create, edit, and delete meetings with real-time updates
- **Action Items** — Add, edit, toggle completion, and delete action items per meeting
- **Interactive Transcript** — Click any speaker segment to seek the media player to that timestamp
- **Global Search** — Search across all meeting titles, summaries, transcripts, and action items
- **Export** — Download any meeting as Markdown or plain text

### Design & UX
- **Fireflies.ai Design Language** — Purple accent palette, DM Sans + Inter typography, glassmorphism cards
- **Dark Mode** — Full theme toggle with CSS custom properties
- **Responsive Layout** — Split panels stack vertically on tablet/mobile
- **Micro-animations** — Hover effects, slide transitions, skeleton loading states
- **Toast Notifications** — Auto-dismissing success/error/info toasts for all actions

### Technical
- **5 Pre-seeded Meetings** — Realistic multi-speaker transcripts with 15-17 segments each
- **Media Player** — Play/pause, seek bar, playback speed, auto-sync with transcript highlighting
- **12 REST API Endpoints** — Full CRUD for meetings, transcripts, action items, and search
- **Typed End-to-End** — TypeScript frontend with Pydantic backend schemas

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, CSS Custom Properties |
| Backend | FastAPI, Python, SQLAlchemy ORM |
| Database | SQLite with cascade deletes and JSON columns |
| Styling | Vanilla CSS design system (700+ lines) with dark mode |
| Typography | DM Sans (headings), Inter (body) via Google Fonts |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy pydantic python-multipart
python3 -m uvicorn app.main:app --reload --port 8000
```

The database is automatically created and seeded with 5 meetings on first startup.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
fireflies-clone/
├── frontend/                    # Next.js (TypeScript) App
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── layout.tsx       # Root layout with sidebar
│   │   │   ├── page.tsx         # Dashboard / Meetings Library
│   │   │   ├── globals.css      # Complete design system (700+ lines)
│   │   │   └── meetings/[id]/
│   │   │       └── page.tsx     # Meeting Detail (split panel)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar.tsx      # Icon sidebar with dark mode toggle
│   │   │   ├── Toast.tsx        # Toast notification system
│   │   │   └── CreateMeetingModal.tsx
│   │   └── lib/
│   │       ├── api.ts           # Typed API client + utilities
│   │       └── types.ts         # TypeScript interfaces
│   └── package.json
│
├── backend/                     # FastAPI (Python) API
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, startup
│   │   ├── database.py          # SQLite + SQLAlchemy setup
│   │   ├── models.py            # ORM models (3 tables)
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── seed.py              # 5 realistic meetings with transcripts
│   │   ├── routers/
│   │   │   ├── meetings.py      # Meeting CRUD
│   │   │   ├── transcripts.py   # Transcript endpoints
│   │   │   ├── action_items.py  # Action item CRUD
│   │   │   └── search.py        # Global search
│   │   └── services/
│   │       └── meeting_service.py  # Business logic
│   └── requirements.txt
│
└── README.md
```

---

## 🗄️ Database Schema

Three normalized tables with cascade deletes:

| Table | Description |
|-------|-------------|
| `meetings` | Title, date, duration, participants (JSON), summary, key topics, type, tags |
| `transcript_segments` | Speaker, text, timestamps, ordering — linked to meeting |
| `action_items` | Task text, assignee, completion status, due date — linked to meeting |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings` | List meetings (search, filter, sort) |
| `GET` | `/api/meetings/{id}` | Meeting detail with transcript & actions |
| `POST` | `/api/meetings` | Create meeting |
| `PUT` | `/api/meetings/{id}` | Update meeting |
| `DELETE` | `/api/meetings/{id}` | Delete meeting |
| `GET` | `/api/meetings/{id}/transcript` | Get transcript segments |
| `POST` | `/api/meetings/{id}/transcript` | Add transcript segments |
| `GET` | `/api/meetings/{id}/action-items` | List action items |
| `POST` | `/api/meetings/{id}/action-items` | Create action item |
| `PUT` | `/api/action-items/{id}` | Update / toggle action item |
| `DELETE` | `/api/action-items/{id}` | Delete action item |
| `GET` | `/api/search?q=...` | Global full-text search |

---

## 🎨 Design Decisions

- **Fireflies.ai visual language**: Purple (#7C5CFC) accents, light lavender backgrounds, clean card-based layout
- **Split-panel meeting view**: Summary/notes on the left, scrollable transcript on the right — mirrors the real Fireflies interface
- **CSS Custom Properties**: All colors, shadows, and spacing are tokenized for easy theming and the dark mode toggle
- **No external UI library**: All components are hand-built for full control over the design and minimal bundle size

---

## 📝 Assumptions & Mocked Data

- **Authentication**: Not implemented — the app assumes a single logged-in user
- **Audio transcription**: The media player simulates playback with transcript sync; real-time transcription is out of scope
- **AI summaries**: Pre-generated summaries and key topics are seeded (not generated at runtime)
- **5 seeded meetings**: Realistic multi-speaker meeting data is auto-seeded on first startup
- **Integrations/Team/Settings pages**: Shown as "Coming Soon" placeholder sections in the sidebar

---

## Contact

**Arnav Shukla** · arnavshuklaforbusiness@gmail.com

</div>
