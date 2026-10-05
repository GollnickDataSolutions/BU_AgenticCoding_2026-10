"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routers import boards, columns, cards

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kanban API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(boards.router, prefix="/api")
app.include_router(columns.router, prefix="/api")
app.include_router(cards.router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
