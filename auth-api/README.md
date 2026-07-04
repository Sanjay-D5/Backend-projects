# 🔐 Authentication API

A production-ready REST API built with Node.js, Express.js, MongoDB, and JWT authentication.

This project implements secure user authentication using Access Tokens, Refresh Tokens, httpOnly Cookies, password hashing with bcrypt, rate limiting, and security middleware.

---

## ✨ Features

- User Registration
- User Login
- User Logout
- JWT Authentication
- Access Token (15 min)
- Refresh Token (7 days)
- Refresh Token Rotation
- Protected Routes
- Profile Management
- Password Hashing using bcrypt
- Request Validation
- Rate Limiting
- Helmet Security
- MongoDB Sanitization
- Centralized Error Handling

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- express-validator
- express-rate-limit
- helmet
- express-mongo-sanitize

---

## 📁 Project Structure

```
src/
│
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
├── routes/
├── utils/
├── validators/
└── app.js
```

---

## 🔑 Authentication Flow

### Register

```
Client
    │
    ▼
POST /register
    │
    ▼
Hash Password
    │
    ▼
Save User
    │
    ▼
Generate Access Token
    │
    ▼
Generate Refresh Token
    │
    ▼
Store Hashed Refresh Token
    │
    ▼
Set httpOnly Cookie
    │
    ▼
Return Access Token
```

---

### Login

```
Client
    │
    ▼
POST /login
    │
    ▼
Compare Password
    │
    ▼
Generate Tokens
    │
    ▼
Set Cookie
    │
    ▼
Return Access Token
```

---

### Protected Route

```
Client

Authorization: Bearer <Access Token>

        │
        ▼
authMiddleware
        │
        ▼
jwt.verify()
        │
        ▼
req.user
        │
        ▼
Controller
        │
        ▼
MongoDB
```

---

### Refresh Token Flow

```
Access Token Expired
        │
        ▼
POST /refresh
        │
        ▼
Read Cookie
        │
        ▼
Verify Refresh Token
        │
        ▼
Compare Stored Hash
        │
        ▼
Generate New Tokens
        │
        ▼
Return New Access Token
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/v1/auth/register | Register User |
| POST | /api/v1/auth/login | Login User |
| POST | /api/v1/auth/logout | Logout User |
| POST | /api/v1/auth/refresh | Refresh Access Token |
| GET | /api/v1/auth/me | Get Current User |
| PUT | /api/v1/auth/me | Update User Profile |

---

## ⚙️ Environment Variables

Create a `.env` file.

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development
```

---

## 🚀 Run Locally

```bash
npm install

npm run dev
```

---

## 🔒 Security Features

- Password Hashing (bcrypt)
- JWT Authentication
- Refresh Token Rotation
- httpOnly Cookies
- Helmet
- Express Rate Limiting
- MongoDB Sanitization
- Request Validation

---

## 📜 License

MIT