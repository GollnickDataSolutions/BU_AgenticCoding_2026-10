"use client";

import { useState } from "react";
import Link from "next/link";
import { useBoards, useCreateBoard, useDeleteBoard } from "@/hooks/useBoard";
import { Button } from "@/components/ui/Button";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { data: boards, isLoading, isError, error } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleCreate() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    createBoard.mutate(
      { title: trimmed, owner_id: "user-1" },
      {
        onSuccess: () => {
          setNewTitle("");
          setIsCreating(false);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Kanban</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your boards</h1>
            <p className="mt-1 text-gray-500">
              Organize tasks across all your projects
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            size="lg"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New board
          </Button>
        </div>
      </div>

      {/* New board form */}
      {isCreating && (
        <div className="mx-auto max-w-6xl px-6 mb-6">
          <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm max-w-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Create board</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewTitle("");
                }
              }}
              placeholder="Board name..."
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={!newTitle.trim() || createBoard.isPending}
              >
                {createBoard.isPending ? "Creating..." : "Create board"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Board grid */}
      <main className="mx-auto max-w-6xl px-6 pb-12">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load boards</p>
            <p className="text-red-500 text-sm mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Make sure the backend is running at{" "}
              <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                http://localhost:8000
              </code>
            </p>
          </div>
        )}

        {!isLoading && !isError && boards?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No boards yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first board to get started
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsCreating(true)}
            >
              Create board
            </Button>
          </div>
        )}

        {boards && boards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <Link href={`/board/${board.id}`} className="block">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {board.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Updated {formatDate(board.updatedAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Delete button */}
                {deletingId === board.id ? (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600 flex-1">Delete board?</span>
                    <button
                      onClick={() => {
                        deleteBoard.mutate(board.id);
                        setDeletingId(null);
                      }}
                      className="text-xs text-white bg-red-500 rounded px-2 py-0.5 hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 px-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeletingId(board.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    aria-label="Delete board"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
