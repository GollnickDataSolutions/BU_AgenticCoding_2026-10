"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateBoard } from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";

interface BoardHeaderProps {
  boardId: string;
}

export function BoardHeader({ boardId }: BoardHeaderProps) {
  const board = useBoardStore((s) => s.board);
  const searchQuery = useBoardStore((s) => s.searchQuery);
  const activeLabelIds = useBoardStore((s) => s.activeLabelIds);
  const setSearchQuery = useBoardStore((s) => s.setSearchQuery);
  const toggleLabelFilter = useBoardStore((s) => s.toggleLabelFilter);
  const clearFilters = useBoardStore((s) => s.clearFilters);

  const updateBoard = useUpdateBoard(boardId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(board?.title ?? "");
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showLabelFilter, setShowLabelFilter] = useState(false);
  const labelFilterRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync title when board loads
  useEffect(() => {
    if (board?.title && !isEditingTitle) {
      setTitleValue(board.title);
    }
  }, [board?.title, isEditingTitle]);

  // Debounce search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 300);
    },
    [setSearchQuery]
  );

  // Close label dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        labelFilterRef.current &&
        !labelFilterRef.current.contains(e.target as Node)
      ) {
        setShowLabelFilter(false);
      }
    }
    if (showLabelFilter) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLabelFilter]);

  function saveTitle() {
    setIsEditingTitle(false);
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === board?.title) {
      setTitleValue(board?.title ?? "");
      return;
    }
    updateBoard.mutate({ title: trimmed });
  }

  const activeFiltersCount = activeLabelIds.length + (searchQuery ? 1 : 0);
  const boardLabels = board?.labels ?? [];

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Back link */}
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Back to dashboard"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        {/* Board title */}
        {isEditingTitle ? (
          <input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setTitleValue(board?.title ?? "");
                setIsEditingTitle(false);
              }
            }}
            className="rounded-lg border border-blue-400 px-3 py-1.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-lg font-bold text-gray-900 hover:text-blue-700 transition-colors rounded-lg px-2 py-1 -mx-2 hover:bg-blue-50"
          >
            {board?.title ?? "Loading..."}
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="h-9 w-52 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* Label filter */}
        <div className="relative" ref={labelFilterRef}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowLabelFilter(!showLabelFilter)}
            className={activeLabelIds.length > 0 ? "border-blue-400 text-blue-700 bg-blue-50" : ""}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
            {activeLabelIds.length > 0 && (
              <span className="rounded-full bg-blue-600 text-white px-1.5 py-0.5 text-xs min-w-[1.25rem] text-center">
                {activeLabelIds.length}
              </span>
            )}
          </Button>

          {showLabelFilter && (
            <div className="absolute right-0 top-full mt-1 z-30 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-2">
              {boardLabels.length === 0 ? (
                <p className="px-3 py-2 text-sm text-gray-500">
                  No labels created yet
                </p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {boardLabels.map((label) => {
                    const active = activeLabelIds.includes(label.id);
                    return (
                      <button
                        key={label.id}
                        onClick={() => toggleLabelFilter(label.id)}
                        className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                          active ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="flex-1 truncate">{label.name}</span>
                        {active && (
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clear filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="md" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {activeLabelIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Filtering by:</span>
          {activeLabelIds.map((labelId) => {
            const label = boardLabels.find((l) => l.id === labelId);
            if (!label) return null;
            return (
              <Badge
                key={labelId}
                color={label.color}
                onRemove={() => toggleLabelFilter(labelId)}
              >
                {label.name}
              </Badge>
            );
          })}
        </div>
      )}
    </header>
  );
}
