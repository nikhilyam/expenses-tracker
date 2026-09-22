# Ledgerly Expenses Tracker

A production-oriented full-stack expenses tracker built as a TypeScript monorepo. The backend exposes authenticated MySQL CRUD and reporting APIs; the Vite React frontend provides a responsive ledger, monthly chart, filters, pagination, notifications, and PDF downloads.

## Project explanation

Ledgerly is a full stack expense tracker that helps users record, organize, search, and analyze personal spending. React and Tailwind power the responsive dashboard, while an Express and TypeScript API manages JWT authentication, validation, MySQL data, reports, and PDF exports. It provides secure and actionable financial insight in one place.

The project is organized as a monorepo with two applications:

- **Frontend:** A React and Vite single-page application where users authenticate, manage expenses, review monthly activity, and download reports. Tailwind CSS provides the responsive layout, Recharts renders the monthly chart, Axios communicates with the API, and toast notifications communicate request status.
- **Backend:** An Express and TypeScript REST API that validates requests, authenticates users with JWTs, applies ownership rules, runs prepared MySQL queries, calculates report totals, and streams PDF reports. Pino handles structured logging and Helmet adds common HTTP security headers.
- **Database:** MySQL stores users and expenses. Expenses belong to a user through a foreign key, and indexes support the dashboard's date, category, and pagination queries.

### How a typical request works

1. The user submits an action in the React dashboard, such as adding an expense.
2. Axios sends the request to the Express API with the stored bearer token.
3. Route middleware validates the request with Joi and verifies the token.
4. The controller passes trusted input to a service, where business rules are applied.
5. The repository executes a prepared MySQL query and maps database rows to application types.
6. The API returns a consistent success or error response.
7. The dashboard refreshes affected data and shows a success or failure notification.

This separation keeps UI concerns, HTTP concerns, business logic, and database access independent. It also makes the project easier to test, extend with additional reports, and deploy as separate frontend and backend services.

## Stack

- Backend: Node.js, Express, TypeScript, ES modules, MySQL2, Joi, JWT, Pino, Helmet, PDFKit
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, Recharts, jsPDF, react-hot-toast

## Features

### Authentication and security

- Register with name, email, and an eight-character minimum password.
- Sign in with JWT-based authentication and restore sessions from browser storage.
- Hash passwords with `bcryptjs`; plaintext passwords are never stored.
- Protect expense and report routes with bearer-token authentication.
- Scope every expense query to the authenticated user.

### Expense management

- Add, edit, and delete expenses from a shared responsive form.
- Capture amount, category, date, and an optional description.
- Display currency in Indian rupees (`₹`).
- Use starter categories for Food, Transport, Home, Health, Entertainment, and Other.
- Refresh the monthly summary after every successful create, edit, or delete operation.

### Search, filters, and pagination

- Search expense descriptions and categories as you type.
- Filter by category from the dashboard.
- Choose 5, 10, or 25 records per page.
- Use server-side pagination backed by MySQL `LIMIT` and `OFFSET`.
- Handle empty and invalid pagination metadata without displaying `NaN` values.

### Insights and reports

- View visible spend and the current month's total.
- Explore monthly spending in a responsive bar chart.
- Download a yearly client-generated jsPDF statement.
- Request category totals or a server-generated PDFKit report from the API.

### User experience

- Responsive desktop sidebar with mobile-friendly controls.
- Loading, success, and error toast notifications for authentication and CRUD actions.
- Inline validation for required fields, dates, amounts, and password length.
- Security headers through Helmet and structured logging through Pino.

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

### Available scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm install` | Install root, backend, and frontend dependencies |
| `npm run dev` | Start backend and frontend concurrently |
| `npm run db:migrate` | Execute the MySQL schema migration |
| `npm run typecheck` | Run strict TypeScript checks in both workspaces |
| `npm run build` | Build the backend and production frontend bundles |

Workspace-specific commands can be run with npm's `--workspace` option, such as `npm run dev --workspace frontend`.

### First-use workflow

1. Start MySQL and configure the credentials in `backend/.env`.
2. Run `npm run db:migrate` to create the `users` and `expenses` tables.
3. Start the application and open the frontend URL.
4. Register a user, add expenses, then use search, filters, pagination, charts, and reports.

The migration is intentionally separate from application startup so deployments can run schema changes as an explicit release step.

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

### Endpoint reference

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Check API availability |
| `POST` | `/api/auth/register` | No | Create an account and return a token |
| `POST` | `/api/auth/login` | No | Authenticate an existing account |
| `GET` | `/api/expenses` | Yes | List, search, filter, and paginate expenses |
| `POST` | `/api/expenses` | Yes | Create an expense |
| `PUT` | `/api/expenses/:id` | Yes | Update an owned expense |
| `DELETE` | `/api/expenses/:id` | Yes | Delete an owned expense |
| `GET` | `/api/reports` | Yes | Return category totals for a date range |
| `GET` | `/api/reports/monthly` | Yes | Return twelve monthly totals for a year |
| `GET` | `/api/reports/pdf` | Yes | Stream a PDFKit category report |

### Validation and response model

Amounts must be positive and limited to two decimal places. Categories must be non-empty, dates must use ISO format, and IDs, pages, and limits must be positive integers. Pagination limits are capped at 100 records per request.

Successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": "..." }`. Internal details are logged server-side and are not exposed to clients.

### Reports

- `GET /api/reports?from=2026-01-01&to=2026-12-31` returns category totals.
- `GET /api/reports/monthly?year=2026` returns twelve chart-ready monthly totals.
- `GET /api/reports/pdf?from=2026-01-01&to=2026-12-31` streams a PDFKit report.

## Constants pattern

HTTP codes live in `backend/src/constants/statusCodes.ts`; reusable error text lives in `errorMessages.ts`; successful operation text lives in `successMessages.ts`. Controllers use these constants when selecting response status and services use them for domain messages. This keeps response contracts consistent, prevents duplicated string literals, and makes later localization or API versioning safer. Database and infrastructure errors are logged centrally with Pino while clients receive a stable generic message.

## Application architecture

```text
HTTP request
  -> Helmet/CORS/JSON/pino-http
  -> route validation and authentication
  -> controller
  -> service business logic
  -> repository prepared SQL
  -> MySQL
  -> standardized response or centralized error handler
```

- `config` owns environment validation and the database pool.
- `routes` define the HTTP surface and attach middleware.
- `controllers` translate HTTP input into service calls.
- `services` enforce business rules and coordinate repositories.
- `repositories` are the only application modules that issue SQL queries.
- `constants` centralize status codes and client-facing messages.
- The frontend uses `AuthContext`, one Axios client for bearer-token injection, and reusable form, chart, and pagination components.

## Data model

The migration creates two tables:

- `users`: identity, unique email, password hash, and creation timestamp.
- `expenses`: owner, amount, category, description, spent date, and creation timestamp.

Expenses reference users with a foreign key and cascade on user deletion. Indexes support owner/date and owner/category access patterns.

## Verification

```powershell
npm run typecheck
npm run build
```

## Troubleshooting

- **Database connection errors:** confirm MySQL is running and the `DB_*` values match the local server.
- **Environment validation errors:** ensure `backend/.env` exists and replace the sample `JWT_SECRET`.
- **Frontend cannot reach the API:** verify the backend is running on port 4000 and `VITE_API_URL` points to `/api`.
- **Port already in use:** change the backend `PORT` or Vite's `server.port`.
- **Empty dashboard:** register and sign in first; expenses belong to the authenticated user.
