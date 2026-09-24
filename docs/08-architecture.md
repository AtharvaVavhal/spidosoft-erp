# 08 · Architecture

> **We are building the ERP from scratch.** This is a TECHNICAL DECISION by the development team,
> not a Spidosoft requirement. **Implemented today (Phase 3 foundation):** the frontend design
> system, shell and screens on mock data adapters, and the backend foundation (system endpoints,
> error handling, domain contracts only). **Not implemented:** database access, entities,
> repositories, domain endpoints and mapping persistence (blocked on Phase 4, `10` §10).

## Overview

```
React + TypeScript + Vite          (frontend/)
        ↓   HTTP/JSON  /api/*
Spring Boot + Java 21              (backend/ — foundation only, no persistence)
        ↓   JDBC
Database (TO BE CONFIRMED)         dbo.ItemMaster · dbo.CustomerMaster · dbo.SupplierMaster
```

Frontend and backend are separate deployable concerns. The frontend never accesses the database
directly, and business rules and validation live in the backend (validation is also mirrored in
the UI).

## Frontend: `frontend/`

| Concern | Choice | In scaffold today? |
|---|---|---|
| Framework / build | React + TypeScript (strict) + Vite | ✅ |
| Styling | CSS Modules + CSS Variables | ✅ |
| Routing | React Router (lazy routes) | ✅ Phase 3 |
| Server state | TanStack Query | ✅ Phase 3 |
| HTTP client | Axios (`ApiResponse` envelope unwrapping, `ApiError`) | ✅ Phase 3 |
| Forms / validation | React Hook Form + Zod + `@hookform/resolvers` | ✅ Phase 3 |
| Icons | Lucide React | ✅ Phase 3 |
| Lint | oxlint | ✅ |

- The scaffold's `MaintenancePage` stays untouched until the user decides otherwise.
- In development, the Vite dev server proxies `/api` to the backend (TECHNICAL DECISION).

### UI architecture and design system (PROJECT UI STANDARD)

The Target ERP must meet the UI quality bar in `06-ui-specification.md` §1–§5: world-class,
production-grade, with Linear-level clarity, Vercel-level visual discipline and high information
density without clutter. Architecturally this means:

1. **The design system is its own layer and is built first** (delivered in Phase 3), before multiple ERP screens
   exist. Feature screens may not define their own colours, spacing, typography or one-off controls.
