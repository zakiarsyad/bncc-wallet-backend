# Wallet App — Agent Guide

## Project Overview

A Node.js/Express REST API for a wallet application. Implements user registration (with auto wallet creation), login with JWT, wallet balance retrieval, and wallet top-up.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: Supabase (`@supabase/supabase-js`) — `users` and `wallets` tables
- **Auth**: `jsonwebtoken` (JWT, 1h expiry)
- **Password hashing**: Node built-in `crypto` (SHA-256)
- **Environment**: loaded via `node --env-file=.env`

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the real values — never commit `.env` (it's in `.gitignore`).
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

```bash
npm start
# Server listens on http://localhost:3000
```

## Architecture

```
index.js                    # Express app + route declarations
src/
  config/db.js              # Supabase client singleton
  middleware/auth.js        # JWT authenticate middleware
  controllers/
    auth.js                 # register, login
    wallet.js               # getWallet, topup
  services/
    auth.js                 # validation, hashing, JWT signing
    wallet.js               # wallet business logic
  repositories/
    auth.js                 # users table queries
    wallet.js               # wallets table queries
```

Keep database calls in repositories, business rules in services, HTTP concerns in controllers.

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (bypasses RLS — keep secret) |
| `JWT_SECRET` | Secret used to sign JWT tokens — use a long random string |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Health check |
| POST | `/api/auth/register` | Public | Create user + wallet |
| POST | `/api/auth/login` | Public | Return JWT token |
| GET | `/api/wallet` | Auth | Get my balance + wallet info |
| POST | `/api/wallet/topup` | Auth | Add funds to my wallet |
| POST | `/api/wallet/withdraw` | Auth | Remove funds from my wallet |
| POST | `/api/transfers` | Auth | Send money to another wallet |
| GET | `/api/transfers/history` | Auth | List my past transactions |

> Endpoints marked **Auth** require `Authorization: Bearer <token>` header.

---

### POST /api/auth/register

**Body**: `{ "name": "Alice", "email": "alice@example.com", "password": "secret" }`

**201**:
```json
{
  "success": true,
  "data": {
    "user": { "id", "name", "email", "status", "created_at", "updated_at" },
    "wallet": { "id", "user_id", "balance", "currency", "status", "created_at", "updated_at" }
  }
}
```

**Errors**: `400` missing fields, `409` email already registered.

---

### POST /api/auth/login

**Body**: `{ "email": "alice@example.com", "password": "secret" }`

**200**:
```json
{
  "success": true,
  "data": {
    "user": { "id", "name", "email", "status", "created_at", "updated_at" },
    "token": "<jwt>"
  }
}
```

**Errors**: `400` missing fields, `401` invalid credentials.

---

### GET /api/wallet

**200**:
```json
{ "success": true, "data": { "id", "user_id", "balance", "currency", "status", "created_at" } }
```

---

### POST /api/wallet/topup

**Body**: `{ "amount": 50000 }`

**200**: Returns updated wallet with new balance.

**Errors**: `400` invalid amount.

---

## Protecting Routes with JWT

```js
const { authenticate } = require('./src/middleware/auth');

app.get('/api/some-protected-route', authenticate, yourHandler);
```

`req.user` inside the handler contains `{ id, email }` decoded from the token.

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | primary key |
| `name` | text | |
| `email` | text | unique |
| `password` | text | SHA-256 hex |
| `status` | text | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### wallets
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | primary key |
| `user_id` | UUID | FK → users.id |
| `balance` | bigint | default 0 |
| `currency` | text | default 'IDR' |
| `status` | text | default 'active' |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

## Known Limitations

- Passwords use SHA-256 (fast hash) — migrate to bcrypt/argon2 before production.
- No test suite.
- `withdraw` and `transfers` endpoints not yet implemented.
