"use client";

import { create } from "zustand";
import type { Board, Card, Column, Label } from "@/types/board";

interface BoardState {
  // Data
  board: Board | null;
  // Filters
  searchQuery: string;
  activeLabelIds: string[];

  // Board mutations
  setBoard: (board: Board) => void;
  setBoardTitle: (title: string) => void;

  // Column mutations
  addColumn: (column: Column) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  removeColumn: (columnId: string) => void;
  reorderColumns: (columns: Column[]) => void;

  // Card mutations
  addCard: (columnId: string, card: Card) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  removeCard: (cardId: string) => void;
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newPosition: number
  ) => void;
  setColumns: (columns: Column[]) => void;

  // Label mutations
  addLabel: (label: Label) => void;

  // Filters
  setSearchQuery: (q: string) => void;
  toggleLabelFilter: (labelId: string) => void;
  clearFilters: () => void;

  // Computed
  getFilteredColumns: () => Column[];
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  searchQuery: "",
  activeLabelIds: [],

  setBoard: (board) => set({ board }),

  setBoardTitle: (title) =>
    set((state) => ({
      board: state.board ? { ...state.board, title } : null,
    })),

  addColumn: (column) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: [...state.board.columns, column].sort(
              (a, b) => a.position - b.position
            ),
          }
        : null,
    })),

  updateColumn: (columnId, updates) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: state.board.columns.map((col) =>
              col.id === columnId ? { ...col, ...updates } : col
            ),
          }
        : null,
    })),

  removeColumn: (columnId) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: state.board.columns.filter((col) => col.id !== columnId),
          }
        : null,
    })),

  reorderColumns: (columns) =>
    set((state) => ({
      board: state.board ? { ...state.board, columns } : null,
    })),

  addCard: (columnId, card) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: state.board.columns.map((col) =>
              col.id === columnId
                ? { ...col, cards: [...col.cards, card] }
                : col
            ),
          }
        : null,
    })),

  updateCard: (cardId, updates) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: state.board.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            })),
          }
        : null,
    })),

  removeCard: (cardId) =>
    set((state) => ({
      board: state.board
        ? {
            ...state.board,
            columns: state.board.columns.map((col) => ({
              ...col,
              cards: col.cards.filter((card) => card.id !== cardId),
            })),
          }
        : null,
    })),

  moveCard: (cardId, fromColumnId, toColumnId, newPosition) =>
    set((state) => {
      if (!state.board) return {};

      // Find the card
      const fromCol = state.board.columns.find((c) => c.id === fromColumnId);
      if (!fromCol) return {};
      const card = fromCol.cards.find((c) => c.id === cardId);
      if (!card) return {};

      const updatedCard: Card = { ...card, columnId: toColumnId, position: newPosition };

      const newColumns = state.board.columns.map((col) => {
        if (col.id === fromColumnId && col.id === toColumnId) {
          // Same column reorder
          const without = col.cards.filter((c) => c.id !== cardId);
          without.splice(newPosition, 0, updatedCard);
          return {
            ...col,
            cards: without.map((c, i) => ({ ...c, position: i })),
          };
        }
        if (col.id === fromColumnId) {
          return {
            ...col,
            cards: col.cards
              .filter((c) => c.id !== cardId)
              .map((c, i) => ({ ...c, position: i })),
          };
        }
        if (col.id === toColumnId) {
          const without = col.cards.filter((c) => c.id !== cardId);
          without.splice(newPosition, 0, updatedCard);
          return {
            ...col,
            cards: without.map((c, i) => ({ ...c, position: i })),
          };
        }
        return col;
      });

      return { board: { ...state.board, columns: newColumns } };
    }),

  setColumns: (columns) =>
    set((state) => ({
      board: state.board ? { ...state.board, columns } : null,
    })),

  addLabel: (label) =>
    set((state) => ({
      board: state.board
        ? { ...state.board, labels: [...state.board.labels, label] }
        : null,
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleLabelFilter: (labelId) =>
    set((state) => ({
      activeLabelIds: state.activeLabelIds.includes(labelId)
        ? state.activeLabelIds.filter((id) => id !== labelId)
        : [...state.activeLabelIds, labelId],
    })),

  clearFilters: () => set({ searchQuery: "", activeLabelIds: [] }),

  getFilteredColumns: () => {
    const { board, searchQuery, activeLabelIds } = get();
    if (!board) return [];

    return board.columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => {
        const matchesSearch =
          !searchQuery ||
          card.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLabels =
          activeLabelIds.length === 0 ||
          activeLabelIds.every((lid) =>
            card.labels?.some((l) => l.id === lid)
          );
        return matchesSearch && matchesLabels;
      }),
    }));
  },
}));
