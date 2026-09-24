# 09 · Implementation Plan

The New ERP Implementation starts from zero. Each phase starts only when the user explicitly asks
for it, and its exit criteria must be met before moving on. Scope is limited to the formal
requirement in `02-requirements.md` plus items later confirmed by Spidosoft.

**Phase numbering (standardized 2026-09-24).** The project uses the 9 phases below. Earlier
documents, commit messages and branch names may use an older 13-phase numbering. The table at the
end maps old numbers to new ones. Historical commits and branches are not renamed.

## Phase 1 — Requirements & Source Analysis ✅ (one open item)
- `CLAUDE.md` and `docs/01–09` written from the Supplied Requirement Material.
- Outstanding: Item List and Create Item Master Reference Screenshots (not yet in `docs/source/`).
- **Exit:** the user has reviewed the docs and all Reference Screenshots are documented in `03`/`06`.

## Phase 2 — UI Specification & Validation ✅
- Design system: visually validated with `prototypes/visual-validation/`. **UI DESIGN SYSTEM —
  LOCKED** on 2026-09-23 at revision r5 (`06-ui-specification.md`).

## Phase 3 — Foundation Architecture ✅ delivered 2026-09-24
Delivered at the project owner's request, covering only the parts that do not depend on the
unresolved database questions:
- backend foundation and domain contracts: `backend/` (Java 21, Spring Boot), config via env vars,
  a health endpoint, an error format, and a test setup
- frontend design system, shell and routes: React Router, TanStack Query, Axios, React Hook Form,
  Zod and Lucide React installed; design system built from `06-ui-specification.md` (tokens as CSS
  Variables; Inter 400/500/600; core components with the r4 system rules); app shell (sidebar, top
  bar, page panel), an API client module, and the Vite `/api` proxy
- Item Master UI and Customer/Supplier shells, on mock adapters
- the mapping GridView, as UI state only

Remaining from this phase:
- Re-run the accessibility checks on the implemented components.
- Delete `prototypes/visual-validation/`.

**Exit:** the backend builds and tests run; the shell runs, and typecheck and lint pass.

## Phase 4 — Database Confirmation ⏳ in progress
- Findings recorded 2026-09-23 in `10-database-requirements-validation.md` (with `04` rewritten as
  the evidence-based schema). **Waiting on Spidosoft decisions** (`10` §9). Backend-blocking items
  are listed in `10` §10.
- Confirmation questionnaire: `11-spidosoft-database-confirmation.md`. Evidence audit:
  `12-database-evidence-audit.md` (**mapping persistence structure: UNKNOWN**, `12` §11).
- Confirm with Spidosoft: DB engine/version, dev access, whether the `dbo.` tables are a
  specification or an actual schema, **mapping storage and save strategy**, ItemMaster PK
  (`ID` + `ItemCode`), FK targets (including Manufacturer), and uniqueness of `CustCode`/`SuppCode`.
- Resolve Q-1 to Q-15 in `02-requirements.md`.
- Resolve the Item List data questions raised (not answered) by the visual prototype
  (`06-ui-specification.md` §7): ItemMaster Status, Last Modified, Item Group mapping, Base Unit
  mapping (`UOM` vs `UnitId`), Code ↔ Name linkage, and any other rule the prototype only
  illustrated.
- **Exit:** every blocking TO BE CONFIRMED item is answered or explicitly accepted as an assumption.
  The detailed checklist is in `12` §14.

## Phase 5 — Database Persistence
- Finalise the data-access approach left open in `08`.
- Define the data model exactly as confirmed. Any new table (e.g. mapping) needs written approval
  from Spidosoft.
- Connect to the confirmed database with no schema auto-generation, and map the three tables
  exactly as specified.
- **Exit:** data model approved, and read-only queries against the confirmed schema succeed.

## Phase 6 — Backend Business Logic
- Build the supplier/customer option endpoints, then the Item and mapping endpoints once unblocked
  (`07-api-specification.md`).
- Test them with integration tests and a manual HTTP client, and move `07` from PROVISIONAL to final.
- **Exit:** endpoints are tested and documented.

## Phase 7 — Frontend API Integration
- Wire the UI to the live APIs (replacing the mock adapters), and handle loading, error and success
  states.
- Item Master: apply the confirmed field list. If confirmed in scope, also build Item List, Search,
  Pagination, Create New, Edit, Export Excel, Print, Upload Excel and Back.
- Customer/Supplier mapping: "Select Type & Add Supplier/Customer to List" (the radios, Select Code /
  Select Name, **Add → GridView**, Delete, Save and Clear), following
  `05-mapping-functional-flow.md` with the confirmed rules applied.
- **Exit:** the screens match the confirmed spec.

## Phase 8 — Integration & System Testing
- End-to-end: select, Add, GridView, Save, and reload shows the saved mappings.
- Frontend and backend tests, plus a requirement checklist against `02` and `05`.
- Edge cases: empty selection, duplicates, null codes/names, duplicate names, long `varchar(max)` values.
- **Exit:** all tests pass and the user/Spidosoft sign off.

## Phase 9 — Deployment & Production
- Environment config, secrets handling, build and deployment pipeline, logging, and final docs.
  Hosting target is **TO BE CONFIRMED**.
- **Exit:** ready to deploy.

---

### Legacy phase numbering (before 2026-09-24)

| Old phase | Old name | Now |
|---|---|---|
| 1 | Documentation and requirement analysis | Phase 1 (the design-system lock is Phase 2) |
| 2 | Database discovery and confirmation | Phase 4 |
| 3 | Architecture and data model | Architecture → Phase 3 · data model → Phase 5 |
| 4 | Spring Boot backend foundation | Phase 3 |
| 5 | Database integration | Phase 5 |
| 6 | REST APIs | Phase 6 |
| 7 | React application foundation | Phase 3 |
| 8 | ERP modules | Phase 3 (shared components) |
| 9 | Item Master | Phase 3 (UI on mock data) · Phase 7 (confirmed fields, API) |
| 10 | Customer/Supplier mapping | Phase 3 (GridView UI state) · Phase 7 (confirmed rules, API) |
| 11 | Integration | Phase 7 (API wiring) · Phase 8 (end-to-end) |
| 12 | Testing | Phase 8 |
| 13 | Production readiness | Phase 9 |

References to "Phase 7" in `06-ui-specification.md` and `08-architecture.md` use the old numbering.
They refer to the React application foundation, which was delivered in the new Phase 3.
