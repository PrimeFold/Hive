# ⬡ HIVE
## 🚧🚧DISCLAIMER : This project is under active development. Not ready for use🚧🚧
> Real-time team communication. Workspaces, channels, and instant messaging — built lean and fast.

![Version](https://img.shields.io/badge/version-1.0.0-yellow)
![Stack](https://img.shields.io/badge/stack-NestJS%20%2B%20TypeScript-blue)
![DB](https://img.shields.io/badge/database-PostgreSQL-336791)
![WS](https://img.shields.io/badge/realtime-WebSockets-purple)

---

## What is Hive?

Hive is a real-time communication platform built around **workspaces** and **channels**. Teams and communities can create their own space, organize conversations, and communicate instantly — with a clean API and a WebSocket-powered messaging core.

---

## Features

- **Workspaces** — Create isolated communities. Invite members and manage roles.
- **Channels** — Organize conversations by topic within a workspace. Public or private.
- **Real-time messaging** — WebSocket-powered chat with live delivery and typing indicators.
- **Authentication** — JWT-based auth with access + refresh tokens. Register, login, logout.
- **User profiles** — Edit display name, avatar, bio, and preferences.
- **Member roles** — Owner, admin, and member roles per workspace with access control.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | NestJS |
| Database | PostgreSQL + TypeORM |
| Real-time | Socket.IO via `@nestjs/websockets` |
| Auth | JWT (access + refresh tokens), bcrypt |
| Validation | class-validator + class-transformer |

---

## Project Structure

```
src/
├── modules/
│   ├── auth/               # login, register, token refresh
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── user/               # profile, preferences
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── workspace/          # workspace CRUD + membership
│   │   ├── workspace.controller.ts
│   │   ├── workspace.service.ts
│   │   └── workspace.module.ts
│   ├── channel/            # channel CRUD
│   │   ├── channel.controller.ts
│   │   ├── channel.service.ts
│   │   └── channel.module.ts
│   ├── message/            # message persistence
│   │   ├── message.controller.ts
│   │   ├── message.service.ts
│   │   └── message.module.ts
│   └── gateway/            # Socket.IO event hub
│       ├── gateway.gateway.ts
│       └── gateway.module.ts
├── common/
│   ├── guards/             # JWT guard, roles guard
│   ├── decorators/         # @CurrentUser, @Roles
│   └── filters/            # global exception filters
├── app.module.ts
└── main.ts
```

---

## API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login, receive tokens |
| POST | `/auth/logout` | Invalidate refresh token |
| POST | `/auth/refresh` | Get new access token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update profile details |
| DELETE | `/users/me` | Delete account |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| POST | `/workspaces` | Create a workspace |
| GET | `/workspaces` | List joined workspaces |
| GET | `/workspaces/:id` | Get workspace details |
| POST | `/workspaces/:id/invite` | Invite a member |
| DELETE | `/workspaces/:id` | Delete workspace (owner only) |

### Channels
| Method | Endpoint | Description |
|---|---|---|
| POST | `/workspaces/:id/channels` | Create a channel |
| GET | `/workspaces/:id/channels` | List channels in workspace |
| DELETE | `/channels/:id` | Delete a channel |

### Messages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/channels/:id/messages` | Fetch message history |
| DELETE | `/messages/:id` | Delete a message |

### WebSocket Events
| Event | Direction | Description |
|---|---|---|
| `join_channel` | client → server | Subscribe to a channel |
| `leave_channel` | client → server | Unsubscribe from a channel |
| `send_message` | client → server | Send a message |
| `new_message` | server → client | Broadcast new message |
| `typing` | client → server | Typing indicator |
| `user_typing` | server → client | Broadcast typing state |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/hive.git
cd hive

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migration:run

# Start in development mode
npm run start:dev
```

---

## Environment Variables

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=hive

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

---

## Roadmap

- [x] Auth module (register, login, JWT)
- [x] User module (profile management)
- [ ] Workspace module
- [ ] Channel module
- [ ] Message persistence
- [ ] WebSocket gateway
- [ ] Typing indicators + presence
- [ ] Message reactions
- [ ] File/image attachments
- [ ] Notifications

---

## License

MIT
