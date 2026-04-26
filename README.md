# HIVE

Real-time team communication with workspaces, channels, and direct messages.

## Current Status

This project is in active development, but core chat flows are working:

- Auth (signup/login + JWT + refresh cookie flow in code)
- Workspaces and channels
- Channel and direct messages
- Socket.IO real-time messaging + typing indicators
- Friend request system and user search
- Redis caching for recent messages and presence

Frontend builds successfully for production.

## Tech Stack

- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL, Redis, Socket.IO
- Frontend: React 19, Vite, TanStack Router, TanStack Query, Tailwind, Radix UI

## Repository Structure

```text
Hive/
  backend/
    prisma/
      schema.prisma
    src/
      modules/
        auth/
        channels/
        directMessage/
        friends/
          friends.controller.ts
          friends.routes.ts
          friends.service.ts
        messages/
        workspace/
      routes/
      utils/
        redis.ts
      server.ts
  frontend/
    package.json
    src/
      components/
        app/
          ChatArea.tsx
          MessageItem.tsx
          MessageList.tsx
          SearchUsers.tsx
      context/
      hooks/
      lib/
        axios.ts
  docker-compose.yaml
```

## Backend API (Current Routes)

All routes are mounted at `/` (no `/api` prefix in current server config).

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh` (route exists; see Known Gaps)

### User

- `GET /user/me`
- `PUT /update-username`
- `PUT /update-email`
- `PUT /update-password`
- `DELETE /user/me`

### Workspace

- `POST /workspace`
- `GET /workspace/:id`
- `GET /workspaces`
- `PUT /workspace/:id`
- `DELETE /workspace/:id`
- `POST /workspace/:id/member`
- `DELETE /workspace/:id/member`

### Channel

- `POST /channels/:id` (create in workspace)
- `GET /channels/:id` (list by workspace)
- `PUT /channel/:id`
- `DELETE /channel/:id`
- `DELETE /messages/:id`
- `GET /channels/:channelId/messages`

### Conversations and Direct Messages

- `POST /conversation`
- `GET /conversation`
- `GET /conversation/:id`
- `DELETE /conversation/:id`
- `GET /conversations/:conversationId/messages`
- `DELETE /direct-messages/:id`

### Friends

- `GET /friends/search`
- `POST /friends/request`

## Socket Events (Current)

Client to server:

- `join_workspace`
- `join_conversation`
- `send_dm`
- `typing_start`
- `typing_stop`
- `join_channel`
- `send_channel_message`
- `channel_typing_start`
- `channel_typing_stop`
- `online_members`

Server to client:

- `new_dm`
- `message_failed`
- `new_channel_message`
- `channel_message_failed`
- `user_typing`
- `user_stop_typing`
- `user_online`
- `user_offline`
- `online_members`

## Redis Keys Used

- Channel message cache: `channel-message:{channelId}` (list, last 50)
- Direct message cache: `direct-message:{conversationId}` (list, last 50)
- Workspace presence: `online:{workspaceId}` (set)

## Local Setup

### 1. Start infra

```bash
docker compose up -d
```

This starts:

- Postgres on `localhost:5432`
- Redis on `localhost:6379`

### 2. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

For production build check:

```bash
npm run build
```

## Environment Variables (Backend)

These names are currently referenced in source:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://...

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_SECRET=...
```

## Known Gaps / TODO

- `POST /auth/refresh` route is declared but currently not wired to controller in `auth.route.ts`.
- Auth secret usage is inconsistent in code (`JWT_SECRET` vs `JWT_ACCESS_SECRET`).
- Backend `tsconfig.json` currently includes a frontend file path, which can break backend-only type checks.
- Profile editing/logout UX is still being finalized.

## License

MIT
