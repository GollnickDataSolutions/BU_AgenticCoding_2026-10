"use client";

import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { useMoveCard, useUpdateColumn } from "@/hooks/useBoard";
import type { Card, Column } from "@/types/board";

export type DragItem =
  | { type: "card"; card: Card }
  | { type: "column"; column: Column };

export function useDragAndDrop() {
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const board = useBoardStore((s) => s.board);
  const moveCardStore = useBoardStore((s) => s.moveCard);
  const setColumns = useBoardStore((s) => s.setColumns);
  const moveCardMutation = useMoveCard();
  const updateColumnMutation = useUpdateColumn();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    const data = active.data.current as { type: string; card?: Card; column?: Column };

    if (data.type === "card" && data.card) {
      setActiveItem({ type: "card", card: data.card });
    } else if (data.type === "column" && data.column) {
      setActiveItem({ type: "column", column: data.column });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !board) return;

    const activeData = active.data.current as { type: string; card?: Card };
    if (activeData.type !== "card") return;

    const activeCard = activeData.card;
    if (!activeCard) return;

    const overData = over.data.current as { type?: string; card?: Card; column?: Column } | undefined;

    // Determine target column
    let targetColumnId: string;
    let targetPosition: number;

    if (overData?.type === "card" && overData.card) {
      targetColumnId = overData.card.columnId;
      targetPosition = overData.card.position;
    } else if (overData?.type === "column" && overData.column) {
      targetColumnId = overData.column.id;
      const col = board.columns.find((c) => c.id === targetColumnId);
      targetPosition = col ? col.cards.length : 0;
    } else {
      // over is a column droppable by id
      const col = board.columns.find((c) => c.id === over.id);
      if (col) {
        targetColumnId = col.id;
        targetPosition = col.cards.length;
      } else {
        return;
      }
    }

    if (
      activeCard.columnId === targetColumnId &&
      activeCard.position === targetPosition
    ) {
      return;
    }

    moveCardStore(activeCard.id, activeCard.columnId, targetColumnId, targetPosition);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || !board) return;

    const activeData = active.data.current as { type: string; card?: Card; column?: Column };

    // Column reorder
    if (activeData.type === "column") {
      const activeCol = board.columns.find((c) => c.id === active.id);
      const overCol = board.columns.find((c) => c.id === over.id);
      if (!activeCol || !overCol || activeCol.id === overCol.id) return;

      const oldIndex = board.columns.findIndex((c) => c.id === active.id);
      const newIndex = board.columns.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(board.columns, oldIndex, newIndex).map(
        (col, i) => ({ ...col, position: i })
      );
      setColumns(reordered);

      // Persist all moved columns
      reordered.forEach((col, i) => {
        if (col.position !== board.columns[i]?.position) {
          updateColumnMutation.mutate({
            columnId: col.id,
            payload: { position: col.position },
          });
        }
      });
      return;
    }

    // Card drop — find current state after onDragOver applied optimistic update
    if (activeData.type === "card") {
      const currentCard = board.columns
        .flatMap((c) => c.cards)
        .find((c) => c.id === active.id);

      if (!currentCard) return;

      moveCardMutation.mutate({
        cardId: currentCard.id,
        payload: {
          column_id: currentCard.columnId,
          position: currentCard.position,
        },
      });
    }
  }

  function onDragCancel() {
    setActiveItem(null);
  }

  return {
    sensors,
    activeItem,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
}
