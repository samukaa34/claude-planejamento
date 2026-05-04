# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build
npm run preview  # preview production build
```

There is no test suite and no linter configured.

## Architecture

**Financial planning SPA** for a financial advisor to manage clients' monthly income/expense data. UI is in Brazilian Portuguese. No backend — all persistence is through the browser's `localStorage`.

### Data model

Two storage keys per client:
- `fp_clients` — array of all client objects
- `fp_data_<clientId>` — object keyed by `monthKey` (format `YYYY-MM`), each value is a `monthData` record

A `monthData` record has `{ monthKey, income, expenses, notes, savedAt }` where `income` and `expenses` are objects whose keys map to arrays of `{ description, amount }` line items. The canonical shape comes from `EMPTY_INCOME` / `EMPTY_EXPENSES` in `src/constants/categories.js`.

All reads/writes go through `src/data/localStorage.js` — never touch `localStorage` directly elsewhere.

### Routing

```
/                                → ClientListPage
/cliente/:clientId               → ClientDetailPage
/cliente/:clientId/mes/:monthKey → MonthEntryPage
/cliente/:clientId/analise       → AnalysisPage
```

### Hooks

Custom hooks wrap the data layer and are the intended interface for pages/components:
- `useClients` — CRUD for the client list
- `useFinancialData(clientId)` — month-level CRUD (list, get, save, delete)
- `useAnalysis(clientId)` — computes summaries and trends across all months for a client

### Analysis logic

`src/utils/analysis.js` contains the three core functions used throughout the analysis view:
- `computeMonthSummary(monthData)` → totals, savings rate, category breakdown
- `computeTrend(entries)` → direction (improving / stable / worsening) from half-period comparison
- `generateInsights(summary, trend, monthKey)` → Portuguese-language advisory strings

Financial thresholds (savings rate targets, max category share) live in `src/constants/thresholds.js` and are the single source of truth for all insight rules.

### Component organization

```
src/components/
  ui/          # generic: Button, Modal, Badge, EmptyState, CurrencyInput
  layout/      # Header
  clients/     # ClientForm, ClientCard
  entry/       # EntryRow, CategorySection (month data entry)
  analysis/    # charts and tables (Recharts-based)
```
