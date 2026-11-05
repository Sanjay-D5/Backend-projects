# ✅ Task Manager API

A REST API for managing tasks with **JWT authentication and role-based access control**, built with Node.js, Express and MongoDB.

Regular users manage their own tasks. Admins can see every task, assign tasks to other users, delete tasks and view team-wide statistics.

---

## ✨ Features

- Create, read and update tasks with title, description, status, priority and due date
- **Role-based access control**: `user` and `admin` roles, enforced by a reusable `requireRole()` middleware
- **Ownership checks**: users can only read and update tasks they own; admins can access all tasks
- **Task assignment**: admins can assign any task to another user
- **Pagination, filtering and sorting** on the task list
- **Admin stats** built with MongoDB aggregation: totals, counts by status and priority, and overdue tasks
- JWT auth with short-lived access tokens and refresh tokens in httpOnly cookies
- Security: bcrypt password hashing, rate limiting, Helmet, request validation, Mongo query sanitizing

---

## 🛠 Tech Stack

| Area | Tools |
|---|---|
| Runtime / framework | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | jsonwebtoken, bcryptjs, cookie-parser |
| Security | helmet, express-rate-limit, express-validator, express-mongo-sanitize |
| Logging | morgan |

---

## 📁 Project Structure

```
task-manager-api/
├── app.js                  # Express app, middleware, route mounting
├── config/env.js           # Loads and validates required env variables
├── database/mongodb.js     # MongoDB connection
├── models/
│   ├── users.model.js      # User with role: "user" | "admin"
│   └── tasks.model.js      # Task with owner and assignedTo
├── controllers/
│   ├── auth.controller.js
│   ├── tasks.controller.js
│   └── admin.controller.js
├── routes/
│   ├── auth.router.js
│   ├── tasks.router.js
│   └── admin.router.js
├── middlewares/
│   ├── auth.middleware.js      # Verifies the Bearer access token
│   ├── role.middleware.js      # requireRole("admin")
│   ├── ratelimit.middleware.js
│   └── error.middleware.js
├── validators/auth.validator.js
└── utils/                  # Token generation, cookie options
```

---

## 🔐 How Access Works

1. A user registers or logs in and receives an **access token** in the response body, plus a **refresh token** in an httpOnly cookie.
2. Protected requests send the access token as `Authorization: Bearer <token>`.
3. `authMiddleware` verifies the token and attaches the user (including their role) to `req.user`.
4. Admin-only routes add `requireRole("admin")`, which returns **403 Forbidden** for anyone else.
5. Inside the task controllers, non-admins are limited to tasks where they are the `owner`.

| Action | User | Admin |
|---|---|---|
| Create a task | ✅ | ✅ |
| List / view tasks | Own tasks only | All tasks |
| Update a task | Own tasks only | Any task |
| Delete a task | ❌ | ✅ |
| Assign a task | ❌ | ✅ |
| View stats | ❌ | ✅ |

---

## 📌 API Endpoints

Base URL: `/api/v1`. 🔒 = access token required, 👑 = admin only.

### Auth

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in; returns access token, sets refresh cookie |
| POST | `/auth/refresh` | Issue a new access token from the refresh cookie |
| GET | `/auth/me` 🔒 | Get your profile |
| PUT | `/auth/me` 🔒 | Update your profile |
| POST | `/auth/logout` 🔒 | Log out and clear the refresh cookie |

### Tasks

| Method | Route | Description |
|---|---|---|
| POST | `/tasks` 🔒 | Create a task |
| GET | `/tasks` 🔒 | List tasks (paginated, filterable) |
| GET | `/tasks/:id` 🔒 | Get one task |
| PUT | `/tasks/:id` 🔒 | Update a task |
| DELETE | `/tasks/:id` 🔒👑 | Delete a task |
| PUT | `/tasks/:id/assign` 🔒👑 | Assign a task to a user (`{ "userId": "..." }`) |

### Admin

| Method | Route | Description |
|---|---|---|
| GET | `/admin/stats` 🔒👑 | Task totals, counts by status and priority, overdue count |

---

## 🔎 Query Parameters for `GET /tasks`

| Param | Default | Example |
|---|---|---|
| `page` | `1` | `?page=2` |
| `limit` | `10` | `?limit=20` |
| `status` | — | `pending`, `in-progress`, `completed` |
| `priority` | — | `low`, `medium`, `high` |
| `sortBy` | `createdAt` | `?sortBy=dueDate` |
| `order` | `desc` | `?order=asc` |

Example: `GET /api/v1/tasks?status=pending&priority=high&sortBy=dueDate&order=asc`

---

## 📝 Example Requests

**Create a task**

```http
POST /api/v1/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Write API docs",
  "description": "Document all task endpoints",
  "priority": "high",
  "dueDate": "2026-12-01"
}
```

**Admin stats response**

```json
{
  "success": true,
  "data": {
    "totalTasks": 12,
    "byStatus": { "pending": 5, "in-progress": 4, "completed": 3 },
    "byPriority": { "low": 2, "medium": 6, "high": 4 },
    "overdueCount": 2
  }
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in this folder. The app refuses to start if a required variable is missing.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

---

## 🚀 Getting Started

```bash
cd task-manager-api
npm install
npm run dev
```

New accounts get the `user` role. To test admin routes, change a user's `role` to `"admin"` directly in MongoDB.

---

## 💡 What I Learned

- Separating **authentication** (who you are) from **authorization** (what you can do)
- Writing a reusable role middleware with a variadic `requireRole(...roles)`
- Enforcing ownership inside controllers, not just at the route level
- Building list endpoints with pagination, filtering and sorting
- Using MongoDB aggregation pipelines for reporting
