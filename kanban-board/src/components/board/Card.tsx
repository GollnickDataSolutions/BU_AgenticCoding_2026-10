"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import { CardModal } from "@/components/board/CardModal";
import type { Card as CardType } from "@/types/board";

interface CardProps {
  card: CardType;
  isDragOverlay?: boolean;
}

function formatDueDate(dateStr: string): { label: string; overdue: boolean } {
  const due = new Date(dateStr);
  const now = new Date();
  const overdue = due < now;
  const label = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return { label, overdue };
}

export function Card({ card, isDragOverlay = false }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[72px] rounded-lg border-2 border-dashed border-blue-300 bg-blue-50"
      />
    );
  }

  const labels = card.labels ?? [];

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          "group rounded-lg border border-gray-200 bg-white p-3 shadow-card cursor-pointer select-none",
          "hover:shadow-card-hover hover:border-gray-300 transition-all",
          isDragOverlay && "rotate-1 shadow-xl opacity-90",
        )}
        onClick={() => {
          if (!isDragOverlay) setIsModalOpen(true);
        }}
        {...attributes}
        {...listeners}
      >
        {/* Label chips */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {labels.map((label) => (
              <span
                key={label.id}
                title={label.name}
                className="inline-block h-2 w-8 rounded-full"
                style={{ backgroundColor: label.color }}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
          {card.title}
        </p>

        {/* Footer meta */}
        {(card.dueDate || card.assigneeId) && (
          <div className="flex items-center justify-between mt-2 gap-2">
            {card.dueDate && (() => {
              const { label, overdue } = formatDueDate(card.dueDate);
              return (
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 text-xs rounded-md px-1.5 py-0.5",
                    overdue
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {label}
                </span>
              );
            })()}

            {card.assigneeId && (
              <span
                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-medium ml-auto flex-shrink-0"
                title={card.assigneeId}
              >
                {card.assigneeId.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CardModal
          card={card}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
