"""Board and label endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from backend.database import get_db
from backend.models import Board, Column, Label
from backend.schemas import (
    BoardCreate,
    BoardDetailResponse,
    BoardSummaryResponse,
    BoardUpdate,
    LabelCreate,
    LabelResponse,
)

router = APIRouter(tags=["boards"])

_DEFAULT_COLUMNS = ["Backlog", "In Progress", "Review", "Done"]


@router.get("/boards", response_model=list[BoardSummaryResponse])
def list_boards(db: Session = Depends(get_db)) -> list[Board]:
    """Return all boards (without nested data)."""
    return db.query(Board).order_by(Board.created_at.desc()).all()


@router.post("/boards", response_model=BoardDetailResponse, status_code=status.HTTP_201_CREATED)
def create_board(payload: BoardCreate, db: Session = Depends(get_db)) -> Board:
    """Create a board with four default columns."""
    board = Board(title=payload.title, owner_id=payload.owner_id)
    db.add(board)
    db.flush()  # populate board.id before creating columns

    for position, title in enumerate(_DEFAULT_COLUMNS):
        db.add(Column(board_id=board.id, title=title, position=position))

    db.commit()
    db.refresh(board)
    return board


@router.get("/boards/{board_id}", response_model=BoardDetailResponse)
def get_board(board_id: str, db: Session = Depends(get_db)) -> Board:
    """Get a board with all nested columns, cards, and labels."""
    board = (
        db.query(Board)
        .options(
            joinedload(Board.columns).joinedload(Column.cards),
            joinedload(Board.labels),
        )
        .filter(Board.id == board_id)
        .first()
    )
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return board


@router.patch("/boards/{board_id}", response_model=BoardDetailResponse)
def update_board(board_id: str, payload: BoardUpdate, db: Session = Depends(get_db)) -> Board:
    """Update a board's title."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    board.title = payload.title
    db.commit()
    db.refresh(board)
    return board


@router.delete("/boards/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(board_id: str, db: Session = Depends(get_db)) -> None:
    """Delete a board and all associated data (cascade)."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    db.delete(board)
    db.commit()


# ---------------------------------------------------------------------------
# Labels (board-scoped)
# ---------------------------------------------------------------------------

@router.get("/boards/{board_id}/labels", response_model=list[LabelResponse])
def list_labels(board_id: str, db: Session = Depends(get_db)) -> list[Label]:
    """List all labels for a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return db.query(Label).filter(Label.board_id == board_id).all()


@router.post(
    "/boards/{board_id}/labels",
    response_model=LabelResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_label(board_id: str, payload: LabelCreate, db: Session = Depends(get_db)) -> Label:
    """Create a label on a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    label = Label(board_id=board_id, name=payload.name, color=payload.color)
    db.add(label)
    db.commit()
    db.refresh(label)
    return label


@router.delete("/labels/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_label(label_id: str, db: Session = Depends(get_db)) -> None:
    """Delete a label."""
    label = db.query(Label).filter(Label.id == label_id).first()
    if not label:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")

    db.delete(label)
    db.commit()
