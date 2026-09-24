# CLAUDE.md

Guidance for Claude Code (and any contributor) working in this repository.

## Project context

- **Client:** Spidosoft Technologies OPC Pvt. Ltd.
- **Project:** a new industrial ERP application, **built from scratch**. There is no
  prior ERP codebase that this project modifies, migrates, replaces or extends.
- **First functional scope:** the Spidosoft requirement
  **"11) ItemMaster OR Customer and SupplierMaster Mapping"**. It covers `dbo.ItemMaster`,
  `dbo.CustomerMaster`, `dbo.SupplierMaster` and mapping an Item to Suppliers/Customers through a
  GridView.
- **Repository today (Phase 3 foundation, 2026-09-24):**
  - `frontend/`: the locked design system (r5), app shell, routes and Item/Customer/Supplier UI backed
    by **mock data-source adapters**. The mapping GridView is UI state only. The old
    `MaintenancePage` is kept but no longer routed.
  - `backend/`: Spring Boot 3.5.16 / Java 21 foundation. Only `/api/system/health` and `/version`
    are implemented. Domain modules are **contracts only**, and mapping is a placeholder
    (persistence deferred).
  - **No database code, entities, repositories or migrations exist.**
- **Documentation:** `docs/01-…12-*.md`. Read them before starting any task. `docs/10` is the
  database & requirements validation report and `docs/12` the database evidence audit (both
  Phase 4). Together they are the source of truth for what is CONFIRMED / INFERRED / TBD before
  backend work. **Mapping persistence structure: UNKNOWN** (`docs/12` §11).

## Current project status

**Phase 3 — Foundation Architecture built** (2026-09-24). The UI design system is **LOCKED (r5)**.
**Phase 4 — Database Confirmation is in progress:** it is waiting on the Spidosoft decisions in
`docs/10` §9, and its exit criteria are in `docs/12` §14.

Phase numbering (standardized, `docs/09`): 1 Requirements & Source Analysis · 2 UI Specification &
Validation · 3 Foundation Architecture · 4 Database Confirmation · 5 Database Persistence ·
6 Backend Business Logic · 7 Frontend API Integration · 8 Integration & System Testing ·
9 Deployment & Production.

Until the backend-blocking items in `docs/10` §10 are resolved, do NOT create:
- JPA entities, repositories or service implementations
- migrations
- mapping persistence
- authentication or branch-scoped persistence

Frontend domain data stays on mock adapters until then. Start further work only when the user
explicitly asks for it.

## Permanent rules

1. This ERP is being built from scratch.
2. The frontend is a foundation (design system + shell + mock adapters); it holds no confirmed business persistence.
3. Supplied screenshots are **reference specifications** for the Target ERP.
4. Never treat screenshots as evidence of an existing codebase.
5. Never invent requirements.
6. Never invent database relationships.
7. Never invent database tables.
8. Never assume the database engine.
9. Mark unknown information as **TO BE CONFIRMED**.
10. Inspect before modifying.
11. Do not implement before the relevant specification is documented.
12. Keep frontend and backend concerns separated.
13. Use the supplied Spidosoft requirement as the functional source of truth.

## Terminology

Use: **Spidosoft Reference UI**, **Reference Screenshots**, **Supplied Requirement Material**,
**Target ERP**, **New ERP Implementation**.

Do not use "existing ERP", "legacy ERP" or "existing application" for the screenshots. "Existing"
may only describe things that actually exist in this repository.

## Source-of-truth rules

In priority order:

1. **Supplied Requirement Material** in `docs/source/`. The formal functional source is the 5-page
   `Item Master OR Customer And Supplier Master Mapping Problem STMT - ERP APP.docx`. Reference
   Screenshots, embedded or separate, are supporting design/functional references.
2. The repository code, for what is actually implemented. Today that is only the scaffold.
3. `docs/*.md`. These are derived documents. If they conflict with `docs/source/`, the source wins,
   so fix the doc.

Label every statement in the docs with one of these:

| Label | Meaning |
|---|---|
| **FORMAL REQUIREMENT** | Stated in the Spidosoft requirement document (text, or shown as the requirement in its images) |
| **REFERENCE UI OBSERVATION** | Visible in a Reference Screenshot; guides the design but is not a stated rule |
| **TECHNICAL DECISION** | Chosen by the development team, not by Spidosoft |
| **PROJECT UI STANDARD** | UI/UX quality bar set by the project owner (see "UI quality bar"); governs *how* screens look and behave, never *what* business data/workflow they contain |
| **ASSUMPTION** | Working guess, must be validated |
| **TO BE CONFIRMED** | Unknown, so ask Spidosoft and don't guess |

Do not infer backend behaviour (persistence, transactions, validation rules) from how a
screenshot looks.

Preserve source spellings exactly (e.g. `SystEmentryDate`, `HSNCODE`, `supptypeid`, `Color` vs
`ColourId`) and do not silently correct them.

