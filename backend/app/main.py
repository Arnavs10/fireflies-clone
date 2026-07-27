from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import meetings, transcripts, action_items, search
from .seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fireflies Clone API",
    description="Meeting Notes & Transcription Platform API",
    version="1.0.0",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)
app.include_router(search.router)


@app.on_event("startup")
def on_startup():
    """Seed database on first startup."""
    seed_database()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "fireflies-clone-api"}
