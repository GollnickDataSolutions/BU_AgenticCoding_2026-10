"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useUpdateCard,
  useDeleteCard,
  useAddLabelToCard,
  useRemoveLabelFromCard,
  useCreateLabel,
} from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";
import type { Card, Label } from "@/types/board";

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const board = useBoardStore((s) => s.board);
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const addLabel = useAddLabelToCard();
  const removeLabel = useRemoveLabelFromCard();
  const createLabel = useCreateLabel(board?.id ?? "");

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [assigneeId, setAssigneeId] = useState(card.assigneeId ?? "");
  const [dueDate, setDueDate] = useState(card.dueDate ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLabelPanel, setShowLabelPanel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[4]);
  const [titleDirty, setTitleDirty] = useState(false);
  const [descDirty, setDescDirty] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Sync card data when card changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description ?? "");
    setAssigneeId(card.assigneeId ?? "");
    setDueDate(card.dueDate ?? "");
    setTitleDirty(false);
    setDescDirty(false);
  }, [card.id, card.title, card.description, card.assigneeId, card.dueDate]);

  const cardLabels: Label[] = card.labels ?? [];
  const boardLabels: Label[] = board?.labels ?? [];

  function saveTitle() {
    if (!titleDirty || !title.trim() || title.trim() === card.title) {
      setTitleDirty(false);
      return;
    }
    updateCard.mutate({ cardId: card.id, payload: { title: title.trim() } });
    setTitleDirty(false);
  }

  function saveDescription() {
    if (!descDirty || description === (card.description ?? "")) {
      setDescDirty(false);
      return;
    }
    updateCard.mutate({
      cardId: card.id,
      payload: { description: description || undefined },
    });
    setDescDirty(false);
  }

  function saveAssignee() {
    if (assigneeId === (card.assigneeId ?? "")) return;
    updateCard.mutate({
      cardId: card.id,
      payload: { assignee_id: assigneeId || undefined },
    });
  }

  function saveDueDate() {
    if (dueDate === (card.dueDate ?? "")) return;
    updateCard.mutate({
      cardId: card.id,
      payload: { due_date: dueDate || null },
    });
  }

  function handleDelete() {
    deleteCard.mutate(card.id);
    onClose();
  }

  function handleToggleLabel(label: Label) {
    const attached = cardLabels.some((l) => l.id === label.id);
    if (attached) {
      removeLabel.mutate({ cardId: card.id, labelId: label.id });
    } else {
      addLabel.mutate({ cardId: card.id, labelId: label.id });
    }
  }

  function handleCreateLabel() {
    if (!newLabelName.trim()) return;
    createLabel.mutate(
      { name: newLabelName.trim(), color: newLabelColor },
      {
        onSuccess: (label) => {
          addLabel.mutate({ cardId: card.id, labelId: label.id });
          setNewLabelName("");
        },
      }
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={card.title}>
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleDirty(true);
            }}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                titleRef.current?.blur();
              }
            }}
            rows={2}
            className="w-full resize-none text-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 -mx-2 transition-shadow"
            placeholder="Card title"
          />

          {/* Labels on card */}
          {cardLabels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {cardLabels.map((label) => (
                <Badge
                  key={label.id}
                  color={label.color}
                  onRemove={() => handleToggleLabel(label)}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescDirty(true);
              }}
              onBlur={saveDescription}
              rows={5}
              placeholder="Add a more detailed description..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                onBlur={saveAssignee}
                placeholder="e.g. jane@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={saveDueDate}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Labels panel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Labels</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLabelPanel(!showLabelPanel)}
              >
                {showLabelPanel ? "Hide" : "Manage labels"}
              </Button>
            </div>

            {showLabelPanel && (
              <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                {/* Existing board labels */}
                {boardLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {boardLabels.map((label) => {
                      const attached = cardLabels.some((l) => l.id === label.id);
                      return (
                        <button
                          key={label.id}
                          onClick={() => handleToggleLabel(label)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                            attached
                              ? "ring-2 ring-offset-1"
                              : "opacity-60 hover:opacity-100"
                          }`}
                          style={{
                            backgroundColor: label.color + "26",
                            color: label.color,
                            borderColor: label.color + "40",
                          }}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                          {attached && (
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Create new label */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateLabel();
                    }}
                    placeholder="New label name..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewLabelColor(c)}
                        className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          outline:
                            newLabelColor === c ? `2px solid ${c}` : "none",
                          outlineOffset: "2px",
                        }}
                        aria-label={`Select color ${c}`}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCreateLabel}
                    disabled={!newLabelName.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Delete this card?</span>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Yes, delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete card
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