2. **Tokens as CSS Variables** (`:root`), consumed by CSS Modules. No hard-coded colour or spacing
   values in feature code.
   - **Colour direction:** Steel Cobalt on Ink Neutrals, **UI DESIGN SYSTEM — LOCKED** (r5,
     2026-09-23; `06-ui-specification.md` is authoritative). Implemented in Phase 3 as CSS Variables in
     `frontend/src/styles/design-tokens.css`. The Spidosoft Reference Screenshots do not dictate the palette. It uses a
     single accent (no secondary accent), no gradients, and light mode only.
   - **Two token tiers** (IMPLEMENTED in `design-tokens.css`):
     - *Palette tier*: the raw locked (r5) values, i.e. `primary.600/700/800/subtle`, `on-primary`,
       `bg.canvas/surface/subtle/muted`, `border.subtle/default/control`,
       `text.primary/secondary/tertiary/disabled`, `success|warning|danger.solid/text/tint/border`,
       and the categorical and sequential chart scales (sequential step 4 = `#4974B9` since r4).
     - *Role tier*: semantic roles that components consume, e.g. `link` → `primary.700`,
       `focus-ring` → `primary.600`, `selection-bg` → `primary.subtle`, `control-border` →
       `border.control`, `info-bg/info-text/info-icon` → `bg.subtle`/`text.secondary`/`primary.600`,
       `chart-grid` → `border.subtle`, `chart-axis-text` → `text.tertiary`, `chart-label-on-light`
       (steps 1–3) → `text.primary`, `chart-label-on-dark` (steps 4–6) → `on-primary`,
       `shadow-sm/md` and `overlay-scrim` → `text.primary` rgb with the alphas documented in `06` §3.1.
     - Components consume **only role tokens**, so palette revisions after validation (e.g. r3's
       `text.tertiary` change to `#5C6877`) don't touch components.
   - **Accessibility constraints encoded in components, not left to screens:**
     - form-control components render on a `bg.surface` fill, so `border.control` (3.15:1 on white)
       keeps its 3:1 even inside canvas-coloured filter bars
     - one filled primary button per view; the focus ring is 2px `primary.600` with a white offset;
       selection = `primary.subtle` + checkbox; status badges/alerts always pair colour with text or
       an icon
     - chart components draw series only from the data-viz scales, never from success/danger, and
       choose label colour by sequential step (dark on 1–3, white on 4–6)
   - **System rules owned by design-system components (r4)**, so screens cannot deviate:
     - *Table*: `<colgroup>` fixed widths for stable columns, sized for their longest value (date/time
       160px), one flexible ellipsis column, a declared
       minimum width, horizontal scroll inside its panel, and one geometry shared by the
       loading/empty/error/loaded states
     - *ListPage layout*: fills the viewport height, the table body scrolls, and header, toolbar and
       pagination stay visible
     - *Toolbar*: Search is a secondary button and Enter submits. Only the page header's create action
       is filled primary. One row at ≥1280px, with the search field as the only shrinking element
       (min 200px).
     - *RowDeleteButton*: neutral by default, danger on hover. The danger fill belongs only to
       ConfirmDialog.
     - *FormField*: required marker (asterisk, `danger.text`, `aria-hidden`) plus `aria-required`.
       FormLayout renders the "Fields marked * are required" note.
     - *Sidebar NavItem*: active = white fill + `border.default` outline + `primary.600` icon
     - *TopBar*: no wrapping, breadcrumb collapse to "… / Current Page", branch-name truncation,
       critical actions always present. Validated at 768px.
   - **Typography token (r4):** Inter 400/500/600, with tabular numbers applied by Table, code cells
     and NumericInput. How Inter is delivered in production (self-hosted font files vs a hosted
     font service) is **TO BE CONFIRMED**. Any font package needs explicit approval. The scaffold's
     Plus Jakarta Sans import is not carried into the ERP.
   - **Theming:** light mode is the only v1 theme. Dark mode is deferred, and the role tier makes it
     a later override set rather than a refactor.
   - **Visual validation prototype:** `prototypes/visual-validation/` was an isolated, static
     reference used for the design-system validation. Production code never imported from it. It was
     removed on 2026-09-24 and is preserved in git history at commit `a7023ec`.
   - **Validation gate:** the design system is locked on the basis of the prototype validation. The
     visual-validation checklist in `06` §3.3 must still be run on the real components (≈50-row Item Master table, Item Master form, sidebar,
     search/filters, buttons, badges, selected/hover rows, keyboard focus, empty/error states, chart
     example). **Accessibility checks are repeated on the implemented components**, because computed
     ratios are only a pre-check.
3. **Layering and dependency direction**

   ```
   pages/ + layouts/      screens, feature components, Zod schemas     (Spidosoft terminology lives here)
          ↓ uses
   hooks/ → services/     TanStack Query hooks → data-source interfaces (mock or HTTP adapter)
          ↓ uses
   components/ + styles/  design system: role tokens + accessible, generic components (no business logic)
   ```
   `components/` never imports from `pages/`, `hooks/` or `services/`.

