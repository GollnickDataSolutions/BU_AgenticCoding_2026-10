"""Column endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Board, Column
from backend.schemas import ColumnCreate, ColumnResponse, ColumnUpdate

router = APIRouter(tags=["columns"])


@router.post(
    "/boards/{board_id}/columns",
    response_model=ColumnResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_column(board_id: str, payload: ColumnCreate, db: Session = Depends(get_db)) -> Column:
    """Add a new column to a board (appended at the end)."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Determine next position
    max_pos = (
        db.query(Column.position)
        .filter(Column.board_id == board_id)
        .order_by(Column.position.desc())
        .first()
    )
    next_position = (max_pos[0] + 1) if max_pos else 0

    column = Column(
        board_id=board_id,
        title=payload.title,
        position=next_position,
        color=payload.color,
    )
    db.add(column)
    db.commit()
    db.refresh(column)
    return column


@router.patch("/columns/{column_id}", response_model=ColumnResponse)
def update_column(column_id: str, payload: ColumnUpdate, db: Session = Depends(get_db)) -> Column:
    """Update a column's title, position, or color.

    When position is changed, other columns in the same board are
    re-ordered to maintain a contiguous sequence.
    """
    column = db.query(Column).filter(Column.id == column_id).first()
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")

    if payload.title is not None:
        column.title = payload.title
    if payload.color is not None:
        column.color = payload.color

    if payload.position is not None and payload.position != column.position:
        _reorder_columns(db, column, payload.position)

    db.commit()
    db.refresh(column)
    return column


@router.delete("/columns/{column_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_column(column_id: str, db: Session = Depends(get_db)) -> None:
    """Delete a column and all its cards (cascade)."""
    column = db.query(Column).filter(Column.id == column_id).first()
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")

    board_id = column.board_id
    old_position = column.position

    db.delete(column)
    db.flush()

    # Close the gap: shift columns above the deleted one down by 1
    siblings = (
        db.query(Column)
        .filter(Column.board_id == board_id, Column.position > old_position)
        .order_by(Column.position)
        .all()
    )
    for sibling in siblings:
        sibling.position -= 1

    db.commit()


def _reorder_columns(db: Session, column: Column, new_position: int) -> None:
    """Move *column* to *new_position*, shifting siblings accordingly."""
    old_position = column.position

    if new_position > old_position:
        # Moving right: shift columns in (old, new] down by 1
        siblings = (
            db.query(Column)
            .filter(
                Column.board_id == column.board_id,
                Column.id != column.id,
                Column.position > old_position,
                Column.position <= new_position,
            )
            .all()
        )
        for s in siblings:
            s.position -= 1
    else:
        # Moving left: shift columns in [new, old) up by 1
        siblings = (
            db.query(Column)
            .filter(
                Column.board_id == column.board_id,
                Column.id != column.id,
                Column.position >= new_position,
                Column.position < old_position,
            )
            .all()
        )
        for s in siblings:
            s.position += 1

    column.position = new_position