## Inspect before modifying

- Read the relevant files and docs before changing anything.
- Check `git status` before and after work, and don't touch unrelated files.
- Do not modify, redesign or remove `MaintenancePage` unless explicitly asked.
- Do not install packages, create backend code, or create migrations unless the current task
  explicitly asks for it.

## Planned technology stack (TECHNICAL DECISION)

| Layer | Stack | Status |
|---|---|---|
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Axios, React Hook Form, Zod (+ @hookform/resolvers), CSS Modules, CSS Variables, Lucide React | Installed (Phase 3) |
| Backend | Java 21 + Spring Boot 3.5.16, Maven wrapper, Spring Web/Validation/Data JPA, springdoc, MapStruct, Lombok, JUnit 5 | Foundation (Phase 3), no database |
| Database | **TO BE CONFIRMED** | The source shows `dbo.` objects. Do **not** assume MySQL. |

## Database safety rules

- Use table and column names exactly as in `docs/04-database-schema.md`
  (`dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster`).
- Do not convert the supplied tables into MySQL DDL or JPA entities until the engine and schema are
  confirmed.
- Never run DDL (CREATE/ALTER/DROP), destructive DML, or migrations against any shared or client
  database without explicit approval.
- Never let an ORM auto-generate or auto-update the schema (`ddl-auto` must be `none`/`validate`).
- No mapping table exists in the supplied material. Do not create one until Spidosoft confirms how
  mappings are stored.
- Never commit credentials or connection strings. Use environment variables.

## UI quality bar (PROJECT UI STANDARD)

The Target ERP must have a world-class, production-grade UI/UX. Full spec: `docs/06-ui-specification.md`.

- **Reference Screenshots are functional and visual references, not the visual ceiling.** Preserve
  their required fields, business terminology, workflows, actions and (once confirmed) data
  relationships. Design the visuals from scratch, and do not copy them pixel-for-pixel.
- Target: Linear-level clarity, Vercel-level visual discipline, modern enterprise ERP usability,
  and high information density without clutter.
- **Forbidden:** generic admin-dashboard templates, excessive gradients, glassmorphism, oversized
  cards, unnecessary animation, and decorative UI that reduces density. The scaffold's
  `MaintenancePage` style (glows, gradient ring, blur reveals) is **not** the ERP visual language.
- **Design system first.** Build the reusable design system (tokens + core components, see `06` §3)
  before implementing multiple ERP screens. Screens compose design-system components, and don't
  hand-roll one-off styles or hard-code colours/spacing (use CSS Variables tokens).
- **Accessibility is mandatory:** keyboard navigation, visible focus states, WCAG 2.2 AA contrast,
  semantic HTML controls (real `<button>`, `<label>`, `<table>`, etc.), responsive behaviour, and clear
  validation feedback.
- **Data-heavy screens:** scanability, compact but comfortable rows, strong column alignment
  (numbers right-aligned, tabular figures), predictable sorting/filtering, efficient search, clear
  actions, bulk operations where appropriate, and responsive behaviour.
- **UI DESIGN SYSTEM — LOCKED** (2026-09-23, final revision **r5**). The lock record is in
  `docs/06-ui-specification.md` ("UI DESIGN SYSTEM — LOCKED"). Do not alter locked values or rules
  without an explicit, recorded revision approved by the project owner. The lock covers the UI
  design system only. **Business and database TBDs remain open and outside the lock.**
- **Colour direction:** Steel Cobalt on Ink Neutrals, **LOCKED (r5)**. The authoritative token list,
  usage rules, contrast pre-check and validation checklist are in `docs/06-ui-specification.md` §3.3.
  Keep this file and `docs/08-architecture.md` consistent with it. Key points:
  - `primary.600 #2A5CAA`, `primary.700 #234E93` (hover, **links**), `primary.800 #1D4179` (pressed),
    `primary.subtle #E1E9F6`, `on-primary #FFFFFF`
  - neutrals: `bg.canvas #F5F7FA`, `bg.surface #FFFFFF`, `bg.subtle #F0F3F7`, `bg.muted #E6EAF0`;
    `border.subtle #E6EAF0`, `border.default #D5DBE3`, `border.control #8792A2`;
    `text.primary #172033`, `text.secondary #3F4B5F`, `text.tertiary #5C6877`,
    `text.disabled #A3ACB9`
  - `border.control` passes 3:1 only on white, so **form controls sit on `bg.surface`**. Don't place
    them bare on `bg.canvas`/`bg.subtle`, and don't "fix" this by darkening every border.
  - info has no blue of its own: `bg.subtle` + `text.secondary` + `primary.600` icon
  - charts: categorical `#2A5CAA #B86B1E #3E9B8A #8A6BB0 #C4567F #7B8798`; sequential
    `#E1E9F6 #B7CAE8 #7FA0D3 #4974B9 #2A5CAA #1D4179` (step 4 changed in r4), with dark labels on
    steps 1–3 and white labels on steps 4–6; gridlines `border.subtle`, axis text `text.tertiary`.
    Never use success/danger as series.
  - one filled primary button per view, 2px `primary.600` focus ring with a white offset, selection =
    `primary.subtle` + checkbox, and status never by colour alone
  - expected states stay quiet and exceptions stand out; avoid excessive blue
  - **no secondary accent, no gradients, no glassmorphism/neon, no dark mode yet** (light mode is
    v1), and the sidebar uses the canvas family
  - the goal is appropriate accessibility with a restrained, premium enterprise look, not maximum
    contrast everywhere. Change colours only to resolve a documented accessibility issue.
  - accessibility validation was repeated on the real components on 2026-09-24 (`06` §3.3). Repeat it
    whenever components or screens change materially, and visual
    validation covers the checklist in `06` §3.3
  - the Spidosoft Reference Screenshots do **not** dictate the palette
