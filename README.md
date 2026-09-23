# Spidosoft ERP

Enterprise Resource Planning platform for Spidosoft Technologies OPC Pvt. Ltd.

**Status: Documentation phase.** No application functionality is implemented. This repository
currently contains project documentation and a frontend starter scaffold only.

---

## Overview

Spidosoft ERP is a new, from-scratch ERP application. There is no prior ERP codebase being
migrated, replaced, or extended — this is a greenfield build.

The first formal functional scope is a single Spidosoft requirement: **"ItemMaster OR Customer
and SupplierMaster Mapping"** — maintaining Item, Customer, and Supplier master data, and mapping
an Item to one or more Suppliers or Customers through a UI-driven Add → GridView → Save flow.

Everything beyond that requirement (additional ERP modules, screens, and workflows) is out of
scope until formally supplied by Spidosoft.

## Current Status

| Area | Status |
|---|---|
| Requirements analysis | Complete |
| Reference UI analysis | Complete (mapping screen); Item List and Create Item Master screenshots not yet supplied |
| Documentation (`docs/01–10`) | Complete for Phase 1–2 scope |
| UI design system | Locked (r5) — not yet implemented |
| Database & requirements validation | In progress — blocked on Spidosoft decisions |
| Backend foundation | Not started |
| Frontend implementation (ERP screens) | Not started |
| Database persistence | Not started — engine and schema unconfirmed |
| Item ↔ Customer/Supplier mapping persistence | Blocked — storage structure unknown |
| Integration | Not started |
| Production deployment | Not started |

## Product Scope

Confirmed by the Supplied Requirement Material:

- **Item Master** — read/write access to `dbo.ItemMaster`.
- **Customer Master** — read/write access to `dbo.CustomerMaster`.
- **Supplier Master** — read/write access to `dbo.SupplierMaster`.
- **Mapping** — within the Item Master screen, a section to select a Supplier or Customer by
  code/name, add it to an on-screen list (GridView), and save the mapping.

Referenced but not yet in scope (screenshots not supplied): Item List (search, pagination, export,
print, upload) and the full Create Item Master screen.

## Architecture

```
React + TypeScript + Vite  (frontend/)
        │  HTTP/JSON  /api/*
        ▼
Spring Boot + Java 21      (backend/ — not created)
        │  JDBC
        ▼
Database — TO BE CONFIRMED
dbo.ItemMaster · dbo.CustomerMaster · dbo.SupplierMaster
```

The frontend never accesses the database directly. Business rules and validation live in the
backend and are mirrored in the UI for feedback. The database engine is unconfirmed; schema
evidence (`dbo` schema, `varchar(max)`) is consistent with Microsoft SQL Server but this is not a
confirmed decision.

## Technology Stack

| Layer | Technology | Status |
|---|---|---|
| Frontend framework | React, TypeScript, Vite | In scaffold |
| Frontend styling | CSS Modules, CSS Variables | In scaffold |
| Frontend routing | React Router | Planned, not installed |
| Server state | TanStack Query | Planned, not installed |
| HTTP client | Axios | Planned, not installed |
| Forms / validation | React Hook Form, Zod | Planned, not installed |
| Icons | Lucide React | Planned, not installed |
| Lint | oxlint | In scaffold |
| Backend | Java 21, Spring Boot | Not created |
| Data access | Spring Data JPA or JdbcTemplate | To be confirmed |
| Database | To be confirmed (evidence points to SQL Server, not confirmed) | Not started |

## Repository Structure

```
├── CLAUDE.md      Engineering rules, terminology, and source-of-truth policy for this project
├── docs/          Numbered project documentation (01–10), see Documentation below
└── frontend/      React + TypeScript + Vite starter scaffold (MaintenancePage only)
```

`backend/` does not exist yet. No database code, migrations, or tests exist yet.

## Application Modules

