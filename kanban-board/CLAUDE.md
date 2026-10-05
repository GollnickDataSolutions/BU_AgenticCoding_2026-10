# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Agentic Coding live training** repository. The goal is to build a Kanban board application as a hands-on demonstration of AI-assisted development. No code exists yet — the repo contains planning documents and presentation materials.

## Planned Application: Kanban Board

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, `@dnd-kit/core` + `@dnd-kit/sortable`
- **State**: Zustand (client state), React Query (server state, stale-while-revalidate)
- **Backend**: Python + FastAPI + SQLite
- **UI Components**: shadcn/ui

### Architecture
- Frontend lives under `src/` (Next.js App Router structure)
- Backend is a separate FastAPI service
- State is persisted to the backend via REST API; drag-and-drop uses optimistic updates

### Key Design Decisions
- Card positions use a `position: number` field for ordering within columns
- `PATCH /api/cards/:id/move` is the dedicated endpoint for cross-column moves
- Labels are board-scoped (not global)
- Auth: Clerk preferred over NextAuth
- No real-time/multi-user sync in v1

### Planned Frontend Structure
```
src/
├── app/
│   ├── page.tsx                  # Dashboard / board list
│   └── board/[slug]/page.tsx     # Board view
├── components/board/             # BoardHeader, ColumnList, Column, CardList, Card, CardModal
├── components/ui/                # shadcn/ui components
├── store/boardStore.ts           # Zustand store
├── hooks/                        # useBoard (React Query), useDragAndDrop
├── lib/api.ts                    # API client
└── types/board.ts                # Shared TypeScript types
```

### REST API Surface
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/boards` | List / create boards |
| GET/PATCH/DELETE | `/api/boards/:id` | Read / update / delete board |
| POST | `/api/boards/:id/columns` | Add column |
| PATCH/DELETE | `/api/columns/:id` | Update / delete column |
| POST | `/api/columns/:id/cards` | Add card |
| PATCH/DELETE | `/api/cards/:id` | Update / delete card |
| PATCH | `/api/cards/:id/move` | Move card to new column + position |

## AI Docs
Planning documents live in `ai_docs/`:
- `PRD.md` — full product requirements, data model, acceptance criteria
- `architecture.md` — high-level stack decisions
- `features/` — per-feature specs (e.g., `F01_kanban_start.md`)
