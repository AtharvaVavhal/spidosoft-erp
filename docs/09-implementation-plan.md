# 09 · Implementation Plan

The New ERP Implementation starts from zero. Each phase starts only when the user explicitly asks
for it, and its exit criteria must be met before moving on. Scope is limited to the formal
requirement in `02-requirements.md` plus items later confirmed by Spidosoft.

## Phase 1: Documentation and requirement analysis ⏳ in progress
- `CLAUDE.md` and `docs/01–09` written from the Supplied Requirement Material.
- Design system: visually validated with `prototypes/visual-validation/`. **UI DESIGN SYSTEM —
  LOCKED** on 2026-09-23 at revision r5 (`06-ui-specification.md`).
- Outstanding: Item List and Create Item Master Reference Screenshots (not yet in `docs/source/`).
- **Exit:** the user has reviewed the docs and all Reference Screenshots are documented in `03`/`06`.

## Phase 2: Database discovery and confirmation ⏳ in progress
- Findings recorded 2026-09-23 in `10-database-requirements-validation.md` (with `04` rewritten as
  the evidence-based schema). **Waiting on Spidosoft decisions** (`10` §9). Backend-blocking items
  are listed in `10` §10.
- Confirm with Spidosoft: DB engine/version, dev access, whether the `dbo.` tables are a
  specification or an actual schema, **mapping storage and save strategy**, ItemMaster PK
  (`ID` + `ItemCode`), FK targets (including Manufacturer), and uniqueness of `CustCode`/`SuppCode`.
- Resolve Q-1 to Q-15 in `02-requirements.md`.
- Resolve the Item List data questions raised (not answered) by the visual prototype
  (`06-ui-specification.md` §7): ItemMaster Status, Last Modified, Item Group mapping, Base Unit
  mapping (`UOM` vs `UnitId`), Code ↔ Name linkage, and any other rule the prototype only
  illustrated.
- **Exit:** every blocking TO BE CONFIRMED item is answered or explicitly accepted as an assumption.

> **Phase 3 foundation — delivered 2026-09-24 at the project owner's request.** It pulls forward the
> parts of Phases 4 and 7–10 that do not depend on the unresolved questions:
> - backend foundation and domain contracts
> - frontend design system, shell and routes
> - Item Master UI and Customer/Supplier shells, on mock adapters
> - the mapping GridView, as UI state only
>
> Still gated on Phase 2 (`10` §10): data model and entities, database integration (Phase 5),
> domain REST implementations (Phase 6), mapping persistence, authentication and branch scoping, and
> replacing the mock adapters (Phase 11).

## Phase 3: Architecture and data model
- Finalise the choices left open in `08` (build tool, data-access approach, backend port).
- Define the data model exactly as confirmed. Any new table (e.g. mapping) needs written approval
  from Spidosoft.
- **Exit:** data model and architecture approved.

## Phase 4: Spring Boot backend foundation
- Scaffold `backend/` (Java 21, Spring Boot), with config via env vars, a health endpoint, an error
  format, and a test setup.
- **Exit:** the backend builds and tests run.

## Phase 5: Database integration
- Connect to the confirmed database with no schema auto-generation, and map the three tables
  exactly as specified.
- **Exit:** read-only queries against the confirmed schema succeed.

## Phase 6: REST APIs
- Build the supplier/customer option endpoints, then the Item and mapping endpoints once unblocked
  (`07-api-specification.md`).
- Test them with integration tests and a manual HTTP client, and move `07` from PROVISIONAL to final.
- **Exit:** endpoints are tested and documented.

## Phase 7: React application foundation
- Install and configure React Router, TanStack Query, Axios, React Hook Form, Zod and Lucide React
  (explicit approval first).
- Precondition met: the UI design system is **LOCKED** (r5, 2026-09-23).
- Build the design system first, from `06-ui-specification.md` (tokens as CSS Variables; Inter
  400/500/600; core components with the r4 system rules), then the app shell (sidebar, top bar,
  page panel), an API client module, and the Vite `/api` proxy.
- Re-run the accessibility checks on the implemented components, and delete
  `prototypes/visual-validation/`.
- **Exit:** the shell runs, and typecheck and lint pass.

## Phase 8: ERP modules
- Build module navigation and shared components (form layout, drop-downs, grid, buttons) per
  `06-ui-specification.md`.
- **Exit:** shared components are ready for Item Master.

## Phase 9: Item Master
- Build the Item Master form using the confirmed field list. If confirmed in scope, also build
  Item List, Search, Pagination, Create New, Edit, Export Excel, Print, Upload Excel and Back.
- **Exit:** the screens match the confirmed spec.

## Phase 10: Customer/Supplier mapping
- Build "Select Type & Add Supplier/Customer to List": the radios, Select Code / Select Name,
  **Add → GridView**, Delete, Save and Clear, following `05-mapping-functional-flow.md`.
- **Exit:** the flow behaves as specified, with confirmed rules applied.

## Phase 11: Integration
- Wire the UI to the live APIs, and handle loading, error and success states.
- **Exit:** end-to-end: select, Add, GridView, Save, and reload shows the saved mappings.

## Phase 12: Testing
- Frontend and backend tests, plus a requirement checklist against `02` and `05`.
- Edge cases: empty selection, duplicates, null codes/names, duplicate names, long `varchar(max)` values.
- **Exit:** all tests pass and the user/Spidosoft sign off.

## Phase 13: Production readiness
- Environment config, secrets handling, build and deployment pipeline, logging, and final docs.
  Hosting target is **TO BE CONFIRMED**.
- **Exit:** ready to deploy.