| Module | Status |
|---|---|
| Item Master (form) | Formally defined (requirement + reference UI); not implemented |
| Item List (search, pagination, export, print, upload) | Planned; scope depends on screenshots not yet supplied |
| Customer Master | Schema known; screen not yet specified |
| Supplier Master | Schema known; screen not yet specified |
| Item ↔ Customer/Supplier mapping | Functional flow specified (`docs/05`); persistence blocked |

## Design System

The UI design system is **locked at revision r5** (2026-09-23). Full specification:
[`docs/06-ui-specification.md`](docs/06-ui-specification.md).

- **Typography** — Inter, weights 400/500/600, tabular numbers in tables, codes, and numeric inputs.
- **Palette** — "Steel Cobalt on Ink Neutrals": primary `#2A5CAA` / `#234E93` / `#1D4179`;
  canvas `#F5F7FA`; surface `#FFFFFF`; text `#172033` / `#3F4B5F` / `#5C6877`. Single accent, no
  gradients, light mode only.
- **Density** — high information density without clutter; fixed table column widths sized to
  content, one flexible ellipsis column, list pages fill the viewport with a scrolling table body.
- **Component philosophy** — a design-system layer (tokens + generic accessible components) is
  built first and consumed by feature screens, which never define their own colors, spacing, or
  one-off controls.
- **Accessibility** — WCAG 2.2 AA contrast, visible keyboard focus, semantic HTML, and validation
  checks repeated against implemented components (not just the palette in isolation).
- **Responsive strategy** — validated at 1440, 1280, and 1024px desktop widths and a 768px
  top-bar breakpoint. Phone/mobile layout is not yet defined.

The lock covers the design system only — business and database open questions below are
unaffected by it.

## Development

The repository contains only a starter scaffold today. Inspect `frontend/package.json` before
relying on any command; do not assume scripts beyond what it defines.

```bash
cd frontend
npm run dev        # Vite dev server, http://localhost:5173
npm run build       # tsc -b && vite build
npm run lint         # oxlint
npm run typecheck    # tsc -b --noEmit
```

There is no backend to run. `backend/` has not been created.

## Environment Configuration

