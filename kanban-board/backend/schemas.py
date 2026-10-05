"""Pydantic request/response schemas for the Kanban board API."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Label
# ---------------------------------------------------------------------------

class LabelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(..., min_length=4, max_length=7, pattern=r"^#[0-9a-fA-F]{3,6}$")


class LabelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    name: str
    color: str


# ---------------------------------------------------------------------------
# Card
# ---------------------------------------------------------------------------

class CardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    assignee_id: str | None = None
    due_date: date | None = None


class CardUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    assignee_id: str | None = None
    due_date: date | None = None


class CardMove(BaseModel):
    column_id: str = Field(..., min_length=1)
    position: int = Field(..., ge=0)


class CardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    column_id: str
    title: str
    description: str | None
    position: int
    assignee_id: str | None
    due_date: date | None
    created_at: datetime
    updated_at: datetime
    labels: list[LabelResponse]


# ---------------------------------------------------------------------------
# Column
# ---------------------------------------------------------------------------

class ColumnCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    color: str | None = Field(None, max_length=7, pattern=r"^#[0-9a-fA-F]{3,6}$")


class ColumnUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    position: int | None = Field(None, ge=0)
    color: str | None = Field(None, max_length=7, pattern=r"^#[0-9a-fA-F]{3,6}$")


class ColumnResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    title: str
    position: int
    color: str | None
    cards: list[CardResponse]


# ---------------------------------------------------------------------------
# Board
# ---------------------------------------------------------------------------

class BoardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    owner_id: str = Field(default="", max_length=255)


class BoardUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)


class BoardSummaryResponse(BaseModel):
    """Lightweight board listing without nested columns."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    owner_id: str
    created_at: datetime
    updated_at: datetime


class BoardDetailResponse(BaseModel):
    """Full board with nested columns, cards, and labels."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    columns: list[ColumnResponse]
    labels: list[LabelResponse]
