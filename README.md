# Ledgerly Expenses Tracker

A production-oriented full-stack expenses tracker built as a TypeScript monorepo. The backend exposes authenticated MySQL CRUD and reporting APIs; the Vite React frontend provides a responsive ledger, monthly chart, filters, pagination, notifications, and PDF downloads.

## Stack

- Backend: Node.js, Express, TypeScript, ES modules, MySQL2, Joi, JWT, Pino, Helmet, PDFKit
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, Recharts, jsPDF, react-hot-toast

## Project tree

```text
expenses_tracker/
├── backend/
│   ├── src/
│   │   ├── common/          # API response helper and global types
│   │   ├── config/          # envalid configuration and MySQL pool
│   │   ├── constants/       # status, error, success constants
│   │   ├── database/        # schema, migration runner, seed placeholder
│   │   ├── errors/          # typed application errors
│   │   ├── helpers/         # hashing and JWT wrappers
│   │   ├── logger/          # Pino logger
│   │   ├── middlewares/     # auth, validation, error handling
│   │   ├── modules/
│   │   │   ├── controllers/
│   │   │   ├── repositories/ # prepared MySQL queries
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # forms, chart, pagination
│   │   ├── context/           # authentication state
│   │   ├── pages/             # authentication page
│   │   ├── utils/             # Axios client and errors
│   │   └── App.tsx
│   └── package.json
├── package.json
└── README.md
```

## Local setup

### Prerequisites

- Node.js 20+
- MySQL 8+
- npm 10+

### Install and configure

```powershell
npm install
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Create the database schema:

```powershell
npm run db:migrate
```

Start both applications:

```powershell
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

### Environment inventory

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | development, test, or production mode |
| `PORT` | API listener port |
| `CORS_ORIGIN` | Allowed frontend origin |
| `JWT_SECRET` | Token signing secret, at least 32 random characters |
| `JWT_EXPIRES_IN` | Token lifetime, such as `7d` |
| `DB_HOST`, `DB_PORT` | MySQL connection address |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL credentials and schema |
| `LOG_LEVEL` | Pino log level |
| `API_BASE_URL` | Backend base URL |
| `VITE_API_URL` | Frontend Axios API prefix |

No application code reads `process.env` directly except `backend/src/config/env.config.ts`; `envalid` validates and exports the typed configuration object.

## API documentation

All successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": "..." }`. Protected routes require `Authorization: Bearer <token>`.

### Authentication

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ava Stone","email":"ava@example.com","password":"password123"}'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@example.com","password":"password123"}'
```

### Expenses

```bash
curl "http://localhost:4000/api/expenses?page=1&limit=10&search=coffee&category=Food" \
  -H "Authorization: Bearer TOKEN"

curl -X POST http://localhost:4000/api/expenses \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":12.50,"category":"Food","description":"Coffee","spentAt":"2026-09-16"}'

curl -X PUT http://localhost:4000/api/expenses/1 \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":14,"category":"Food","description":"Lunch","spentAt":"2026-09-16"}'

curl -X DELETE http://localhost:4000/api/expenses/1 -H "Authorization: Bearer TOKEN"
```

`GET /api/expenses` supports `page`, `limit`, `search`, `category`, `from`, and `to`. The repository applies filters as prepared parameters and calculates `LIMIT` and `OFFSET`.

### Reports

- `GET /api/reports?from=2026-01-01&to=2026-12-31` returns category totals.
- `GET /api/reports/monthly?year=2026` returns twelve chart-ready monthly totals.
- `GET /api/reports/pdf?from=2026-01-01&to=2026-12-31` streams a PDFKit report.

## Constants pattern

HTTP codes live in `backend/src/constants/statusCodes.ts`; reusable error text lives in `errorMessages.ts`; successful operation text lives in `successMessages.ts`. Controllers use these constants when selecting response status and services use them for domain messages. This keeps response contracts consistent, prevents duplicated string literals, and makes later localization or API versioning safer. Database and infrastructure errors are logged centrally with Pino while clients receive a stable generic message.

## Verification

```powershell
npm run typecheck
npm run build
```
