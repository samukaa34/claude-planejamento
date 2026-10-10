# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GitHub Repository

Repositório: https://github.com/samukaa34/claude-planejamento

**Auto-sync ativo:** a cada arquivo editado ou criado por Claude Code, um hook PostToolUse executa automaticamente `git add -A && git commit && git push origin main`. Nenhuma ação manual é necessária para manter o GitHub atualizado.

## Commands

```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build
npm run preview  # preview production build
```

There is no test suite and no linter configured.

## Architecture

**Financial planning SPA** for a financial advisor to manage clients' monthly income/expense data. UI is in Brazilian Portuguese. Persistence and auth are on Supabase (project `claude-planejamento`, ref `kvzbcpcwqualgvltdbcm`, region sa-east-1). The URL and publishable key come from `.env.local` (see `.env.example`).

### Data model

Two Postgres tables, both protected by RLS so each signed-in user only sees their own rows:
- `clients` — one row per client, owned by `user_id`
- `month_data` — one row per `(client_id, month_key)` (format `YYYY-MM`), with `income` / `expenses` as `jsonb`

The schema lives in `supabase/migrations/`.

In the app, a `monthData` record has `{ monthKey, income, expenses, notes, savedAt }` where `income` and `expenses` are objects whose keys map to arrays of `{ description, amount }` line items. The canonical shape comes from `EMPTY_INCOME` / `EMPTY_EXPENSES` in `src/constants/categories.js`.

All reads/writes go through `src/data/store.js` — never call Supabase tables directly elsewhere. After login, `loadAll()` pulls every client and month into an in-memory copy, so reads are synchronous; writes are async, hit Supabase first and then update the copy.

`src/data/localStorage.js` only reads the pre-Supabase browser data (`fp_clients`, `fp_data_<clientId>`) for the one-time import banner on `ClientListPage`.

### Auth

`AuthProvider` (`src/components/auth/`) wraps the routes: it shows `LoginPage` (email + password) when there is no session and loads the data before rendering any page. `useAuth()` exposes `user` and `signOut`.

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
