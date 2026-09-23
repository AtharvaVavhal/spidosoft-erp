# SpidoSoft ERP — Frontend

React 19 · TypeScript (strict) · Vite 8 · React Router · TanStack Query · Axios · React Hook Form · Zod
(+ `@hookform/resolvers`) · CSS Modules · CSS Variables · Lucide React · oxlint.

Implements the **locked UI design system r5** (`docs/06-ui-specification.md`): "Steel Cobalt on Ink
Neutrals", Inter 400/500/600, tabular numbers.

## Commands

```bash
npm run dev        # http://localhost:5173 — proxies /api to http://localhost:8080 (Spring Boot)
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
```

Environment: see `.env.example` (`VITE_API_BASE_URL`, `VITE_API_PROXY_TARGET`, `VITE_USE_MOCKS`).

## Data sources

- **Real API:** `/api/system/health` and `/api/system/version` (Dashboard → Backend status).
- **Mock adapters (in memory, fictitious sample data):** Item, Customer and Supplier. Each implements a
  data-source interface in `src/services/<domain>/`, so it can be swapped for an HTTP adapter once the
  backend contracts are implemented (`docs/10` §10). Mock states can be forced with `?mock=slow`,
  `?mock=error` or `?mock=empty`.
- **Mapping GridView** is UI state only. The persistence model is intentionally deferred.

## Structure (`src/`)

| Folder | Contents |
|---|---|
| `app/` | `App`, router (lazy routes), query client |
| `components/` | Design system: Button, IconButton, Input, Select, Textarea, Checkbox, Radio, FormField, Badge, DataTable, Pagination, Dialog/ConfirmDialog, Breadcrumbs, Alert, Toast, Empty/Error/Loading states, Panel, PageHeader, Tbd markers |
| `layouts/` | AppLayout (shell), Sidebar, TopBar, ListPageLayout, SearchToolbar, FormActionBar |
| `pages/` | Dashboard, Item Master (list, create, view/edit + mapping section), Customer/Supplier shells, 404 |
| `services/` | Axios client + `ApiError`, system service, domain data-source interfaces + mock adapters |
| `hooks/` | TanStack Query hooks, URL list params, document title, local storage |
| `types/` | API envelope, ItemMaster / CustomerMaster / SupplierMaster (exact column names), mapping |
| `styles/` | `design-tokens.css` (palette tier → role tier), `global.css` |
| `utils/` | formatting, confirmed column limits, Zod helpers |

Components use **role tokens only** (`--color-*`, `--shadow-*`, …), never palette values.

The pre-ERP `MaintenancePage` (with `index.css` and `styles/tokens.css`) is kept but no longer routed.
