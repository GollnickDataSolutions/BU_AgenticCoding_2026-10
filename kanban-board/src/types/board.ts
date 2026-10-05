export interface Label {
  id: string;
  name: string;
  color: string; // hex
}

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  position: number;
  labels?: Label[];
  assigneeId?: string;
  dueDate?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  color?: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  ownerId: string;
  columns: Column[];
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardSummary {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// API request payloads
export interface CreateBoardPayload {
  title: string;
  owner_id?: string;
}

export interface UpdateBoardPayload {
  title: string;
}

export interface CreateColumnPayload {
  title: string;
  color?: string;
}

export interface UpdateColumnPayload {
  title?: string;
  position?: number;
  color?: string;
}

export interface CreateCardPayload {
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateCardPayload {
  title?: string;
  description?: string;
  assignee_id?: string;
  due_date?: string | null;
}

export interface MoveCardPayload {
  column_id: string;
  position: number;
}

export interface CreateLabelPayload {
  name: string;
  color: string;
}
