# Expenses Tracker API

Express + TypeScript API using MySQL, prepared statements, Joi validation, JWT authentication, Pino logging, and PDFKit reports.

## Local commands

```powershell
Copy-Item .env.example .env
npm run db:migrate
npm run dev
```

The API runs at `http://localhost:4000` by default. Environment access is intentionally isolated to `src/config/env.config.ts`.
