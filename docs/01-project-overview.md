# 01 · Project Overview

## Project

We are building a new ERP application from scratch for Spidosoft Technologies OPC Pvt. Ltd.

This is a **New ERP Implementation**. No prior ERP codebase is being modified, migrated,
replaced or extended.

## Client

**Spidosoft Technologies OPC Pvt. Ltd.**

## Supplied Requirement Material

| File | Role |
|---|---|
| `docs/source/Item Master OR Customer And Supplier Master Mapping Problem STMT - ERP APP.docx` (5 pages, 9 embedded images) | **Formal functional source** |
| `item-list-existing.png`, `create-item-master-existing.png` | Reference Screenshots. **Named by the user but not yet present in `docs/source/`. TO BE CONFIRMED** |

The requirement is titled **"11) ItemMaster OR Customer and SupplierMaster Mapping"**. The "11)"
suggests it belongs to a larger numbered set of requirements that has not been supplied.
**TO BE CONFIRMED**

## Current scope (FORMAL REQUIREMENT)

1. Database structures **`dbo.ItemMaster`**, **`dbo.CustomerMaster`** and **`dbo.SupplierMaster`**
   (see `04-database-schema.md`).
2. The **Mapping** UI inside Item Master: Supplier/Customer selection, **Add**, and the **GridView**.
   *"If you click on the add button, the data should be bind in the GridView below."*
   (see `05-mapping-functional-flow.md`).

Item List, Search, Pagination, Create New, Edit, Export Excel, Print, Upload Excel and Back are
listed in the project brief as Reference UI content. Their scope and behaviour are **TO BE
CONFIRMED** until the Reference Screenshots are supplied (see `03-reference-ui.md`).

## Current repository state

| Item | State |
|---|---|
| `frontend/` | Phase 3 foundation: locked design system r5, app shell, routes, Item Master UI (list/create/view-edit + mapping GridView), Customer/Supplier shells. **Domain data comes from mock adapters.** |
| Backend | Phase 3 foundation (Spring Boot 3.5.16 / Java 21): system endpoints plus domain **contracts only**; mapping deferred |
| Database code | None (engine TBD) |
| Tests | Backend JUnit (16 tests). Frontend verified by typecheck, lint, build and a scripted browser walkthrough. |
| Docs | `CLAUDE.md`, `docs/01–10`, `docs/source/`, `backend/README.md`, `frontend/README.md` |

## Technology stack (TECHNICAL DECISION)

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Axios, React Hook Form, Zod, CSS Modules, CSS Variables, Lucide React |
| Backend | Java 21, Spring Boot |
| Database | **TO BE CONFIRMED.** The requirement uses `dbo.` objects. MySQL must not be assumed. |

All of the above are installed (Phase 3). Backend: Spring Boot 3.5.16 with a Maven wrapper; details in `08`.

## Development stage

Documentation and UI lock are done. **Phase 2 (database/requirements validation) is open**, waiting on
Spidosoft (`10`). The **Phase 3 foundation** is built on top of what is confirmed (see `09`).