4. **Folder structure** (IMPLEMENTED in Phase 3, as specified by the project owner):
   ```
   frontend/src/
   ├── app/         # App providers, router (lazy routes), query client
   ├── components/  # design system (Button, Input, Select, Textarea, Checkbox, Radio, FormField, Badge,
   │                #  DataTable, Pagination, Dialog/ConfirmDialog, Breadcrumbs, Alert, Toast, states, Panel, …)
   ├── layouts/     # AppLayout, Sidebar, TopBar, ListPageLayout, SearchToolbar, FormActionBar
   ├── pages/       # Dashboard, items/, customers/, suppliers/, masters/ (shared shells), 404
   ├── services/    # Axios client, ApiError, system service, domain data-source interfaces + mock adapters
   ├── hooks/       # TanStack Query hooks, URL list params, …
   ├── types/       # API envelope; ItemMaster/CustomerMaster/SupplierMaster with exact column names
   ├── styles/      # design-tokens.css (palette tier → role tier), global.css
   └── utils/       # formatting, confirmed column limits, Zod helpers
   ```
   **Not yet built** (spec'd in `06`): Combobox, Drawer, DropdownMenu, Tabs. The decision to build
   in-house vs adopt a headless library is still TBD (item 7). Native `<select>` and `<dialog>` are used
   meanwhile.
5. **Forms:** React Hook Form + Zod drive validation state, and the design-system inputs render the
   accessible error feedback (`aria-invalid`, `aria-describedby`).
6. **Server state:** TanStack Query supplies loading, error and empty states, which map 1:1 to the
   design-system Skeleton, ErrorState and EmptyState components.
7. **Accessible primitives:** complex widgets (combobox, dialog, drawer, dropdown menu, tabs, toast)
   must follow WAI-ARIA patterns. Whether to build them in-house or adopt a headless accessibility
   library is **TO BE CONFIRMED**. Such a library is not part of the approved stack, so it needs explicit
   approval before installing.
8. **Quality gates:** Vitest + Testing Library + jsdom unit/component tests (`npm run test`,
   IMPLEMENTED), including axe checks on rendered components and a contrast re-check of the token
   palette (IMPLEMENTED). A real-browser axe + keyboard pass was run on 2026-09-24 (`06` §3.3). Still
   PROPOSED: running these in CI, a repeatable browser test suite, and a design-system catalogue page.

## Backend: `backend/` (Phase 3 foundation)
- **Stack:** Java 21, **Spring Boot 3.5.16**, **Maven** (wrapper `./mvnw`, Maven 3.9.16), Spring Web,
  Validation, Data JPA, springdoc-openapi 2.9.1, MapStruct 1.6.3, Lombok, DevTools, JUnit 5.
- **Implemented:**
  - `/api/system/health` and `/api/system/version`
  - `ApiResponse` envelope, `ErrorCode` + `GlobalExceptionHandler`
  - `X-Request-Id` correlation filter with request logging
  - `ColumnLimits` validation
  - OpenAPI at `/api/docs`
- **Contracts only:** Item, Customer and Supplier DTOs, mapper, service and controller interfaces. Not
  implemented, therefore not served.
- **Mapping:** placeholder interfaces only (persistence model intentionally deferred).
- **Profiles:**
  - `nodb` (default): no DataSource or JPA
  - `db`: env-variable placeholders, `ddl-auto: none`
  - No JDBC driver is declared, because the engine is TBD.
- `@Tbd` marks every code element waiting on a `docs/10` decision.
- Layers: Controller → Service → Repository.
- The data-access approach (Spring Data JPA vs JdbcTemplate) is **TO BE CONFIRMED**. No entities are
  created until the database is confirmed. Once they are:
  - names are mapped exactly as specified (`schema="dbo"`, original column names)
  - there is no schema auto-generation (`ddl-auto=none|validate`)
  - credentials come from environment variables.

## Database: TO BE CONFIRMED
- Engine, version, hosting and dev access are unknown.
- The requirement's `dbo.` objects and `varchar(max)` types are consistent with Microsoft SQL
  Server, but this is not confirmed. **MySQL must not be assumed.**
- Mapping storage and save strategy are unknown (`04-database-schema.md` §4).

## Environments: TO BE CONFIRMED
Local ports: Vite 5173 and Spring Boot 8080 (the Vite dev server proxies `/api`). Test/production
hosting and deployment remain TBD.
