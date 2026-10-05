"""Card endpoints (CRUD + move + label attach/detach)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Card, CardLabel, Column, Label
from backend.schemas import CardCreate, CardMove, CardResponse, CardUpdate

router = APIRouter(tags=["cards"])


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------

@router.post(
    "/columns/{column_id}/cards",
    response_model=CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_card(column_id: str, payload: CardCreate, db: Session = Depends(get_db)) -> Card:
    """Add a card to the bottom of a column."""
    column = db.query(Column).filter(Column.id == column_id).first()
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")

    max_pos = (
        db.query(Card.position)
        .filter(Card.column_id == column_id)
        .order_by(Card.position.desc())
        .first()
    )
    next_position = (max_pos[0] + 1) if max_pos else 0

    card = Card(
        column_id=column_id,
        title=payload.title,
        description=payload.description,
        position=next_position,
        assignee_id=payload.assignee_id,
        due_date=payload.due_date,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.patch("/cards/{card_id}", response_model=CardResponse)
def update_card(card_id: str, payload: CardUpdate, db: Session = Depends(get_db)) -> Card:
    """Update any mutable field on a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(card, field, value)

    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: str, db: Session = Depends(get_db)) -> None:
    """Delete a card and close the position gap."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    column_id = card.column_id
    old_position = card.position

    db.delete(card)
    db.flush()

    # Close the gap
    siblings = (
        db.query(Card)
        .filter(Card.column_id == column_id, Card.position > old_position)
        .order_by(Card.position)
        .all()
    )
    for sibling in siblings:
        sibling.position -= 1

    db.commit()


# ---------------------------------------------------------------------------
# Move
# ---------------------------------------------------------------------------

@router.patch("/cards/{card_id}/move", response_model=CardResponse)
def move_card(card_id: str, payload: CardMove, db: Session = Depends(get_db)) -> Card:
    """Move a card to a (possibly different) column at a specific position.

    Handles three cases:
    1. Reorder within the same column
    2. Move to a different column
    In both cases, positions of affected cards are updated to stay contiguous.
    """
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    target_column = db.query(Column).filter(Column.id == payload.column_id).first()
    if not target_column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target column not found")

    old_column_id = card.column_id
    old_position = card.position
    new_column_id = payload.column_id
    new_position = payload.position

    if old_column_id == new_column_id:
        # Same column: shift cards between old and new position
        if new_position != old_position:
            _reorder_within_column(db, card, new_position)
    else:
        # Different column: close gap in source, open gap in target
        _close_gap(db, old_column_id, old_position)
        _open_gap(db, new_column_id, new_position)
        card.column_id = new_column_id
        card.position = new_position

    db.commit()
    db.refresh(card)
    return card


# ---------------------------------------------------------------------------
# Label attach / detach
# ---------------------------------------------------------------------------

@router.post(
    "/cards/{card_id}/labels/{label_id}",
    response_model=CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def attach_label(card_id: str, label_id: str, db: Session = Depends(get_db)) -> Card:
    """Attach a label to a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    label = db.query(Label).filter(Label.id == label_id).first()
    if not label:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")

    existing = (
        db.query(CardLabel)
        .filter(CardLabel.card_id == card_id, CardLabel.label_id == label_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Label already attached")

    db.add(CardLabel(card_id=card_id, label_id=label_id))
    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}/labels/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
def detach_label(card_id: str, label_id: str, db: Session = Depends(get_db)) -> None:
    """Detach a label from a card."""
    link = (
        db.query(CardLabel)
        .filter(CardLabel.card_id == card_id, CardLabel.label_id == label_id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not attached to this card")

    db.delete(link)
    db.commit()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _reorder_within_column(db: Session, card: Card, new_position: int) -> None:
    """Reorder a card within its current column."""
    old_position = card.position

    if new_position > old_position:
        siblings = (
            db.query(Card)
            .filter(
                Card.column_id == card.column_id,
                Card.id != card.id,
                Card.position > old_position,
                Card.position <= new_position,
            )
            .all()
        )
        for s in siblings:
            s.position -= 1
    else:
        siblings = (
            db.query(Card)
            .filter(
                Card.column_id == card.column_id,
                Card.id != card.id,
                Card.position >= new_position,
                Card.position < old_position,
            )
            .all()
        )
        for s in siblings:
            s.position += 1

    card.position = new_position


def _close_gap(db: Session, column_id: str, removed_position: int) -> None:
    """Shift cards down to close a gap left by a removed/moved card."""
    siblings = (
        db.query(Card)
        .filter(Card.column_id == column_id, Card.position > removed_position)
        .order_by(Card.position)
        .all()
    )
    for s in siblings:
        s.position -= 1


def _open_gap(db: Session, column_id: str, insert_position: int) -> None:
    """Shift cards up to make room at *insert_position*."""
    siblings = (
        db.query(Card)
        .filter(Card.column_id == column_id, Card.position >= insert_position)
        .order_by(Card.position.desc())
        .all()
    )
    for s in siblings:
        s.position += 1