- **Design-system rules (r4 + r5, locked)** (details in `docs/06-ui-specification.md`; these are
  system rules, not one-off component choices):
  - **Typography:** **Inter** 400/500/600. Tabular numbers in tables, item/party codes and numeric
    inputs. **Do not use Plus Jakarta Sans for the ERP.**
  - **Toolbar Search** is a secondary button, and Enter runs the search. The create action stays the
    single filled primary. At ≥1280px the toolbar stays on one row, and the search field shrinks to a
    200px minimum before any wrapping (r5).
  - **Tables:** fixed widths for stable columns, **each sized to fit its longest expected value**
    (date/time baseline 160px, r5), one flexible column (Item Name) that truncates with an ellipsis,
    a minimum width (Item Master list 980px, validated), horizontal scroll inside the panel, and the
    same column geometry in loading/empty/error/loaded states.
  - **List pages** fill the viewport height. The table body scrolls, and the header, toolbar and
    pagination stay visible.
  - **Row-level Delete:** `text.secondary` + trash icon + "Delete", danger only on hover. Never
    permanently red.
  - **Tokens:** panel radius 6px; sidebar active = white fill + `border.default` outline +
    `primary.600` icon; required marker = asterisk in `danger.text` plus a note at the top of the form;
    shadows and the modal scrim use `text.primary` (`rgb(23 32 51)`) with documented alphas.
  - **Top bar:** never wraps. Breadcrumbs collapse to "… / Current Page", the branch name truncates,
    and critical actions stay reachable. Validate around 768px. Phone layout is TBD.
- **The visual prototype resolves no business or database question.** Item Status, Last Modified,
  Item Group mapping, Base Unit mapping, Code ↔ Name linkage and any other rule it displays stay
  **TBD** until database/requirements validation (see `06` §7).
- The visual validation prototype (`prototypes/visual-validation/`) was removed on 2026-09-24 after the
  accessibility re-check on the real components, as planned in `docs/09`. It remains available as
  design-lock evidence in git history at commit `a7023ec` (`git show a7023ec:prototypes/visual-validation/README.md`).
  Never import from it.
- The palette is implemented (Phase 3, `frontend/src/styles/design-tokens.css`). Change a locked value
  only through a recorded revision approved by the project owner.
- The UI standard never overrides the requirement. Do not add, remove or rename business fields,
  labels or actions for aesthetic reasons. Features such as bulk operations or sorting on a given
  screen still need to be confirmed as in scope.

## Coding principles

- Match the surrounding code style (strict TypeScript, CSS Modules, oxlint).
- Keep frontend and backend separated: UI in `frontend/`, business rules and data access in the
  backend. The frontend talks to the backend only through the API.
- Keep changes small and scoped, and don't refactor unrelated code.
- Use Spidosoft's labels and terminology in UI and code ("Is Supplier", "Is Customer",
  "Select Code", "Select Name", "Add", "Save", "Clear").
- Validate on the backend as well as the frontend.
- Report outcomes honestly. If lint, typecheck or tests fail, say so.

## Documentation rules

- Docs live in `docs/` as Markdown, numbered `NN-topic.md`.
- Every fact is labelled per the table above.
- When a TO BE CONFIRMED item is resolved, update the relevant doc, record where the answer came
  from, and remove it from the open lists.
- Do not copy personal data from source files (author e-mails etc.) into docs.

## Commands

```bash
cd frontend
npm run dev        # Vite dev server, http://localhost:5173 (proxies /api → :8080)
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run typecheck  # tsc -b --noEmit
npm run test       # Vitest unit/component tests (no backend or database)

cd backend         # JDK 21 required; on this machine it sits beside JDK 17:
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
./mvnw verify            # compile + tests
./mvnw spring-boot:run   # http://localhost:8080, Swagger UI at /api/docs/ui
```

In backend code, search for `@Tbd`, and in frontend code for `TBD —`, to find every place waiting on a
Spidosoft decision.
