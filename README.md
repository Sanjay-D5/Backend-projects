# Backend Projects

Four REST APIs built with **Node.js, Express and MongoDB**, each one adding a new backend concept on top of the last: CRUD → authentication → role-based access → file uploads.

Every project was built on its own feature branch and merged through a pull request ([PR history](https://github.com/Sanjay-D5/Backend-projects/pulls?q=is%3Apr+is%3Aclosed)).

## Projects

| API | What it shows | Auth approach | Key libraries |
|---|---|---|---|
| [notes-api](./notes-api) | CRUD, filtering by tags | None (public) | Express, Mongoose |
| [auth-api](./auth-api) | Register, login, refresh-token rotation, profile | JWT access token (Bearer header) + refresh token in httpOnly cookie | bcryptjs, jsonwebtoken, helmet, express-rate-limit, express-validator, express-mongo-sanitize |
| [task-manager-api](./task-manager-api) | Tasks with assignment and admin stats | Same JWT flow as auth-api, plus role-based access (`requireRole("admin")`) | Same as auth-api |
| [resume-upload-api](./resume-upload-api) | PDF upload, text extraction, cloud storage | JWT in httpOnly cookie | multer, pdf-parse, cloudinary, helmet, cors |

## Endpoints

All routes are prefixed with `/api/v1`. 🔒 = needs login, 👑 = admin only.

### notes-api

| Method | Route | Description |
|---|---|---|
| GET | `/notes` | List notes |
| GET | `/notes/tags` | Filter notes by tags |
| GET | `/notes/:id` | Get one note |
| POST | `/notes` | Create a note |
| PUT | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete a note |

### auth-api

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account (rate-limited, validated) |
| POST | `/auth/login` | Log in, returns access token and sets refresh cookie (rate-limited) |
| POST | `/auth/refresh` | Rotate refresh token, issue new access token |
| GET | `/auth/me` 🔒 | Get profile |
| PUT | `/auth/me` 🔒 | Update profile |
| POST | `/auth/logout` 🔒 | Log out |

### task-manager-api

Includes the same `/auth/*` routes as auth-api, plus:

| Method | Route | Description |
|---|---|---|
| POST | `/tasks` 🔒 | Create a task |
| GET | `/tasks` 🔒 | List tasks |
| GET | `/tasks/:id` 🔒 | Get one task |
| PUT | `/tasks/:id` 🔒 | Update a task |
| DELETE | `/tasks/:id` 🔒👑 | Delete a task |
| PUT | `/tasks/:id/assign` 🔒👑 | Assign a task to a user |
| GET | `/admin/stats` 🔒👑 | Task statistics |

### resume-upload-api

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in (sets httpOnly cookie) |
| GET | `/auth/me` 🔒 | Current user |
| POST | `/auth/logout` 🔒 | Log out |
| POST | `/upload/resume` 🔒 | Upload a PDF resume (text extracted, file stored on Cloudinary) |
| GET | `/upload/resume` 🔒 | Get your resume |
| DELETE | `/upload/resume` 🔒 | Delete your resume |

## Running a project

```bash
cd auth-api          # or any other project folder
npm install
# create a .env file (see that project's README for the variables)
npm run dev
```

## What I learned

- Structuring an Express app into routes, controllers, models, middlewares and validators
- Short-lived access tokens with refresh-token rotation, and why refresh tokens belong in httpOnly cookies
- Protecting routes with middleware, then layering role checks on top
- Hardening an API: rate limiting, input validation, Mongo query sanitizing, helmet headers
- Handling file uploads safely and keeping secrets out of the repo
