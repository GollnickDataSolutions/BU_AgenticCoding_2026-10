"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "@/components/board/Column";
import { Card } from "@/components/board/Card";
import { Button } from "@/components/ui/Button";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useCreateColumn } from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";

interface ColumnListProps {
  boardId: string;
}

const COLUMN_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export function ColumnList({ boardId }: ColumnListProps) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const createColumn = useCreateColumn(boardId);
  const getFilteredColumns = useBoardStore((s) => s.getFilteredColumns);
  const filteredColumns = getFilteredColumns();

  const {
    sensors,
    activeItem,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  } = useDragAndDrop();

  function handleAddColumn() {
    const trimmed = newColumnTitle.trim();
    if (!trimmed) return;

    const color = COLUMN_COLORS[colorIndex % COLUMN_COLORS.length];
    createColumn.mutate(
      { title: trimmed, color },
      {
        onSuccess: () => {
          setNewColumnTitle("");
          setIsAddingColumn(false);
          setColorIndex((i) => i + 1);
        },
      }
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      measuring={{
        droppable: { strategy: MeasuringStrategy.Always },
      }}
    >
      <div className="flex h-full gap-4 px-6 pb-6 overflow-x-auto items-start pt-4">
        <SortableContext
          items={filteredColumns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {filteredColumns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </SortableContext>

        {/* Add column */}
        <div className="w-72 flex-shrink-0">
          {isAddingColumn ? (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-3">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddColumn();
                  if (e.key === "Escape") {
                    setIsAddingColumn(false);
                    setNewColumnTitle("");
                  }
                }}
                placeholder="Column title..."
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddColumn}
                  disabled={!newColumnTitle.trim() || createColumn.isPending}
                >
                  Add column
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add column
            </button>
          )}
        </div>
      </div>

      {/* Drag overlays */}
      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeItem?.type === "card" && (
          <Card card={activeItem.card} isDragOverlay />
        )}
        {activeItem?.type === "column" && (
          <Column column={activeItem.column} isDragOverlay />
        )}
      </DragOverlay>
    </DndContext>
  );
}
