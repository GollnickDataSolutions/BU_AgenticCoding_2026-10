"use client";

import { use } from "react";
import { useBoard } from "@/hooks/useBoard";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ColumnList } from "@/components/board/ColumnList";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);
  const { isLoading, isError, error } = useBoard(id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading board...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center max-w-md shadow-sm">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-900">Failed to load board</p>
          <p className="text-sm text-gray-500 mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <BoardHeader boardId={id} />
      <div className="flex-1 overflow-hidden">
        <ColumnList boardId={id} />
      </div>
    </div>
  );
}
