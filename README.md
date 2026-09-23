<div align="center">

# Spidosoft ERP

**Enterprise Resource Planning Platform**

Built from scratch for Spidosoft Technologies OPC Pvt. Ltd.

<br/>

![Status](https://img.shields.io/badge/status-documentation_phase-8792A2?style=flat-square)
![Design System](https://img.shields.io/badge/design_system-locked_r5-2A5CAA?style=flat-square)
![Database](https://img.shields.io/badge/database-engine_unconfirmed-5C6877?style=flat-square)
![Backend](https://img.shields.io/badge/backend-not_started-A3ACB9?style=flat-square)

</div>

<br/>

> [!IMPORTANT]
> No application functionality is implemented yet. This repository currently holds project
> documentation and a frontend starter scaffold only. Read this page in full before assuming
> anything about the codebase.

<br/>

| | |
|---|---|
| **Client** | Spidosoft Technologies OPC Pvt. Ltd. |
| **Project type** | Enterprise Resource Planning platform, greenfield |
| **Current phase** | Documentation and requirement analysis (Phase 1–2 of 13) |
| **Frontend** | React · TypeScript · Vite |
| **Backend** | Java 21 · Spring Boot *(planned, not created)* |
| **Database** | To be confirmed |

<br/>

## Contents

- [Overview](#overview)
- [Current status](#current-status)
- [Product scope](#product-scope)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Application modules](#application-modules)
- [Design system](#design-system)
- [Development](#development)
- [Environment configuration](#environment-configuration)
- [Testing & quality](#testing--quality)
- [API](#api)
- [Database](#database)
- [Engineering principles](#engineering-principles)
- [Known constraints & open decisions](#known-constraints--open-decisions)
- [Roadmap](#roadmap)
- [Documentation](#documentation)

<br/>

## Overview

Spidosoft ERP is a new ERP application, built from scratch. There is no prior ERP codebase being
migrated, replaced, or extended — this is a greenfield build.

The first formal functional scope is a single Spidosoft requirement, **"ItemMaster OR Customer
and SupplierMaster Mapping"**: maintaining Item, Customer, and Supplier master data, and mapping
an Item to one or more Suppliers or Customers through an Add → GridView → Save flow.

Everything beyond that requirement — additional ERP modules, screens, and workflows — is out of
scope until formally supplied by Spidosoft.

<br/>

## Current Status

| Area | Status |
|---|---|
| Requirements analysis | Complete |
| Reference UI analysis | Complete for the mapping screen · Item List and Create Item Master screenshots not yet supplied |
| Documentation (`docs/01–10`) | Complete for Phase 1–2 scope |
| UI design system | **Locked (r5)** · not yet implemented |
| Database & requirements validation | In progress · blocked on Spidosoft decisions |
| Backend foundation | Not started |
| Frontend implementation (ERP screens) | Not started |
| Database persistence | Not started · engine and schema unconfirmed |
| Item ↔ Customer/Supplier mapping persistence | Blocked · storage structure unknown |
| Integration | Not started |
| Production deployment | Not started |

<br/>

## Product Scope

Confirmed by the Supplied Requirement Material:

- **Item Master** — read/write access to `dbo.ItemMaster`
- **Customer Master** — read/write access to `dbo.CustomerMaster`
- **Supplier Master** — read/write access to `dbo.SupplierMaster`
- **Mapping** — within the Item Master screen, select a Supplier or Customer by code or name,
  add it to an on-screen list (GridView), and save the mapping

Referenced but not yet in scope, pending screenshots: the full Item List (search, pagination,
export, print, upload) and the full Create Item Master screen.

<br/>

## Architecture

```
React + TypeScript + Vite        frontend/
        │  HTTP / JSON  →  /api/*
        ▼
Spring Boot + Java 21            backend/  — not created
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

<br/>

## Technology Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**

| Concern | Choice | Status |
|---|---|---|
| Framework | React + TypeScript | In scaffold |
| Build tool | Vite | In scaffold |
| Styling | CSS Modules + Variables | In scaffold |
| Routing | React Router | Planned |
| Server state | TanStack Query | Planned |
| HTTP client | Axios | Planned |
| Forms | React Hook Form + Zod | Planned |
| Icons | Lucide React | Planned |
| Lint | oxlint | In scaffold |

</td>
<td valign="top" width="50%">

**Backend**

| Concern | Choice | Status |
|---|---|---|
| Language | Java 21 | Not created |
| Framework | Spring Boot | Not created |
| Data access | JPA or JdbcTemplate | To be confirmed |
| Build tool | Maven or Gradle | To be confirmed |
| Database | To be confirmed | Not started |
| Auth | Not specified | To be confirmed |

</td>
</tr>
</table>

<br/>

## Repository Structure

```
├── CLAUDE.md      Engineering rules, terminology, and source-of-truth policy
├── docs/          Numbered project documentation (01–10)
└── frontend/      React + TypeScript + Vite starter scaffold (MaintenancePage only)
```

`backend/` does not exist yet. No database code, migrations, or tests exist yet.

<br/>

## Application Modules

| Module | Status |
|---|---|
| Item Master (form) | Formally defined · not implemented |
| Item List (search, pagination, export, print, upload) | Planned · scope depends on screenshots not yet supplied |
| Customer Master | Schema known · screen not yet specified |
| Supplier Master | Schema known · screen not yet specified |
| Item ↔ Customer/Supplier mapping | Functional flow specified · persistence blocked |

<br/>

## Design System

The UI design system is **locked at revision r5** (2026-09-23).
Full specification: [`docs/06-ui-specification.md`](docs/06-ui-specification.md)

<table>
<tr><td width="140"><b>Typography</b></td><td>Inter, weights 400 / 500 / 600. Tabular numbers in tables, codes, and numeric inputs.</td></tr>
<tr><td><b>Palette</b></td><td>"Steel Cobalt on Ink Neutrals" — primary <code>#2A5CAA</code> / <code>#234E93</code> / <code>#1D4179</code> · canvas <code>#F5F7FA</code> · surface <code>#FFFFFF</code> · text <code>#172033</code> / <code>#3F4B5F</code> / <code>#5C6877</code>. Single accent, no gradients, light mode only.</td></tr>
<tr><td><b>Density</b></td><td>High information density without clutter. Fixed table columns sized to content, one flexible ellipsis column, list pages fill the viewport with a scrolling table body.</td></tr>
<tr><td><b>Components</b></td><td>A design-system layer (tokens + generic accessible components) is built first and consumed by feature screens, which never define their own colors, spacing, or one-off controls.</td></tr>
<tr><td><b>Accessibility</b></td><td>WCAG 2.2 AA contrast, visible keyboard focus, semantic HTML. Checks are repeated against implemented components, not just the palette in isolation.</td></tr>
<tr><td><b>Responsive</b></td><td>Validated at 1440, 1280, and 1024px desktop widths and a 768px top-bar breakpoint. Phone/mobile layout is not yet defined.</td></tr>
</table>

The lock covers the design system only — the business and database open questions below are
unaffected by it.

<br/>

## Development

> [!NOTE]
> The repository contains only a starter scaffold today. Inspect `frontend/package.json` before
> relying on any command below.

```bash
cd frontend
npm run dev         # Vite dev server → http://localhost:5173
npm run build        # tsc -b && vite build
npm run lint          # oxlint
npm run typecheck     # tsc -b --noEmit
```

There is no backend to run — `backend/` has not been created.

<br/>

## Environment Configuration

No environment variables are defined yet. Database connection details, credentials, and backend
configuration are unresolved pending the decisions in
[`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md).

<br/>

## Testing & Quality

| Layer | Tooling | Status |
|---|---|---|
| Frontend lint | oxlint | Configured |
| Frontend types | `tsc` | Configured |
| Frontend tests | — | Not set up |
| Backend tests | — | No backend exists |
| Accessibility gates | axe, keyboard walkthroughs, contrast checks | Documented in `docs/08`, not implemented |

<br/>

## API

No API is implemented. [`docs/07-api-specification.md`](docs/07-api-specification.md) is a
**provisional, team-authored proposal** — not a Spidosoft requirement.

| Endpoint group | Status |
|---|---|
| Supplier/Customer option lists | Proposed · buildable once the database is confirmed |
| Item Master CRUD | Blocked · primary-key semantics of `dbo.ItemMaster` unresolved |
| Mapping persistence | Placeholder only · no shape defined until mapping storage is confirmed |

<br/>

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

Full findings: [`docs/10-database-requirements-validation.md`](docs/10-database-requirements-validation.md)

<br/>

## Engineering Principles

From [`CLAUDE.md`](CLAUDE.md):

- Requirements-first — the Supplied Requirement Material is the functional source of truth
- Never invent business rules, database tables, relationships, or API endpoints
- Never assume the database engine
- Database validation precedes any persistence implementation
- Unknown information is marked **TO BE CONFIRMED**, never guessed
- The UI design system is locked; screens compose it rather than defining one-off styles
- Frontend and backend stay separated; the frontend talks to the backend only through the API

<br/>

## Known Constraints & Open Decisions

Phase 2 is blocked pending Spidosoft decisions on:

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

No backend code will be written until the items marked backend-blocking in `docs/10` §10 are resolved.

<br/>

## Roadmap

Per [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md), each phase starts only when
explicitly requested and its exit criteria are met. No dates are committed.

| Phase | Scope |
|---|---|
| 1 | Documentation and requirement analysis — *in progress* |
| 2 | Database discovery and confirmation — *in progress, blocked on Spidosoft* |
| 3 | Architecture and data model |
| 4 | Spring Boot backend foundation |
| 5 | Database integration |
| 6 | REST APIs |
| 7 | React application foundation and design system implementation |
| 8 | ERP shared modules |
| 9 | Item Master |
| 10 | Customer/Supplier mapping |
| 11 | Integration |
| 12 | Testing |
| 13 | Production readiness |

<br/>

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

<br/>

<div align="center">

—

**Spidosoft Technologies OPC Pvt. Ltd.**
Internal engineering repository

</div>
