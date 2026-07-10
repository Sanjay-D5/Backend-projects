# Resume Upload API

![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A secure REST API built with Node.js, Express, MongoDB, Cloudinary, and Multer that allows authenticated users to upload, retrieve, and delete PDF resumes.

The API extracts text from uploaded PDFs and stores the file securely on Cloudinary.



## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Architecture](#api-architecture)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Sample Responses](#sample-responses)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)



## Features

- **JWT Authentication:** Secure user signup, login, and protected routing using JSON Web Tokens stored via secure HTTP-only cookies.
- **Secure File Upload:** Multi-part form data handling via Multer with strict PDF-only validation and file size restrictions.
- **Text Extraction:** In-memory parsing of PDF text data using `pdf-parse` prior to cloud storage.
- **Cloud Dynamic Storage:** Automated streaming uploads and management (delete/overwrite) via Cloudinary API.
- **Robust Persistence:** Mongoose-mapped schemas tracking user relationships, Cloudinary asset metadata (`publicId`, secure URL), and extracted content.
- **Advanced Security:** Layered defense using Helmet headers, CORS policies, global error middleware, and absolute request rate limiting.
- **Production-Ready Operations:** Health monitoring endpoint, environment-based configuration management, and centralized constant declarations.



## Tech Stack

- **Runtime Environment:** Node.js (v22+)
- **Backend Framework:** Express.js (v5)
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **File Management:** Multer, Cloudinary SDK
- **Data Parsing:** pdf-parse
- **Security & Utilities:** Helmet, Express Rate Limit, Cors, Dotenv



## Project Structure


```text

src/
├── config/             # Database connectivity & Cloudinary configurations
├── constants/          # Application constants (HTTP codes, error messages)
├── controllers/        # Request handling logic (auth, resume, health controllers)
├── middlewares/        # Authentication, file filter, rate limit, & error handlers
├── models/             # Mongoose Schemas (User.model.js, Resume.model.js)
├── routes/             # Express Route split-outs mapped to versions
├── services/           # Decoupled business logic (Cloudinary upload, Text parser)
├── utils/              # Helper utilities (ApiError, ApiResponse, AsyncHandler)
├── app.js              # Express app initialization & core middleware configuration
└── server.js           # Server startup script, port listener, and error event handling

```



## API Architecture

```
Client Request
             │
             ▼
      [ Express API ]
             │
      ├── [ Security Layer ] (Helmet, Rate Limiter, CORS)
      ├── [ Routing Layer ]  (/api/v1/...)
      └── [ Auth Middleware ] (JWT & Cookie Verification)
             │
             ▼
    [ Multer File Filter ] ──(Fails if not PDF)
             │
             ▼
    [ PDF-Parse Service ] ───(Extracts Text Content)
             │
             ▼
    [ Cloudinary Service ] ──(Uploads Binaries -> Returns Asset URL)
             │
             ▼
    [ MongoDB Database ] ────(Persists Metadata & Extracted Text)
```



## Installation

```bash
git clone https://github.com/Sanjay-D5/Backend-projects.git

cd Backend-projects/resume-upload-api

npm install
```



## Environment Variables

Create a .env file in the root of the project and populate it with your specific credential configurations:

```env
# Server Configuration
PORT=4000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resumeDB

# Authentication Configuration
JWT_SECRET=your_super_complex_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Cloudinary Cloud Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


## Run Locally

```bash
npm run dev
```



## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/auth/register |
| POST | /api/v1/auth/login |
| POST | /api/v1/auth/logout |



### Resume

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/upload/resume |
| GET | /api/v1/upload/resume |
| DELETE | /api/v1/upload/resume |



### Health

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/health |



## Security

- Helmet
- Rate Limiting
- JWT Authentication
- Password Hashing
- Secure HTTP-only authentication cookies
- PDF Validation
- File Size Validation



## Deployment

**Live API:** https://backend-projects-jtnc.onrender.com/

**Health Check:** https://backend-projects-jtnc.onrender.com/api/v1/health

> Most resume endpoints require a valid JWT access token.



## Sample Response

```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeUrl": "...",
    "publicId": "...",
    "uploadedAt": "..."
  }
}
```



## Postman Collection

The Postman collection is included inside

```
postman/
```



## Future Improvements

- Resume Version History
- Resume Scoring
- AI Resume Analysis
- Resume Templates
- OCR Support
- AWS S3 Storage



## Author

**Sanjay D**

GitHub: https://github.com/Sanjay-D5


