# ⬡ HIVE

## 🚧 Under Active Development — Not ready for use 🚧

> Real-time team communication. Workspaces, channels, and direct messaging — built lean and fast.

![Version](https://img.shields.io/badge/version-1.0.0-yellow)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20TypeScript-blue)
![DB](https://img.shields.io/badge/database-PostgreSQL-336791)
![Cache](https://img.shields.io/badge/cache-Redis-red)
![WS](https://img.shields.io/badge/realtime-Socket.IO-purple)

---

## What is Hive?

Hive is a real-time team collaboration platform — think Discord, but built from scratch. Users create workspaces, organize conversations into channels, message each other directly, and see who's online — all in real time.

---

## Features

- **Workspaces** — Create isolated team spaces. Invite members, manage roles.
- **Channels** — Organize conversations by topic within a workspace.
- **Direct Messages** — Private one-to-one conversations between users.
- **Real-time messaging** — Socket.IO-powered chat with instant delivery and typing indicators.
- **Presence** — Live online/offline status per workspace using Redis Sets.
- **Authentication** — JWT-based auth with access + refresh tokens, token rotation, and httpOnly cookies.
- **Redis caching** — Last 50 messages per conversation cached in Redis Lists with TTL. Postgres for history and persistence.
- **Rate limiting** — Per-route rate limiting on auth and message endpoints.
- **Input validation** — Zod schemas on all incoming request bodies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Database | PostgreSQL (via Docker locally) |
| ORM | Prisma |
| Cache | Redis (via Docker locally) + ioredis |
| Real-time | Socket.IO |
| Auth | JWT — access + refresh tokens, bcrypt |
| Validation | Zod |

---

## Project Structure

```
Hive/
├── docker-compose.yaml          # Postgres + Redis local dev containers
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # data models
│   │   └── migrations/          # migration history
│   └── src/
│       ├── lib/
│       │   ├── prisma.ts        # Prisma client singleton
│       │   └── rateLimiter.ts   # rate limit config
│       ├── middlewares/
│       │   └── auth/            # JWT auth middleware + rate limit middleware
│       ├── modules/
│       │   ├── auth/            # register, login, logout, refresh
│       │   ├── user/            # profile, direct messages
│       │   ├── workspace/       # workspace CRUD + membership
│       │   ├── channel/         # channel CRUD + channel messages
│       │   ├── conversation/    # DM conversation management
│       │   └── directMessage/   # DM sending + Redis caching
│       ├── routes/              # Express route definitions
│       ├── types/               # TypeScript type declarations
│       ├── utils/
│       │   ├── jwt.ts           # token sign + verify utilities
│       │   ├── redis.ts         # ioredis client
│       │   ├── socket.ts        # Socket.IO setup + event handlers
│       │   └── message.ts       # message utilities
│       ├── validation/
│       │   └── zod.ts           # Zod schemas
│       └── server.ts            # Express + HTTP server entry point
└── frontend/                    # React + TypeScript (in progress)
```

---

## Data Models

```
User
 └── WorkspaceMember (many-to-many with Workspace via join table)
 └── Message (channel messages)
 └── DirectMessage (sent messages)
 └── RefreshToken (separate table — supports multiple sessions)

Workspace
 └── WorkspaceMember (OWNER | MEMBER roles)
 └── Channel

Channel
 └── Message

Conversation (between two Users)
 └── DirectMessage
```

---

## API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, receive tokens |
| POST | `/api/auth/logout` | Invalidate refresh token |
| POST | `/api/auth/refresh` | Rotate refresh token, get new access token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Get current user profile |
| PUT | `/api/user/me` | Update profile |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces` | Create a workspace |
| GET | `/api/workspaces` | List joined workspaces |
| GET | `/api/workspaces/:id` | Get workspace details |
| POST | `/api/workspaces/:id/members` | Add a member |
| DELETE | `/api/workspaces/:id/members/:userId` | Remove a member (owner only) |
| DELETE | `/api/workspaces/:id` | Delete workspace (owner only) |

### Channels
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces/:id/channels` | Create a channel |
| GET | `/api/workspaces/:id/channels` | List channels |
| DELETE | `/api/workspaces/:id/channels/:cid` | Delete a channel |
| GET | `/api/channels/:id/messages` | Fetch channel message history |

### Conversations & DMs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/conversations` | Start a DM conversation |
| GET | `/api/conversations` | List all conversations |
| GET | `/api/conversations/:id` | Get conversation details |
| GET | `/api/conversations/:id/messages` | Fetch DM history (Redis → Postgres fallback) |
| DELETE | `/api/conversations/:id` | Delete conversation |

### WebSocket Events
| Event | Direction | Description |
|---|---|---|
| `join_workspace` | client → server | Join workspace room, mark online |
| `join_channel` | client → server | Subscribe to a channel |
| `join_conversation` | client → server | Subscribe to a DM conversation |
| `send_dm` | client → server | Send a direct message |
| `send_channel_message` | client → server | Send a channel message |
| `typing_start` | client → server | User started typing (DM) |
| `typing_stop` | client → server | User stopped typing (DM) |
| `channel_typing_start` | client → server | User started typing (channel) |
| `channel_typing_stop` | client → server | User stopped typing (channel) |
| `get_online_members` | client → server | Request current online members |
| `new_dm` | server → client | Broadcast new DM to conversation room |
| `new_channel_message` | server → client | Broadcast new message to channel room |
| `user_typing` | server → client | Typing indicator (excludes sender) |
| `user_stop_typing` | server → client | Stop typing indicator |
| `user_online` | server → client | User came online in workspace |
| `user_offline` | server → client | User went offline in workspace |
| `online_members` | server → client | Current online member list |

---

## Redis Usage

| Purpose | Key Pattern | Type | TTL |
|---|---|---|---|
| Recent DM messages | `messages:{conversationId}` | List (max 50) | 1 hour |
| Online presence | `online:{workspaceId}` | Set | 24 hours |

Messages are always persisted to Postgres first. Redis holds the last 50 messages per conversation as a fast-read cache. On cache miss, falls back to Postgres and repopulates Redis. Presence uses Redis Sets — `sadd` on connect, `srem` on disconnect.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/PrimeFold/Hive.git
cd Hive

# Start Postgres + Redis via Docker
docker compose up -d

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Start backend in dev mode
npm run dev
```

---

## Environment Variables

```env
PORT=<yourPort>
NODE_ENV=development

DATABASE_URL=<your_database_url>

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

REDIS_URL=<your_redis_url>

FRONTEND_URL=<your_frontend_url>
```

---

## How Authentication Works

```
Register / Login
      ↓
accessToken (15m) → returned in JSON body
refreshToken (7d) → stored in httpOnly cookie + saved to RefreshToken table
      ↓
Authenticated requests → Authorization: Bearer <accessToken>
      ↓
Token expires (401) → frontend interceptor calls /refresh automatically
      ↓
/refresh → old refresh token invalidated → new access + refresh token issued
      ↓
Logout → refresh token deleted from DB, cookie cleared
```

Multiple sessions are supported — each device gets its own RefreshToken row. Logging out only invalidates that session's token.

---

## Challenges & What I Learned

### Relational schema design
Coming from MongoDB where you just embed things, designing a normalized Postgres schema was a new challenge. Figuring out when to use a join table (WorkspaceMember), when to use a foreign key (channelId on Message), and why you can't just store arrays of IDs in a row — this took real thought. The WorkspaceMember table specifically made me understand many-to-many relationships properly for the first time.

### Refresh token rotation with multiple sessions
In my previous project (Postr), I stored one refresh token per user — meaning logging in on a second device would invalidate the first session. For Hive I moved to a separate RefreshToken table so each session has its own token. This meant thinking through what "logout" means — it should only invalidate the current session, not all of them.

### Socket.IO authentication
HTTP auth middleware doesn't work on socket connections since there's no request object. I had to learn about the Socket.IO handshake — the frontend sends the access token via `socket.handshake.auth.token`, and the server runs its own middleware to verify it and attach `userId` to `socket.data` before any events are processed.

### Redis as more than a key-value store
I initially thought of Redis as just a place to store strings. Building Hive taught me it has actual data structures — Lists for message caching (lpush/ltrim/lrange), Sets for presence tracking (sadd/srem/smembers), and Pub/Sub for broadcasting across server instances. Using Redis three different ways in one project made it actually click.

### Cache invalidation and the sliding window
My first instinct for caching messages was to fetch from Postgres, store in Redis, and delete the cache when a new message arrives — which defeats the purpose entirely. The right approach is a sliding window: always push new messages to the front of a Redis List, trim to 50 items, and let Postgres handle history via pagination. New messages never bust the cache.

### `socket.to()` vs `io.to()`
A subtle but important distinction — `io.to(room).emit()` sends to everyone in a room including the sender, while `socket.to(room).emit()` excludes the sender. For typing indicators you don't want to see your own "is typing" — so `socket.to()`. For new messages you do want to see your own message appear — so `io.to()`.

---

## Roadmap

- [x] JWT auth with token rotation + multiple sessions
- [x] Workspaces + channels
- [x] Direct messages with Redis caching
- [x] Socket.IO — real-time messaging, typing indicators
- [x] Presence — online/offline per workspace via Redis Sets
- [ ] File uploads (Cloudinary)
- [ ] Workspace invite emails (Resend)
- [ ] Background jobs (BullMQ)
- [ ] Full-text message search (Postgres FTS)
- [ ] Frontend integration
- [ ] Docker + deployment

---

## License

MIT
