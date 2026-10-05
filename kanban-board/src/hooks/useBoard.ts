"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { useBoardStore } from "@/store/boardStore";
import type {
  CreateCardPayload,
  CreateColumnPayload,
  CreateLabelPayload,
  MoveCardPayload,
  UpdateBoardPayload,
  UpdateCardPayload,
  UpdateColumnPayload,
} from "@/types/board";

// ---------------------------------------------------------------------------
// Boards list
// ---------------------------------------------------------------------------

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: api.getBoards,
  });
}

// ---------------------------------------------------------------------------
// Single board
// ---------------------------------------------------------------------------

export function useBoard(boardId: string) {
  const setBoard = useBoardStore((s) => s.setBoard);

  return useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const board = await api.getBoard(boardId);
      setBoard(board);
      return board;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
}

// ---------------------------------------------------------------------------
// Board mutations
// ---------------------------------------------------------------------------

export function useUpdateBoard(boardId: string) {
  const queryClient = useQueryClient();
  const setBoardTitle = useBoardStore((s) => s.setBoardTitle);

  return useMutation({
    mutationFn: (payload: UpdateBoardPayload) =>
      api.updateBoard(boardId, payload),
    onSuccess: (updatedBoard) => {
      setBoardTitle(updatedBoard.title);
      queryClient.setQueryData(["board", boardId], updatedBoard);
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId: string) => api.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

// ---------------------------------------------------------------------------
// Column mutations
// ---------------------------------------------------------------------------

export function useCreateColumn(boardId: string) {
  const addColumn = useBoardStore((s) => s.addColumn);

  return useMutation({
    mutationFn: (payload: CreateColumnPayload) =>
      api.createColumn(boardId, payload),
    onSuccess: (column) => {
      addColumn(column);
    },
  });
}

export function useUpdateColumn() {
  const updateColumn = useBoardStore((s) => s.updateColumn);

  return useMutation({
    mutationFn: ({
      columnId,
      payload,
    }: {
      columnId: string;
      payload: UpdateColumnPayload;
    }) => api.updateColumn(columnId, payload),
    onSuccess: (column) => {
      updateColumn(column.id, column);
    },
  });
}

export function useDeleteColumn() {
  const removeColumn = useBoardStore((s) => s.removeColumn);

  return useMutation({
    mutationFn: (columnId: string) => api.deleteColumn(columnId),
    onMutate: (columnId) => {
      // Optimistic remove
      removeColumn(columnId);
    },
  });
}

// ---------------------------------------------------------------------------
// Card mutations
// ---------------------------------------------------------------------------

export function useCreateCard() {
  const addCard = useBoardStore((s) => s.addCard);

  return useMutation({
    mutationFn: ({
      columnId,
      payload,
    }: {
      columnId: string;
      payload: CreateCardPayload;
    }) => api.createCard(columnId, payload),
    onSuccess: (card) => {
      addCard(card.columnId, card);
    },
  });
}

export function useUpdateCard() {
  const updateCard = useBoardStore((s) => s.updateCard);

  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string;
      payload: UpdateCardPayload;
    }) => api.updateCard(cardId, payload),
    onSuccess: (card) => {
      updateCard(card.id, card);
    },
  });
}

export function useMoveCard() {
  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string;
      payload: MoveCardPayload;
    }) => api.moveCard(cardId, payload),
  });
}

export function useDeleteCard() {
  const removeCard = useBoardStore((s) => s.removeCard);

  return useMutation({
    mutationFn: (cardId: string) => api.deleteCard(cardId),
    onMutate: (cardId) => {
      removeCard(cardId);
    },
  });
}

// ---------------------------------------------------------------------------
// Label mutations
// ---------------------------------------------------------------------------

export function useCreateLabel(boardId: string) {
  const addLabel = useBoardStore((s) => s.addLabel);

  return useMutation({
    mutationFn: (payload: CreateLabelPayload) =>
      api.createLabel(boardId, payload),
    onSuccess: (label) => {
      addLabel(label);
    },
  });
}

export function useAddLabelToCard() {
  const updateCard = useBoardStore((s) => s.updateCard);

  return useMutation({
    mutationFn: ({
      cardId,
      labelId,
    }: {
      cardId: string;
      labelId: string;
    }) => api.addLabelToCard(cardId, labelId),
    onSuccess: (_data, { cardId, labelId }) => {
      const board = useBoardStore.getState().board;
      if (!board) return;
      const label = board.labels.find((l) => l.id === labelId);
      if (!label) return;
      const card = board.columns
        .flatMap((c) => c.cards)
        .find((c) => c.id === cardId);
      if (!card) return;
      const existing = card.labels ?? [];
      if (!existing.find((l) => l.id === labelId)) {
        updateCard(cardId, { labels: [...existing, label] });
      }
    },
  });
}

export function useRemoveLabelFromCard() {
  const updateCard = useBoardStore((s) => s.updateCard);

  return useMutation({
    mutationFn: ({
      cardId,
      labelId,
    }: {
      cardId: string;
      labelId: string;
    }) => api.removeLabelFromCard(cardId, labelId),
    onSuccess: (_data, { cardId, labelId }) => {
      const board = useBoardStore.getState().board;
      if (!board) return;
      const card = board.columns
        .flatMap((c) => c.cards)
        .find((c) => c.id === cardId);
      if (!card) return;
      updateCard(cardId, {
        labels: (card.labels ?? []).filter((l) => l.id !== labelId),
      });
    },
  });
}
