# Wallet App

A REST API for a digital wallet — user registration, JWT login, and balance top-up — built with Node.js, Express, and Supabase.

## Setup

```bash
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
npm install
npm start              # http://localhost:3000
```

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create user + wallet |
| POST | `/api/auth/login` | — | Get JWT token |
| GET | `/api/wallet` | Bearer | Get wallet balance |
| POST | `/api/wallet/topup` | Bearer | Add funds |

> Planned: `POST /api/wallet/withdraw`, `POST /api/transfers`, `GET /api/transfers/history`
