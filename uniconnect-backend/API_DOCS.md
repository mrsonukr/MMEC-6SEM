# UniConnect Backend — API Documentation

Base URL (local): `http://localhost:8787`  
Base URL (production): `https://backend.uniconnectmmu.workers.dev`

---

## Users

### Create User
**POST** `/users`

**Request Body (JSON):**
```json
{
  "user_id": "u001",
  "full_name": "Rahul Sharma",
  "role": "student",
  "email": "rahul@example.com"
}
```

> `role` must be either `"student"` or `"teacher"`

**Response `201`:**
```json
{
  "success": true,
  "message": "User created"
}
```

---

### Get All Users
**GET** `/users`

**Response `200`:**
```json
{
  "results": [
    {
      "id": 1,
      "user_id": "u001",
      "full_name": "Rahul Sharma",
      "role": "student",
      "email": "rahul@example.com",
      "created_at": "2026-02-20 15:00:00",
      "updated_at": "2026-02-20 15:00:00"
    }
  ]
}
```

---

### Get Single User
**GET** `/users/:id`

| Param | Type   | Description          |
|-------|--------|----------------------|
| `id`  | number | Auto-incremented row ID |

**Response `200`:**
```json
{
  "id": 1,
  "user_id": "u001",
  "full_name": "Rahul Sharma",
  "role": "student",
  "email": "rahul@example.com",
  "created_at": "2026-02-20 15:00:00",
  "updated_at": "2026-02-20 15:00:00"
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Update User
**PUT** `/users/:id`

**Request Body (JSON):**
```json
{
  "user_id": "u001",
  "full_name": "Rahul Kumar Sharma",
  "role": "teacher",
  "email": "rahul.new@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "User updated"
}
```

---

### Delete User
**DELETE** `/users/:id`

**Response `200`:**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## Auth

### Google Login
**POST** `/auth/google`

Verifies the Google ID token. If the email exists in `users`, logs in. Otherwise returns 404.

**Request Body (JSON):**
```json
{
  "id_token": "<GOOGLE_ID_TOKEN_FROM_CLIENT>"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "user_id": "u001",
    "full_name": "Rahul Sharma",
    "role": "student",
    "email": "rahul@example.com"
  }
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "User not found. Please register first."
}
```

**Response `401`:**
```json
{
  "success": false,
  "message": "Invalid Google token"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

Generates a reset token (valid 1 hour) and calls `EMAIL_API_URL` (`/send-email`) with the reset link.

**Request Body (JSON):**
```json
{
  "email": "rahul@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email."
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "No account found with this email."
}
```

---

### Reset Password
**POST** `/auth/reset-password`

Validates the token from the reset link and sets a new password (SHA-256 hashed).

**Request Body (JSON):**
```json
{
  "token": "<TOKEN_FROM_RESET_LINK>",
  "new_password": "myNewPassword123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password updated successfully."
}
```

**Response `400`:**
```json
{
  "success": false,
  "message": "Invalid or already used token."
}
```

---

### Send Email *(internal / implement here)*
**POST** `/send-email`

Blank endpoint — add your email sending logic inside `src/routes/auth.js`.

**Request Body (JSON):**
```json
{
  "email": "rahul@example.com",
  "subject": "Your subject",
  "body": "Email body text"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Email sent."
}
```

---

## Quick Test with cURL

```bash
# Create
curl -X POST http://localhost:8787/users \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u001","full_name":"Rahul Sharma","role":"student","email":"rahul@example.com"}'

# Get all
curl http://localhost:8787/users

# Get one
curl http://localhost:8787/users/1

# Update
curl -X PUT http://localhost:8787/users/1 \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u001","full_name":"Rahul Kumar","role":"teacher","email":"rahul@example.com"}'

# Delete
curl -X DELETE http://localhost:8787/users/1
```

---

## Setup & Running

```bash
# Install dependencies
npm install

# Apply schema to local D1
npx wrangler d1 execute uniconnect_db --file=./db/schema.sql

# Apply schema to remote D1
npx wrangler d1 execute uniconnect_db --file=./db/schema.sql --remote

# Run locally
npm run dev

# Deploy to Cloudflare
npm run deploy
```
