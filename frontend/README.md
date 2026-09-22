# Ledgerly Web

The React client for Ledgerly, a rupee-based personal expense tracker.

## Client features

- Login and registration with validation feedback.
- Responsive desktop sidebar and mobile-friendly dashboard controls.
- Add, edit, and delete expenses from a shared modal form.
- Search descriptions and categories in real time.
- Filter by Food, Transport, Home, Health, Entertainment, or Other.
- Server-backed pagination with configurable page size.
- Monthly spending chart and live This month summary.
- Indian rupee (`₹`) formatting throughout the dashboard and reports.
- Success, loading, and failure toasts for authentication and expense actions.
- Yearly jsPDF report download.

## Local development

From this folder:

```powershell
Copy-Item .env.example .env
npm run dev
```

Or start it with the backend from the repository root:

```powershell
npm run dev
```

The client defaults to `http://localhost:5173` and sends API requests to `VITE_API_URL`, which defaults to `http://localhost:4000/api` when unset.

## Client structure

```text
src/
├── components/    # ExpenseForm, MonthlyChart, Pagination
├── context/       # AuthContext and session state
├── pages/         # AuthPage
├── utils/         # Axios client and API error mapping
├── App.tsx        # Dashboard and authenticated experience
├── styles.css     # Tailwind layers and shared input styles
└── types.ts       # Shared frontend interfaces
```

## Validation

```powershell
npm run typecheck
npm run build
```
