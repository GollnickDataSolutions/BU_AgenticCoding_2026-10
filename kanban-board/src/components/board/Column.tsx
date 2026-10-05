"use client";

import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import { Card } from "@/components/board/Card";
import { Button } from "@/components/ui/Button";
import { useCreateCard, useDeleteColumn, useUpdateColumn } from "@/hooks/useBoard";
import type { Column as ColumnType } from "@/types/board";

interface ColumnProps {
  column: ColumnType;
  isDragOverlay?: boolean;
}

export function Column({ column, isDragOverlay = false }: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const newCardRef = useRef<HTMLTextAreaElement>(null);

  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();
  const createCard = useCreateCard();

  // Sortable for column dragging
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  // Droppable for receiving cards
  const { setNodeRef: setDropRef } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function setRef(el: HTMLDivElement | null) {
    setSortableRef(el);
    setDropRef(el);
  }

  function saveTitle() {
    setIsEditingTitle(false);
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === column.title) {
      setTitleValue(column.title);
      return;
    }
    updateColumn.mutate({ columnId: column.id, payload: { title: trimmed } });
  }

  function handleAddCard() {
    const trimmed = newCardTitle.trim();
    if (!trimmed) {
      setIsAddingCard(false);
      setNewCardTitle("");
      return;
    }
    createCard.mutate(
      { columnId: column.id, payload: { title: trimmed } },
      {
        onSuccess: () => {
          setNewCardTitle("");
          setIsAddingCard(false);
        },
      }
    );
  }

  function handleDeleteColumn() {
    deleteColumn.mutate(column.id);
  }

  const accentColor = column.color ?? "#3B82F6";
  const sortedCards = [...column.cards].sort((a, b) => a.position - b.position);

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setRef}
        style={style}
        className="w-72 flex-shrink-0 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 h-32"
      />
    );
  }

  return (
    <div
      ref={setRef}
      style={style}
      className={clsx(
        "w-72 flex-shrink-0 flex flex-col rounded-xl bg-gray-50 border border-gray-200 max-h-full",
        isDragOverlay && "shadow-2xl rotate-1 opacity-95"
      )}
    >
      {/* Column header */}
      <div className="flex-shrink-0">
        {/* Accent bar */}
        <div
          className="h-1 rounded-t-xl"
          style={{ backgroundColor: accentColor }}
        />
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          {/* Drag handle */}
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors flex-shrink-0"
            aria-label="Drag column"
            {...attributes}
            {...listeners}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </button>

          {/* Title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitleValue(column.title);
                  setIsEditingTitle(false);
                }
              }}
              className="flex-1 rounded-md border border-blue-400 px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <button
              className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-gray-900 truncate"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </button>
          )}

          {/* Card count */}
          <span className="flex-shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            {column.cards.length}
          </span>

          {/* Delete */}
          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <button
                onClick={handleDeleteColumn}
                className="rounded px-1.5 py-0.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600"
                title="Confirm delete"
              >
                ✓
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
              >
                ✗
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-shrink-0 rounded p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete column"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-[2rem]">
        <SortableContext
          items={sortedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2 py-1">
            {sortedCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Add card */}
      <div className="flex-shrink-0 px-3 pb-3">
        {isAddingCard ? (
          <div className="space-y-2">
            <textarea
              ref={newCardRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === "Escape") {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }
              }}
              placeholder="Card title..."
              rows={2}
              autoFocus
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddCard}
                disabled={!newCardTitle.trim() || createCard.isPending}
              >
                Add card
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add card
          </button>
        )}
      </div>
    </div>
  );
}
