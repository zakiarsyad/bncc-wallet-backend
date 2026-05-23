# Wallet App — API Contract

Base URL: `http://localhost:3000`

---

## Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token is returned from `POST /api/auth/login` and expires in **1 hour**.

---

## Endpoints

### POST /api/auth/register

Create a new user account. A wallet is automatically created alongside the user.

**Auth required:** No

**Request body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Full name |
| `email` | string | ✓ | Must be unique |
| `password` | string | ✓ | Plain text — hashed on the server |

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alice",
      "email": "alice@example.com",
      "status": "ACTIVE",
      "created_at": "2026-05-23T00:00:00.000Z",
      "updated_at": "2026-05-23T00:00:00.000Z"
    },
    "wallet": {
      "id": "uuid",
      "user_id": "uuid",
      "balance": 0,
      "currency": "IDR",
      "status": "active",
      "created_at": "2026-05-23T00:00:00.000Z",
      "updated_at": "2026-05-23T00:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Message | Cause |
|---|---|---|
| `400` | `name, email, and password are required` | Missing field |
| `409` | `Email already registered` | Duplicate email |
| `500` | `<database error>` | Server error |

---

### POST /api/auth/login

Authenticate with email and password. Returns a JWT token.

**Auth required:** No

**Request body:**
```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✓ | Registered email |
| `password` | string | ✓ | Plain text |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alice",
      "email": "alice@example.com",
      "status": "ACTIVE",
      "created_at": "2026-05-23T00:00:00.000Z",
      "updated_at": "2026-05-23T00:00:00.000Z"
    },
    "token": "eyJhbGci..."
  }
}
```

**Errors:**

| Status | Message | Cause |
|---|---|---|
| `400` | `email and password are required` | Missing field |
| `401` | `Invalid email or password` | Wrong credentials |
| `500` | `<database error>` | Server error |

---

### GET /api/wallet

Get the authenticated user's wallet balance and info.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "balance": 150000,
    "currency": "IDR",
    "status": "active",
    "created_at": "2026-05-23T00:00:00.000Z",
    "updated_at": "2026-05-23T00:00:00.000Z"
  }
}
```

**Errors:**

| Status | Message | Cause |
|---|---|---|
| `401` | `No token provided` | Missing Authorization header |
| `401` | `Invalid or expired token` | Bad or expired JWT |
| `404` | `Wallet not found` | No wallet for this user |
| `500` | `<database error>` | Server error |

---

### POST /api/wallet/topup

Add funds to the authenticated user's wallet.

**Auth required:** Yes

**Request body:**
```json
{
  "amount": 50000
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | number | ✓ | Must be a positive number (in IDR) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "balance": 200000,
    "currency": "IDR",
    "status": "active",
    "created_at": "2026-05-23T00:00:00.000Z",
    "updated_at": "2026-05-23T00:00:00.000Z"
  }
}
```

**Errors:**

| Status | Message | Cause |
|---|---|---|
| `400` | `amount must be a positive number` | Invalid or missing amount |
| `401` | `No token provided` | Missing Authorization header |
| `401` | `Invalid or expired token` | Bad or expired JWT |
| `404` | `Wallet not found` | No wallet for this user |
| `500` | `<database error>` | Server error |

---

## Summary Table

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create user + wallet |
| `POST` | `/api/auth/login` | No | Get JWT token |
| `GET` | `/api/wallet` | Yes | Get wallet info + balance |
| `POST` | `/api/wallet/topup` | Yes | Add funds to wallet |

---

## Error Response Shape

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

---

## Not Yet Implemented

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/wallet/withdraw` | Remove funds from wallet |
| `POST` | `/api/transfers` | Send money to another wallet |
| `GET` | `/api/transfers/history` | List past transactions |
