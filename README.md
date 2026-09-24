<div align="center">

# Spidosoft ERP

**Enterprise Resource Planning Platform**
Built from scratch for Spidosoft Technologies OPC Pvt. Ltd.

![Status](https://img.shields.io/badge/status-phase_4_database_confirmation-8792A2?style=flat-square)
![Design System](https://img.shields.io/badge/design_system-locked_r5-2A5CAA?style=flat-square)
![Database](https://img.shields.io/badge/database-engine_unconfirmed-5C6877?style=flat-square)
![Backend](https://img.shields.io/badge/backend-foundation_only-A3ACB9?style=flat-square)

**Frontend (installed)**
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

**Backend foundation (no persistence)**
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)

</div>

---

> [!IMPORTANT]
> The Phase 3 foundation exists:
> - a Spring Boot backend with health/version endpoints and domain contracts only
> - a React frontend with the locked design system and Item, Customer and Supplier screens running
>   on mock data
>
> **No database persistence, no production backend functionality and no mapping persistence exist.**
> Database integration is blocked pending authoritative database information (Phase 4).

### At a glance

| | |
|---|---|
| **Client** | Spidosoft Technologies OPC Pvt. Ltd. |
| **Project type** | Enterprise Resource Planning platform, greenfield |
| **Current phase** | Phase 4 — Database Confirmation (of 9) |
| **Frontend** | React · TypeScript · Vite |
| **Backend** | Java 21 · Spring Boot 3.5.16 — foundation only (no persistence) |
| **Database** | To be confirmed |

### Contents

[Overview](#overview) · [Current Status](#current-status) · [Product Scope](#product-scope) ·
[Architecture](#architecture) · [Technology Stack](#technology-stack) ·
[Repository Structure](#repository-structure) · [Application Modules](#application-modules) ·
[Design System](#design-system) · [Development](#development) ·
[Environment Configuration](#environment-configuration) · [Testing & Quality](#testing--quality) ·
[API](#api) · [Database](#database) · [Engineering Principles](#engineering-principles) ·
[Known Constraints](#known-constraints--open-decisions) · [Roadmap](#roadmap) ·
[Documentation](#documentation)

---

## Overview

Spidosoft ERP is a new ERP application, built from scratch. There is no prior ERP codebase being
migrated, replaced, or extended — this is a greenfield build.

The first formal functional scope is a single Spidosoft requirement, **"ItemMaster OR Customer
and SupplierMaster Mapping"**. It shows the Item, Customer and Supplier master tables and an Item
Master mapping workflow:
- the user selects **Is Supplier** or **Is Customer** and chooses an entry by Code or Name
- **Add** places the selected entry into the GridView

How many Suppliers/Customers an Item may have, and how mappings are stored, are **not yet
confirmed**.

Everything beyond that requirement — additional ERP modules, screens, and workflows — is out of
scope until formally supplied by Spidosoft.

---

## Current Status

| Area | Status |
|---|---|
| Phase 1 — Requirements & Source Analysis | Complete · Item List and Create Item Master screenshots not yet supplied |
| Phase 2 — UI Specification & Validation | Complete · design system **locked (r5)** |
| Phase 3 — Foundation Architecture | Complete · backend foundation (health/version endpoints, error handling, domain contracts only) and frontend foundation (design system, shell, Item/Customer/Supplier screens on mock data) |
| Phase 4 — Database Confirmation | **In progress** · evidence audit in `docs/12` · blocked on authoritative database information from Spidosoft |
| Phase 5 — Database Persistence | Not started · engine and schema unconfirmed |
| Item ↔ Customer/Supplier mapping persistence | Blocked · **storage structure UNKNOWN** (`docs/12` §11) |
| Phases 6–9 — Business logic, API integration, system testing, deployment | Not started |

---

## Product Scope

Shown in the Supplied Requirement Material:

- **Item Master** — the column structure of `dbo.ItemMaster`
- **Customer Master** — the column structure of `dbo.CustomerMaster`
- **Supplier Master** — the column structure of `dbo.SupplierMaster`
- **Mapping** — an Item Master screen section where the user selects **Is Supplier** or
  **Is Customer**, picks a Supplier or Customer by Code or Name, and clicks **Add**, which places the
  selected entry into the GridView. That is the only stated rule. **Save**, **Delete** and **Clear**
  controls are shown, but what they persist is not confirmed.

Not yet confirmed:
- the level of database access the ERP requires for these tables
- how Item ↔ Supplier/Customer mappings are persisted

Referenced but not yet in scope, pending screenshots: the full Item List (search, pagination,
export, print, upload) and the full Create Item Master screen.

---

## Architecture

```
React + TypeScript + Vite        frontend/
        │  HTTP / JSON  →  /api/*
        ▼
Spring Boot + Java 21            backend/  — foundation only, no persistence
        │  JDBC
        ▼
Database — TO BE CONFIRMED
dbo.ItemMaster · dbo.CustomerMaster · dbo.SupplierMaster
```

The frontend never accesses the database directly. Business rules and validation live in the
backend and are mirrored in the UI for feedback.

> [!NOTE]
> The database engine is unconfirmed. Schema evidence (`dbo` schema, `varchar(max)` columns) is
> consistent with Microsoft SQL Server, but this has not been confirmed by Spidosoft.

---

## Technology Stack

**Frontend**

| Concern | Choice | Status |
|---|---|---|
| Framework | React + TypeScript | Installed |
| Build tool | Vite | Installed |
| Styling | CSS Modules + Variables | Installed · locked design tokens r5 |
| Routing | React Router | Installed |
| Server state | TanStack Query | Installed |
| HTTP client | Axios | Installed |
| Forms | React Hook Form + Zod | Installed |
| Icons | Lucide React | Installed |
| Lint | oxlint | Installed |

**Backend**

| Concern | Choice | Status |
|---|---|---|
| Language | Java 21 | Foundation |
| Framework | Spring Boot 3.5.16 | Foundation (no persistence) |
| Build tool | Maven (wrapper) | In use |
| Data access | JPA or JdbcTemplate | To be confirmed · no entities or repositories exist |
| Database | To be confirmed | Not started · no JDBC driver declared |
| Auth | Not specified | To be confirmed |

---

## Repository Structure

```
├── CLAUDE.md      Engineering rules, terminology, and source-of-truth policy
├── backend/       Spring Boot foundation — system endpoints, domain contracts, tests
├── docs/          Numbered project documentation (01–12)
└── frontend/      React application — design system, shell, screens on mock data
```

The visual validation prototype (`prototypes/`) was removed after the design system was implemented
and re-checked; it is preserved in git history at commit `a7023ec`.

No database code, entities, repositories or migrations exist.

---

## Application Modules

| Module | Status |
|---|---|
| Item Master (form) | UI built on mock data · persistence blocked |
| Item List (search, pagination) | UI built on mock data · Status and Last Modified are TBD · export/print/upload pending screenshots |
| Customer Master | List, detail and form shells on mock data · create/edit not in confirmed scope |
| Supplier Master | List, detail and form shells on mock data · create/edit not in confirmed scope |
| Item ↔ Customer/Supplier mapping | Add → GridView as UI state only · persistence structure **UNKNOWN** |

---

## Design System

The UI design system is **locked at revision r5** (2026-09-23).
Full specification: [`docs/06-ui-specification.md`](docs/06-ui-specification.md)

| | |
|---|---|
| **Typography** | Inter, weights 400 / 500 / 600. Tabular numbers in tables, codes, and numeric inputs. |
| **Palette** | "Steel Cobalt on Ink Neutrals" — primary `#2A5CAA` / `#234E93` / `#1D4179` · canvas `#F5F7FA` · surface `#FFFFFF` · text `#172033` / `#3F4B5F` / `#5C6877`. Single accent, no gradients, light mode only. |
| **Density** | High information density without clutter. Fixed table columns sized to content, one flexible ellipsis column, list pages fill the viewport with a scrolling table body. |
| **Components** | A design-system layer (tokens + generic accessible components) is built first and consumed by feature screens, which never define their own colors, spacing, or one-off controls. |
| **Accessibility** | WCAG 2.2 AA contrast, visible keyboard focus, semantic HTML. Checks are repeated against implemented components, not just the palette in isolation. |
| **Responsive** | Validated at 1440, 1280, and 1024px desktop widths and a 768px top-bar breakpoint. Phone/mobile layout is not yet defined. |

The lock covers the design system only — the business and database open questions below are
unaffected by it.

---

## Development

```bash
cd frontend
npm run dev          # Vite dev server → http://localhost:5173 (proxies /api → :8080)
npm run build        # tsc -b && vite build
npm run lint         # oxlint
npm run typecheck    # tsc -b --noEmit
npm run test         # Vitest unit/component tests

cd backend           # requires JDK 21
./mvnw verify            # compile + tests
./mvnw spring-boot:run   # http://localhost:8080 · Swagger UI at /api/docs/ui
```

The backend starts without a database (default `nodb` profile).

---

## Environment Configuration

The frontend reads `VITE_*` variables (see `frontend/.env.example`). The backend `db` profile has
placeholders only (`ERP_DB_*`) and is inactive by default. Database connection details and
credentials are unresolved pending the decisions in
[`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md).

---

## Testing & Quality

| Layer | Tooling | Status |
|---|---|---|
| Frontend lint | oxlint | Configured |
| Frontend types | `tsc` | Configured |
| Frontend tests | Vitest · Testing Library · jsdom · axe-core | 7 files, 74 tests passing (UI logic, mapping GridView behaviour, token contrast); no test uses a backend or database |
| Backend tests | JUnit 5 | 20 tests passing |
| Accessibility gates | axe in component tests; real-browser axe + keyboard pass | Component checks automated; browser re-check run 2026-09-24 (`docs/06` §3.3), not yet in CI |

---

## API

Only `/api/system/health` and `/api/system/version` are implemented. Domain endpoints exist as
provisional interfaces only and are not served.
[`docs/07-api-specification.md`](docs/07-api-specification.md) is a **provisional, team-authored
proposal**, not a Spidosoft requirement.

| Endpoint group | Status |
|---|---|
| Supplier/Customer option lists | Proposed · buildable once the database is confirmed |
| Item Master CRUD | Blocked · primary-key semantics of `dbo.ItemMaster` unresolved |
| Mapping persistence | Placeholder only · no shape defined until mapping storage is confirmed |

---

## Database

> [!WARNING]
> **Item ↔ Customer/Supplier mapping persistence has not been confirmed.** No mapping or junction
> table, column, or foreign key exists anywhere in the Supplied Requirement Material. Its
> structure is unknown, and no mapping schema has been designed or will be invented.

**Confirmed**
- `dbo.ItemMaster` (25 columns), `dbo.CustomerMaster` (28 columns), `dbo.SupplierMaster`
  (27 columns), with exact names, SQL types, and nullability in
  [`docs/04-database-schema.md`](docs/04-database-schema.md)
- Schema name `dbo` for all three tables
- Primary-key markers: `ItemMaster.ID` and `ItemMaster.ItemCode` (both marked PK),
  `CustomerMaster.Id`, `SupplierMaster.Id`
- Foreign-key markers on several ItemMaster and CustomerMaster columns (target tables not shown)

**Inferred**
- The database engine is likely Microsoft SQL Server (`dbo` schema, `varchar(max)` usage) — not confirmed
- `ItemMaster` likely has a composite primary key (`ID`, `ItemCode`)
- One Item can likely map to multiple Suppliers/Customers

**Unresolved**
- Database engine, version, hosting, and dev/production access
- Foreign-key target tables (Manufacturer, Category, Unit, Colour, and others)
- Save / Delete / Clear persistence semantics for the mapping screen
- Full Item Master required-field list and validation rules
- Branch scoping, audit-field population, and authentication/authorization
- **Mapping persistence structure: UNKNOWN.** No mapping table, junction table, mapping column,
  linking foreign key, stored procedure, SQL, DDL or backup was found.

Full findings: [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md)
and the evidence audit [`docs/12-database-evidence-audit.md`](docs/12-database-evidence-audit.md)

<details>
<summary><b>Column-level detail</b> — ItemMaster, CustomerMaster, SupplierMaster</summary>

| Table | Columns | Confirmed identity |
|---|---|---|
| `dbo.ItemMaster` | 25 | `ID` + `ItemCode` both marked PK (composite key inferred, not confirmed) |
| `dbo.CustomerMaster` | 28 | `Id` (PK) |
| `dbo.SupplierMaster` | 27 | `Id` (PK) |

Exact column names, SQL types, nullability, and per-column confidence ratings are in
[`docs/04-database-schema.md`](docs/04-database-schema.md). Nothing here is summarized loosely —
that file is the authoritative, evidence-cited source.

</details>

---

## Engineering Principles

From [`CLAUDE.md`](CLAUDE.md):

- Requirements-first — the Supplied Requirement Material is the functional source of truth
- Never invent business rules, database tables, relationships, or API endpoints
- Never assume the database engine
- Database validation precedes any persistence implementation
- Unknown information is marked **TO BE CONFIRMED**, never guessed
- The UI design system is locked; screens compose it rather than defining one-off styles
- Frontend and backend stay separated; the frontend talks to the backend only through the API

---

## Known Constraints & Open Decisions

Phase 4 — Database Confirmation is blocked pending Spidosoft decisions on:

1. Database engine, version, and whether an existing database must be reused
2. `ItemMaster` primary-key semantics (composite key, identity behavior, `ItemCode` uniqueness)
3. Mapping storage — an existing table definition, or approval to design a new one
4. Mapping semantics — can one Item map to both Suppliers and Customers; is it many-to-many; are duplicates allowed
5. Party identifier — is a mapping keyed by `Id` or by Code; are codes unique and mandatory
6. Exact Add / Save / Clear / Delete persistence behavior
7. Full Item Master field list, required fields, and validation rules
8. Authoritative source for paired text/foreign-key columns (e.g. `Color` vs `ColourId`) and their target tables
9. Audit-field and branch-scoping population rules
10. Confirmation of exact database column spellings against the documented schema
11. Item List scope, pending the missing reference screenshots

No database persistence or domain backend logic will be written until the items marked
backend-blocking in `docs/10` §10 are resolved. The exit criteria are in `docs/12` §14.

<details>
<summary><b>Full 11-item decision list with evidence</b></summary>

See [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md) §9
for each decision's supporting evidence IDs and the exact contradiction it resolves (C1–C17 in
that document's §2I contradiction audit). The evidence audit in `docs/12` §6 extends this list
(C1–C19).

</details>

---

## Roadmap

Per [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md), each phase starts only when
explicitly requested and its exit criteria are met. No dates are committed.

| Phase | Scope |
|---|---|
| 1 | Requirements & Source Analysis — *complete (reference screenshots outstanding)* |
| 2 | UI Specification & Validation — *complete, design system locked r5* |
| 3 | Foundation Architecture — *complete* |
| 4 | Database Confirmation — *in progress, blocked on Spidosoft* |
| 5 | Database Persistence |
| 6 | Backend Business Logic |
| 7 | Frontend API Integration |
| 8 | Integration & System Testing |
| 9 | Deployment & Production |

---

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
| [`docs/08-architecture.md`](docs/08-architecture.md) | Frontend/backend architecture (Phase 3 foundation implemented) |
| [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md) | Phased implementation plan |
| [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md) | Database & requirements validation report and decisions required from Spidosoft (Phase 4) |
| [`docs/11-spidosoft-database-confirmation.md`](docs/11-spidosoft-database-confirmation.md) | Database & backend confirmation questionnaire for Spidosoft (Phase 4) |
| [`docs/12-database-evidence-audit.md`](docs/12-database-evidence-audit.md) | Database evidence audit — confirmed / inferred / unknown / contradictory (Phase 4) |

---

<div align="center">

**Spidosoft Technologies OPC Pvt. Ltd.** · Internal engineering repository

</div>