No environment variables are defined yet. Database connection details, credentials, and backend
configuration are unresolved pending the decisions in
[`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md).

## Testing & Quality

- **Frontend:** oxlint (lint) and `tsc` (typecheck) are configured in the scaffold. No automated
  test suite exists yet.
- **Backend:** no test setup exists; none can, since no backend exists.
- Planned quality gates (accessibility checks, keyboard walkthroughs, contrast checks) are
  documented in `docs/08-architecture.md` but not yet implemented.

## API

No API is implemented. `docs/07-api-specification.md` is a **provisional, team-authored proposal**,
not a Spidosoft requirement:

- Supplier/Customer option endpoints for the mapping drop-downs are proposed and could be built
  once the database is confirmed.
- Item Master CRUD endpoints are blocked on the primary-key semantics of `dbo.ItemMaster`.
- Mapping persistence endpoints are placeholders only — no shape is defined until mapping storage
  is confirmed.

## Database

### Confirmed
- `dbo.ItemMaster` (25 columns), `dbo.CustomerMaster` (28 columns), `dbo.SupplierMaster`
  (27 columns) exist in the Supplied Requirement Material, with exact column names, SQL types, and
  nullability recorded in [`docs/04-database-schema.md`](docs/04-database-schema.md).
- Schema name `dbo` for all three tables.
- Primary-key markers: `ItemMaster.ID` and `ItemMaster.ItemCode` (both marked PK),
  `CustomerMaster.Id`, `SupplierMaster.Id`.
- Foreign-key markers exist on several columns in ItemMaster and CustomerMaster (target tables not
  shown).

### Inferred
- The database engine is likely Microsoft SQL Server (`dbo` schema, `varchar(max)` usage), but this
  is **not confirmed**.
- `ItemMaster` likely has a composite primary key (`ID`, `ItemCode`).
- One Item can likely map to multiple Suppliers/Customers.

### Unresolved
- **Item ↔ Customer/Supplier mapping persistence has not been confirmed.** No mapping or junction
  table, column, or foreign key exists anywhere in the Supplied Requirement Material. Its
  structure is unknown and no mapping schema has been designed or will be invented.
- Database engine, version, hosting, and dev/production access.
- Foreign-key target tables (Manufacturer, Category, Unit, Colour, and others).
- Save/Delete/Clear persistence semantics for the mapping screen.
- Full Item Master required-field list and validation rules.
- Branch scoping, audit-field population, and authentication/authorization.

Full findings: [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md).

## Engineering Principles

From [`CLAUDE.md`](CLAUDE.md):

- Requirements-first: the Supplied Requirement Material is the functional source of truth.
- Never invent business rules, database tables, relationships, or API endpoints.
- Never assume the database engine.
- Database validation precedes any persistence implementation.
- Unknown information is explicitly marked TO BE CONFIRMED, not guessed.
- The UI design system is locked; screens compose it rather than defining one-off styles.
- Frontend and backend concerns stay separated; the frontend talks to the backend only through the API.

## Known Constraints & Open Decisions

Phase 2 (database and requirements validation) is blocked pending Spidosoft decisions on:

1. Database engine, version, and whether an existing database must be reused.
2. `ItemMaster` primary key semantics (composite key, identity behavior, `ItemCode` uniqueness).
3. Mapping storage — an existing table definition, or approval to design a new one.
4. Mapping semantics — can one Item map to both Suppliers and Customers; is it many-to-many; are duplicates allowed.
5. Party identifier — is a mapping keyed by `Id` or by Code; are codes unique and mandatory.
6. Exact Add/Save/Clear/Delete persistence behavior.
7. Full Item Master field list, required fields, and validation rules.
8. Authoritative source for paired text/foreign-key columns (e.g. `Color` vs `ColourId`) and their target tables.
9. Audit-field and branch-scoping population rules.
10. Confirmation of exact database column spellings against the documented schema.
11. Item List scope, pending the missing reference screenshots.

No backend code will be written until the items marked backend-blocking in `docs/10` §10 are
resolved.

## Roadmap

Per [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md), each phase starts only when
explicitly requested and its exit criteria are met:

1. Documentation and requirement analysis — in progress
2. Database discovery and confirmation — in progress, blocked on Spidosoft
3. Architecture and data model
4. Spring Boot backend foundation
5. Database integration
6. REST APIs
7. React application foundation and design system implementation
8. ERP shared modules
9. Item Master
10. Customer/Supplier mapping
11. Integration
12. Testing
13. Production readiness

No dates are committed.

## Documentation

| Document | Contents |
|---|---|
| [`docs/01-project-overview.md`](docs/01-project-overview.md) | Project context, client, current repository state |
| [`docs/02-requirements.md`](docs/02-requirements.md) | Formal requirements and open questions |
| [`docs/03-reference-ui.md`](docs/03-reference-ui.md) | Spidosoft Reference UI analysis |
| [`docs/04-database-schema.md`](docs/04-database-schema.md) | Column-level schema evidence for all three tables |
| [`docs/05-mapping-functional-flow.md`](docs/05-mapping-functional-flow.md) | Item ↔ Customer/Supplier mapping flow |
| [`docs/06-ui-specification.md`](docs/06-ui-specification.md) | Locked UI design system and screen specifications |
| [`docs/07-api-specification.md`](docs/07-api-specification.md) | Provisional API proposal |
| [`docs/08-architecture.md`](docs/08-architecture.md) | Planned frontend/backend architecture |
| [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md) | Phased implementation plan |
| [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md) | Phase 2 validation report and decisions required from Spidosoft |

## Project Information

**Client:** Spidosoft Technologies OPC Pvt. Ltd.
**Project type:** Enterprise Resource Planning platform, built from scratch.
