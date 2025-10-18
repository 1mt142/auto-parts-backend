# Auto Parts Inventory & Ordering System - API Documentation

### How to Run

git clone <repository-url>
cd <project-folder>

Create a .env file and copy the contents from .env.example into it.

GO PROJECT FOLDER and RUN BELLOW COMMAND

#1st run backend then run frontend

```bash
### Build development image
docker compose build --no-cache

### Start development
docker-compose up -d

### Run migrations manually
docker exec auto_parts_api npx prisma migrate deploy

### View logs
docker logs -f auto_parts_api

```

**Base URL:** `http://localhost:4000/api`

---

## 🔐 Authentication Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cuid123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Login

```
POST /auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cuid123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Logout

```
POST /auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Parts Endpoints

### Get All Parts (Public)

```
GET /parts?page=1&limit=10&q=brake&category=Brakes&minPrice=50&maxPrice=500
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `q` | string | - | Search by name, brand, or category |
| `category` | string | - | Filter by category |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "parts": [
      {
        "id": "cuid456",
        "name": "Brake Pad Set",
        "brand": "Brembo",
        "price": "125.50",
        "stock": 45,
        "category": "Brakes",
        "description": "High-performance brake pads",
        "image_url": "https://...",
        "created_at": "2024-10-17T10:30:00Z",
        "updated_at": "2024-10-17T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

---

### Get Single Part (Public)

```
GET /parts/:id
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "cuid456",
    "name": "Brake Pad Set",
    "brand": "Brembo",
    "price": "125.50",
    "stock": 45,
    "category": "Brakes",
    "description": "High-performance brake pads",
    "image_url": "https://...",
    "created_at": "2024-10-17T10:30:00Z",
    "updated_at": "2024-10-17T10:30:00Z"
  }
}
```

---

### Create Part (Auth Only)

```
POST /parts
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Brake Pad Set",
  "brand": "Brembo",
  "price": 125.5,
  "stock": 45,
  "category": "Brakes",
  "description": "High-performance brake pads",
  "image_url": "https://example.com/image.jpg"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Part created successfully",
  "data": {
    "id": "cuid456",
    "name": "Brake Pad Set",
    "brand": "Brembo",
    "price": "125.50",
    "stock": 45,
    "category": "Brakes",
    "description": "High-performance brake pads",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2024-10-17T10:30:00Z",
    "updated_at": "2024-10-17T10:30:00Z"
  }
}
```

---

### Update Part (Auth Only)

```
PUT /parts/:id
Authorization: Bearer <accessToken>
```

**Request Body:** (All fields optional)

```json
{
  "name": "Updated Brake Pad Set",
  "price": 135.99,
  "stock": 50
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Part updated successfully",
  "data": {
    "id": "cuid456",
    "name": "Updated Brake Pad Set",
    "brand": "Brembo",
    "price": "135.99",
    "stock": 50,
    "category": "Brakes",
    "description": "High-performance brake pads",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2024-10-17T10:30:00Z",
    "updated_at": "2024-10-17T11:45:00Z"
  }
}
```

---

### Delete Part (Auth Only)

```
DELETE /parts/:id
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Part deleted successfully"
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["\"name\" is required", "\"price\" must be a positive number"]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Part not found"
}
```

### Conflict (409)

```json
{
  "success": false,
  "message": "User already exists"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

**Token Format:** JWT (JSON Web Token)

**Token Expiry:**

- Access Token: 15 minutes
- Refresh Token: 7 days

---

## Validation Rules

### Register

- `name`: 2-100 characters, required
- `email`: Valid email format, required, unique
- `password`: 6-50 characters, required

### Login

- `email`: Valid email format, required
- `password`: Required

### Create/Update Part

- `name`: 2-255 characters, required (update optional)
- `brand`: 2-100 characters, required (update optional)
- `price`: Positive number with 2 decimals, required (update optional)
- `stock`: Non-negative integer, required (update optional)
- `category`: 2-100 characters, required (update optional)
- `description`: Max 1000 characters, optional
- `image_url`: Optional

---

## Example Requests (cURL)

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Parts

```bash
curl -X GET "http://localhost:4000/api/parts?page=1&limit=10&q=brake"
```

### Create Part (Requires Auth)

```bash
curl -X POST http://localhost:4000/api/parts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Brake Pad Set" \
  -F "brand=Brembo" \
  -F "price=125.50" \
  -F "stock=45" \
  -F "category=Brakes" \
  -F "description=High-performance brake pads" \
  -F "image=@/path/to/image.jpg"
```

---

### Get Parts

```bash
curl -X GET "http://localhost:4000/api/parts?page=1&limit=10&q=brake"
```

### Update Part (Requires Auth)

```bash
curl -X PUT http://localhost:4000/api/parts/cuid456 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Updated Brake Pad Set" \
  -F "price=135.99" \
  -F "image=@/path/to/new-image.jpg"
```

## Roles

| Role     | Permissions                        |
| -------- | ---------------------------------- |
| `user`   | Create, read, update, delete parts |
| `anyone` | read                               |

---

## 🔗 Health Check

```
GET /health
```

**Response (200):**

```json
{
  "status": "ok"
}
```
