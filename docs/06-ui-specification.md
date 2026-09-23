# 06 · UI Specification (Target ERP)

This describes the UI **we will build** for the New ERP Implementation. **Nothing here is implemented
yet.**

| Label | Meaning in this doc |
|---|---|
| **REQ** | Formal Spidosoft requirement: fields, labels, workflow, actions. Must be preserved. |
| **REF** | Seen in the Spidosoft Reference UI (`03-reference-ui.md`). Functional/visual reference only. |
| **STD** | PROJECT UI STANDARD, the quality bar set by the project owner (§1–§5) |
| **LOCKED** | Part of the locked UI design system (r5). It changes only through an explicit, recorded revision approved by the project owner. |
| **PROPOSED** | A development-team choice **outside** the locked design system (e.g. screen wireframes, route paths), finalised when that screen is specified |
| **TBC** | To be confirmed |

## Revision history

| Rev | Date | Change |
|---|---|---|
| r1 | 2026-09-23 | Colour direction "Steel Cobalt on Ink Neutrals" introduced (§3.3) |
| r2 | 2026-09-23 | Accessibility refinements: `text.tertiary`, chart orange, `border.control` placement rule (§3.3) |
| r3 | 2026-09-23 | `text.tertiary` → `#5C6877` (§3.3) |
| r5 | 2026-09-23 | Final additions: **toolbar** stays on one row at ≥1280px, and the search field may shrink to 200px min before any wrapping (§5); **fixed table columns** are sized for their longest expected value, with a date/time baseline of 160px and the validated 980px Item Master minimum preserved (§3.2). No automatic sidebar collapse at 1280px. **UI design system LOCKED.** |
| r4 | 2026-09-23 | Visual-validation resolutions approved by the project owner (prototype: `prototypes/visual-validation/`): **(1)** typography family Inter 400/500/600 (§3.1); **(2)** toolbar Search is a secondary button (§5); **(3)** sequential step 4 `#4C77BC` → `#4974B9`, plus a chart label rule (§3.3); **(4)** table column geometry (§3.2); **(5)** list-page height (§4); **(6)** row-level Delete treatment (§3.2, §6.2); **(7)** system tokens for panel radius, sidebar active state, required marker, shadows and backdrop (§3.1, §3.2); **(8)** top-bar responsiveness (§2, §4) |

## UI DESIGN SYSTEM — LOCKED

| Item | Locked value |
|---|---|
| Lock date | **2026-09-23** (final review decision: PASS, by the project owner) |
| Final revision | **r5** |
| Font | **Inter**, weights 400 / 500 / 600. Tabular numbers in tables, item/party codes and numeric inputs. Plus Jakarta Sans not used for the ERP. |
| Palette | **"Steel Cobalt on Ink Neutrals"** (§3.3): primary `#2A5CAA` / `#234E93` / `#1D4179` / subtle `#E1E9F6` / on-primary `#FFFFFF`; neutrals `#F5F7FA` `#FFFFFF` `#F0F3F7` `#E6EAF0`; borders `#E6EAF0` `#D5DBE3` `#8792A2`; text `#172033` `#3F4B5F` `#5C6877` `#A3ACB9`; semantic success/warning/danger as in §3.3; categorical `#2A5CAA #B86B1E #3E9B8A #8A6BB0 #C4567F #7B8798`; sequential `#E1E9F6 #B7CAE8 #7FA0D3 #4974B9 #2A5CAA #1D4179`. Light mode only (dark mode deferred). |
| Scope of the lock | §1–§5 of this document: quality bar, accessibility rules, foundations, components, colour system, layout conventions and data-heavy patterns |
| Responsive validation dimensions | 1440×900 and 1440×1900 (full form), **1280×800** (normal desktop minimum), 1024×700, **768×700** (top-bar breakpoint). Phone/mobile layout is **TBD** and not part of the lock. |
| Validation evidence | `prototypes/visual-validation/` (isolated prototype + screenshots) |

**Outside the UI lock:** all business and database TBDs remain open and are **not** resolved by this
lock or by the prototype. That includes ItemMaster Status, Last Modified, Item Group mapping, Base
Unit mapping, Code ↔ Name linkage, mapping storage and save behaviour, required-field sets, and every
item in `02-requirements.md` §5 and `04-database-schema.md`. Screen-level content in §6–§9 (fields,
columns, wireframes) follows the requirements and is finalised per screen. Accessibility checks
must still be **repeated on the implemented components** in Phase 7.

The only UI in the repository today is the scaffold's `MaintenancePage`. Leave it untouched unless
explicitly instructed. Its decorative style (gradient ring, glows, blur animations, dark hero) is
**not** the ERP visual language.

---

## 1. UI quality bar (STD)

The new Spidosoft ERP must have a **world-class, production-grade UI/UX**.

**Reference Screenshots are references, not the ceiling.** From them we preserve:
- required fields
- required business terminology (exact labels, e.g. "Is Supplier", "Select Code", "Add")
- required workflows (e.g. select, Add, bind to GridView)
- required actions (Add, Delete, Save, Clear, …)
- required data relationships, once confirmed

Everything else about the visual design is built **from scratch** on a modern enterprise design
system. Do not copy the screenshots pixel-for-pixel.

**Target quality**
- **Linear-level clarity:** every screen has one obvious primary task, hierarchy comes from
  typography and spacing rather than boxes, and chrome is quiet.
- **Vercel-level visual discipline:** a restrained neutral palette, one accent colour, crisp 1px
  borders, a consistent grid, and no ornament.
- **Enterprise ERP usability:** fast keyboard-driven data entry, predictable layouts across
  modules, and dense data that stays readable.
- **High information density without clutter.**

**Not allowed**
- generic admin-dashboard templates or their look (big stat cards, gradient headers, sidebar
  "widgets")
- excessive gradients, glassmorphism, blur and translucent layers
- oversized cards, or padding that wastes screen space
- unnecessary animation. Motion is limited to short, functional transitions (≤150–200 ms) and
  respects `prefers-reduced-motion`.
- decorative UI that reduces information density

**Design system first.** The design system (§3) is built and reviewed before multiple ERP screens are
implemented. Screens compose design-system components only.

**The standard never overrides the requirement.** Fields, labels and actions are not added,
removed or renamed for aesthetic reasons. Screen-level features suggested by §5 (sorting, bulk
actions, etc.) are **TBC** for each screen until confirmed in scope.

---

## 2. Accessibility and usability (STD, mandatory)

| Area | Rule |
|---|---|
| Keyboard | Every action is reachable and operable by keyboard. Logical tab order. Drop-downs, menus, dialogs and tables follow WAI-ARIA Authoring Practices keyboard patterns. `Esc` closes overlays. |
| Focus | Always-visible `:focus-visible` ring: 2px `primary.600` (`#2A5CAA`) ring with a white offset (§3.3). Focus is trapped in dialogs/drawers and restored on close. |
| Contrast | WCAG 2.2 AA minimum: 4.5:1 body text, 3:1 large text, UI component boundaries and focus indicators. |
| Semantics | Native elements first: `<button>`, `<a>`, `<label for>`, `<fieldset>/<legend>` for radio groups, `<table>` with `<th scope>` for data. ARIA only where native semantics are insufficient. |
| Validation | Errors appear inline under the field with text (not colour alone), are linked via `aria-describedby`, and focus moves to a summary or the first invalid field on submit. Required fields are marked. |
| Responsive | Usable from ≥1280px desktop (primary) down to tablet (validated around **768px**). Phone/mobile layout is **TBD** unless requirements later establish it. Top-bar rules are in §4. No horizontal page scroll. Wide tables scroll inside their own container with sticky first column/header. |
| Targets | Minimum 24×24px pointer target (WCAG 2.5.8), with 32px as the default control height. |
| Announcements | Toasts and async status use `aria-live` regions. |

---

## 3. Design system

All values are **LOCKED (r5)** and are implemented as CSS Variables in Phase 7. Components are built
on these tokens only.

### 3.1 Foundations

| Token group | Locked value (r5) |
|---|---|
| **Typography** | **Inter** (r4, approved), weights **400 / 500 / 600** only. Plus Jakarta Sans (currently loaded by the scaffold's `MaintenancePage`) is **not** used for the ERP. Scale: 12 / 13 / **14 (base)** / 16 / 20 / 24px. Line-height 1.4 for UI and 1.5 for prose. **Tabular numbers** (`font-variant-numeric: tabular-nums`) are mandatory in tables, item/party codes (e.g. `RM-1001`, `SMSP0001`) and numeric inputs. No stylistic alternates. No mono family for codes (tabular Inter is used instead). |
| **Colour** | Semantic tokens only. Palette: **"Steel Cobalt on Ink Neutrals"** (§3.3, **LOCKED r5**). Ink neutrals plus a single steel-cobalt primary. Status colours are used only for status. **Light mode is the primary v1 experience. Dark mode is deferred**, but tokens are structured so it can be added later. |
| **Spacing** | 4px base: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48. |
| **Sizing** | Control heights: `sm` 28, **`md` 32 (default)**, `lg` 36. Table rows: compact 32, default 36, comfortable 44. Sidebar 240 expanded / 56 collapsed. Icons 16 (default) and 14/20. |
| **Radius** | 4 (inputs, buttons, badges, checkboxes 3), **6 (panels/cards, menus, popovers)**, 8 (dialogs, drawers). No pill-shaped controls. Avatars and radio buttons are circular. |
| **Borders** | 1px. `border.subtle` for dividers inside surfaces, `border.default` for structural edges (cards, tables, panels), `border.control` for input/select/checkbox boundaries, with controls placed on `bg.surface` (§3.3). Borders separate content, not shadows. |
| **Shadows** | Minimal, derived from `text.primary` (`#172033` = `rgb(23 32 51)`) with alpha, so there is no new hue. `shadow.none` for in-page surfaces (panels use borders). `shadow.sm` = `0 1px 2px rgb(23 32 51 / 0.08), 0 2px 6px rgb(23 32 51 / 0.06)` for dropdowns, menus and popovers. `shadow.md` = `0 12px 32px rgb(23 32 51 / 0.16), 0 2px 6px rgb(23 32 51 / 0.08)` for dialogs, drawers and toasts. |
| **Overlay** | `overlay.scrim` = `rgb(23 32 51 / 0.40)` (`text.primary` at 40%) behind modal dialogs and drawers. |
| **Motion** | 100–200 ms ease-out for overlays/state changes only. Disabled under `prefers-reduced-motion`. |
| **Z-index** | Named layers: dropdown, sticky, drawer, dialog, toast, tooltip. |
| **Icons** | Lucide React, 16px, `currentColor`. Icon-only buttons always carry an accessible name. |

### 3.2 Components

Each component defines its variants, sizes, states (default, hover, active, focus-visible, disabled,
loading, invalid where relevant) and keyboard behaviour.

| Component | Specification |
|---|---|
| **Button** | Variants: primary, secondary, ghost, danger. Sizes sm/md/lg. Optional leading icon. Loading state keeps the width and shows a spinner with `aria-busy`. **One filled primary button per view.** |
| **Icon button** | Square, same heights, `aria-label` required, tooltip on hover/focus. |
| **Input** | Label above, optional hint, inline error. Prefix/suffix slots (e.g. ₹, %). Numeric inputs right-aligned with tabular figures. Read-only is visually distinct from disabled. |
| **Select** | Native `<select>` for short static lists. **Combobox** (searchable, typeahead, keyboard, virtualised for long lists) for master-data lists such as Select Code / Select Name. |
| **Radio group / segmented control** | `<fieldset>` + `<legend>`. A segmented control is allowed when built on real radio inputs. |
| **Checkbox** | Includes an indeterminate state for table "select all". |
| **Table / data grid** | Sticky header. Column alignment rules (§5). Sortable headers with `aria-sort`. Row selection uses a checkbox **plus** `primary.subtle` row background. Row actions in a trailing column or overflow menu. Zebra striping off, hover highlight on. Density toggle. Horizontal scroll within its container. Empty, loading and error states built in.  **Column geometry (r4):** stable columns (checkbox, codes, group/type, unit, status, dates, actions) have **fixed widths** (`table-layout: fixed` + `<colgroup>`). One **flexible** column per table (for Item Master, **Item Name**) takes the remaining width and **truncates with an ellipsis**, with the full value available on hover/focus. **Fixed columns are sized to fit their longest expected value** (r5), e.g. **date/time baseline 160px** ("23 Sep 2026, 09:00" at 13px Inter + cell padding); a fixed column's value must never truncate, and only the flexible column truncates. Every table defines a **minimum width** (Item Master list: **980px**, validated to fit a 1280px viewport with the expanded sidebar without horizontal scroll), and below it the table **scrolls horizontally inside its panel**, never the page. **Loading, empty, error and loaded states use the same column geometry**, so there is no layout shift. |
| **Pagination** | Page size selector, "x–y of N", first/prev/next/last, page jump. Keyboard operable. |
| **Badge** | Neutral, success, warning and danger variants. Info is neutral with a primary-coloured icon (no separate info blue). Small, text first, never the only carrier of meaning. |
| **Dropdown menu** | For overflow actions. Arrow-key navigation, type-ahead, `Esc` closes, focus returns to the trigger. |
| **Dialog** | Modal with focus trap, title and description, and primary/secondary actions right-aligned. Sizes sm/md/lg. |
| **Row-level Delete** | (r4) Default: ghost button, `text.secondary` + trash icon + the label **"Delete"**. Hover/active: danger treatment (`danger.text` on `danger.tint`). Focus: the standard focus ring. Repeated per-row Delete actions are **never permanently red**; danger fill is reserved for the confirm button in a Confirmation dialog. |
| **Confirmation dialog** | For destructive or irreversible actions. States the consequence, and the danger button names the action (e.g. "Delete"), not "OK". |
| **Drawer** | Side panel for detail/edit without losing list context. Same focus rules as Dialog. |
| **Navigation** | Collapsible left sidebar in the **canvas family** (light, not a dark sidebar), with module groups (sections TBC) and keyboard support. Expanded by default; collapsing is a user action. There is **no automatic collapse** at 1280px (r5). Item states (r4): default `text.secondary` with a `text.tertiary` icon; hover `bg.muted`; **active** = `bg.surface` (white) fill + 1px `border.default` outline + `text.primary` label + **`primary.600` icon** (the only blue in the sidebar); disabled `text.disabled`. A top bar holds breadcrumbs, global search (TBC) and the user menu (TBC). |
| **Breadcrumbs** | `<nav aria-label="Breadcrumb">`. Last item is `aria-current="page"`. |
| **Tabs** | WAI-ARIA tabs pattern with arrow-key navigation, for splitting long forms (use TBC per screen). |
| **Alert** | Inline banner (success/warning/danger use their tint/border/text; info uses `bg.subtle`, `text.secondary` and a `primary.600` icon) with icon and text, optionally dismissible. For persistent page-level messages. |
| **Toast** | Transient feedback for completed actions (e.g. saved). Bottom-right, `aria-live="polite"`, auto-dismiss ~5 s (errors persist), max 3 stacked. |
| **Loading state** | Inline spinners for actions, a top progress bar for route transitions. Never block the whole screen unless unavoidable. |
| **Skeleton state** | Matches the final layout shape (table rows, form fields). Used for first load, with no layout shift. |
| **Empty state** | Short title, one-line explanation, and a primary action where relevant. Plain text, no illustrations. |
| **Error state** | Explains what failed, with a retry action. Field errors are inline, page errors use an Alert, and failed data loads use an in-table error row. |
| **Form layout** | Responsive 12-column grid: 2–3 field columns on desktop, 1 on narrow viewports. Section headings group related fields. A sticky action bar (Save/Clear, …) at the bottom of long forms. |
| **Required field marker** | (r4) An asterisk `*` after the label in `danger.text`, hidden from screen readers (`aria-hidden`), with the field carrying `required`/`aria-required`. **Every form with required fields shows an explanatory note at the top** (e.g. "Fields marked * are required."). |

### 3.3 Colour system: "Steel Cobalt on Ink Neutrals"

> **Steel Cobalt on Ink Neutrals is LOCKED (r5, 2026-09-23).**
> It is **not implemented** yet: no CSS variables or components exist. Implementation happens in Phase 7.
> The Spidosoft Reference Screenshots are functional/UI references and **do not dictate this
> palette**.
>
> **Goal:** meet the appropriate accessibility requirements while keeping a restrained, premium
> enterprise visual language. The goal is **not** to maximise contrast everywhere.
>
> **Constraints:** a single accent (primary), **no secondary accent colour**, **no gradients**, and
> **no dark mode yet** (light mode is the v1 experience). Colour changes are made only when needed to
> resolve a documented accessibility issue.

#### Revision log
| Rev | Change | Reason |
|---|---|---|
| r1 | Initial direction (external design critique) | – |
| r2 | `text.tertiary` `#616D80` → `#5F6B7A` | `#616D80` on `bg.muted` = 4.34:1, below 4.5:1 AA |
| r2 | Chart categorical orange `#D9822B` → **`#B86B1E`** | `#D9822B` on white = 2.93:1, below the 3:1 non-text target. `#B86B1E` = 4.07:1. |
| r2 | `border.control` `#8792A2` **unchanged**, usage rule added | 3.15:1 on white passes, and 2.94:1 on canvas does not. This is resolved by placement, not by darkening. |
| r2 | Token names normalised (`bg.*`, `border.*`, `text.*`), `on-primary` added, info and chart-chrome tokens defined | Consistency |
| r4 | Sequential step 4 `#4C77BC` → **`#4974B9`**, plus a label rule (dark on steps 1–3, white on 4–6) | White labels on `#4C77BC` = 4.49:1 (below 4.5:1). `#4974B9` = 4.69:1. Found during visual validation, and approved. |
| r3 | `text.tertiary` `#5F6B7A` → **`#5C6877`** (option a, chosen by project owner) | `#5F6B7A` was still 4.493:1 on `bg.muted` and 4.44:1 on `primary.subtle`. `#5C6877` = 4.70 / 4.64:1, with minimal visual change. This keeps the system consistent without a component-specific usage restriction, so the temporary r2 rule is removed. |

#### Primary (steel cobalt)
| Token | Hex | Use |
|---|---|---|
| `primary.600` | `#2A5CAA` | Filled primary button, focus ring, selection indicators, info icon |
| `primary.700` | `#234E93` | Primary button hover, **all links** |
| `primary.800` | `#1D4179` | Primary button pressed |
| `primary.subtle` | `#E1E9F6` | Selected row/item background |
| `on-primary` | `#FFFFFF` | Text/icons on primary fills |

#### Neutrals (ink)
| Token | Hex | Use |
|---|---|---|
| `bg.canvas` | `#F5F7FA` | App background, **sidebar** (canvas family, not a dark sidebar) |
| `bg.surface` | `#FFFFFF` | Panels, forms, tables, dialogs. **The default home for form controls.** |
| `bg.subtle` | `#F0F3F7` | Table header, grouped sections, hover, info alert background |
| `bg.muted` | `#E6EAF0` | Pressed/neutral fills, inactive segments |
| `border.subtle` | `#E6EAF0` | Row dividers, in-surface separators, chart gridlines |
| `border.default` | `#D5DBE3` | Panel/table/card edges |
| `border.control` | `#8792A2` | Input, select, checkbox, radio boundaries (see the usage rule) |
| `text.primary` | `#172033` | Body text, values, headings |
| `text.secondary` | `#3F4B5F` | Labels, secondary content, info alert text |
| `text.tertiary` | `#5C6877` | Hints, metadata, placeholders, chart axis text |
| `text.disabled` | `#A3ACB9` | Disabled text only |

**`border.control` usage rule**
- Form controls normally sit on `bg.surface` (`#FFFFFF`), where `#8792A2` gives about **3.15:1**
  (meets 3:1 non-text).
- Avoid `border.control` directly against `bg.canvas` (`#F5F7FA`, 2.94:1) or `bg.subtle`
  (`#F0F3F7`, 2.83:1) wherever the 3:1 non-text requirement applies. If a control has to sit on
  those backgrounds (e.g. a filter bar on canvas), give the control a `bg.surface` fill or place it
  inside a surface container, and validate it.
- Do **not** solve this by making every border darker. `border.subtle` and `border.default` stay
  light, because they are structural, not control-identifying.

#### Semantic
| Status | `.solid` | `.text` | `.tint` | `.border` |
|---|---|---|---|---|
| `success` | `#16803C` | `#146C36` | `#EAF6EE` | `#BFE0CB` |
| `warning` | `#A16207` | `#8A5200` | `#FFF7E6` | `#F3D9A4` |
| `danger` | `#C62828` | `#B71C1C` | `#FDECEC` | `#F5C2C2` |

**Info:** no independent blue info colour. Info uses `bg.subtle` background, `text.secondary` text
and a `primary.600` icon.

#### Data visualisation
- **Categorical (in order):** `#2A5CAA`, `#B86B1E`, `#3E9B8A`, `#8A6BB0`, `#C4567F`, `#7B8798`
- **Sequential (light → dark):** `#E1E9F6`, `#B7CAE8`, `#7FA0D3`, **`#4974B9`** (r4, was `#4C77BC`), `#2A5CAA`, `#1D4179`
- **Labels on sequential fills (r4):** steps 1–3 use dark labels (`text.primary`); steps 4–6 use white labels (`on-primary`).
- **Chart chrome:** gridlines use `border.subtle`, and axis text uses `text.tertiary`.
- **Never** use success or danger colours as chart series.

#### Usage rules
1. One filled primary button per view.
2. Links use `primary.700`.
3. Focus: a clearly visible 2px `primary.600` ring with a white offset.
4. Selection: `primary.subtle` background **plus** a checkbox.
5. Status never relies on colour alone. Always pair it with text and/or an icon.
6. Expected states stay visually quiet.
7. Exceptions are visually stronger.
8. Never use success/danger colours as chart series.
9. Avoid excessive blue. Primary is for action, focus and selection, not decoration or large fills.
10. No gradients, glassmorphism, neon colours or unnecessary decorative effects.
11. Light mode is the primary v1 experience.
12. Dark mode is deferred.
13. The sidebar uses the canvas family, not a dark sidebar.
14. Keep a restrained enterprise visual language.
15. No secondary accent colour.

#### Contrast pre-check (r4, computed WCAG 2.x ratios; WCAG thresholds are not rounded)
| Pair | Ratio | Target | Result |
|---|---|---|---|
| `text.primary` on surface / canvas / muted | 16.27 / 15.16 / 13.47 | 4.5 | ✅ |
| `text.primary` on `primary.subtle` (selected row) | 13.32 | 4.5 | ✅ |
| `text.secondary` on surface / canvas / subtle / muted | 8.81 / 8.21 / 7.92 / 7.30 | 4.5 | ✅ |
| `text.tertiary` `#5C6877` on surface / canvas / subtle | 5.67 / 5.29 / 5.10 | 4.5 | ✅ |
| `text.tertiary` `#5C6877` on `bg.muted` | 4.70 | 4.5 | ✅ |
| `text.tertiary` `#5C6877` on `primary.subtle` (selected row) | 4.64 | 4.5 | ✅ |
| `on-primary` on `primary.600` / `.700` / `.800` | 6.54 / 8.13 / 10.07 | 4.5 | ✅ |
| `primary.700` (links) on surface / canvas / `primary.subtle` | 8.13 / 7.58 / 6.66 | 4.5 | ✅ |
| `primary.600` icon on `bg.subtle` (info) | 5.88 | 3.0 | ✅ |
| Focus ring `primary.600` on surface / canvas | 6.54 / 6.10 | 3.0 | ✅ |
| `border.control` on surface | 3.15 | 3.0 | ✅ |
| `border.control` on canvas / subtle | 2.94 / 2.83 | 3.0 | ⚠️ By design, so use the placement rule |
| White on success / warning / danger `.solid` | 5.02 / 4.92 / 5.62 | 4.5 | ✅ |
| `.text` on own `.tint` (success / warning / danger) | 5.86 / 5.99 / 5.75 | 4.5 | ✅ |
| Categorical on white: `#2A5CAA` `#B86B1E` `#3E9B8A` `#8A6BB0` `#C4567F` `#7B8798` | 6.54 / 4.07 / 3.35 / 4.37 / 4.21 / 3.65 | 3.0 | ✅ all |
| Categorical on canvas: same order | 6.10 / 3.79 / 3.13 / 4.07 / 3.93 / 3.40 | 3.0 | ✅ all |
| Sequential labels: `text.primary` on steps 1 / 2 / 3 | 13.32 / 9.78 / 6.10 | 4.5 | ✅ |
| Sequential labels: white on steps 4 (`#4974B9`) / 5 / 6 | 4.69 / 6.54 / 10.07 | 4.5 | ✅ |
| Sequential step 4 `#4974B9` as a fill on surface | 4.69 | 3.0 | ✅ |
| `text.disabled` on surface | 2.29 | exempt | Disabled only, never essential info |

**Result (r4):** all documented text pairs meet 4.5:1, and all non-text pairs meet 3:1, with one
exception. `border.control` on `bg.canvas`/`bg.subtle` is intentionally below 3:1 and is handled by
the placement rule above (controls sit on `bg.surface`). `text.tertiary` has **no usage
restriction** by background.

#### Validation requirements
Accessibility validation **must be repeated after the palette is implemented in real components**.
Computed pairs above are a pre-check only, because real rendering (anti-aliasing, font weight/size,
opacity, overlays, states) can change effective contrast.

Visual validation must include, at minimum:
- Item Master table with about 50 rows (density, scanability, alignment)
- Item Master form
- Sidebar / navigation
- Search / filter controls (including `border.control` placement)
- Buttons (primary, secondary, ghost, danger, and all states)
- Status badges
- Selected rows
- Hover states
- Keyboard focus (focus ring on every control type and background)
- Empty states
- Error states (field, page, in-table)
- Dashboard / chart example (categorical and sequential, gridlines, axis text)

Each check covers WCAG 2.2 AA (text 4.5:1 / large text 3:1 / non-text 3:1), keyboard-only
operation, and a subjective review against the "restrained, premium enterprise" bar.

**Result:** visual validation ran on 2026-09-23 using `prototypes/visual-validation/`. Findings were
resolved in r4, and final additions were made in r5. The final review decision was **PASS**, and the
design system was **LOCKED at r5**. The checklist above still applies to the implemented components
in Phase 7 (repeat the accessibility checks on real components).

---

## 4. Screen layout conventions (STD, LOCKED r5)
- **App shell:** left sidebar, top bar (breadcrumbs), and a content area with max-width only for forms.
  Tables use the full width.
- **Top bar (r4):** a single row whose items **never wrap**. When space is constrained:
  - breadcrumbs collapse to **"… / Current Page"**, with the full path available from the "…"
  - the branch name **truncates with an ellipsis**, with its full name in the accessible name/tooltip
  - the user name/role text may hide, leaving the avatar button
  - critical actions (branch switch, help, account menu) always stay reachable

  Validate this around the **768px** breakpoint. Phone/mobile layout is **TBD**.
- **List pages (r4):** fill the available viewport height. The page header, toolbar and table header
  stay visible, the **table body takes the remaining vertical space and scrolls**, and **pagination
  stays visible** (pinned to the bottom of the table panel). Pagination must not fall below the fold at
  normal desktop sizes (≥1280×800).
- **Page header:** title, optional description, and primary action top-right (e.g. Create New, TBC per
  screen).
- **Forms:** labels above inputs, logical field order, and primary action in the sticky action bar.
- **Keyboard shortcuts** (e.g. save, focus search) are **TBC**, and are always discoverable when present.

## 5. Data-heavy screen patterns (STD)
- **Scanability:** restrained colour, a clear header row, and a subtle hover row.
- **Row density:** 36px default, with a compact 32px option.
- **Alignment:** text left, numbers and currency right with tabular figures, status centred or left
  (consistent per table). Codes (e.g. `SMCX0002`) are left-aligned in Inter with tabular numbers (r4).
- **Sorting/filtering:** visible sort indicators, one sort column by default, filters shown as
  removable chips, and state kept in the URL.
- **Search:** debounced, with a clear button and the result count shown. Server-side for large data (TBC).
- **Toolbar Search action (r4):** the **Search** button is a **secondary** button, never filled primary.
  **Enter** in the search field runs the search. The page's single filled primary action stays the
  create action (e.g. **Create New**), which preserves the one-filled-primary-per-view rule.
- **Toolbar layout (r5):** at viewport widths **≥1280px** the toolbar stays on **one row**. The search
  field is the flexible element and may shrink to a **minimum width of 200px** before any wrapping
  is considered. Below 1280px, wrapping is allowed, with the result count and table settings
  staying together at the end.
- **Actions:** per-row actions in a consistent place, destructive actions confirmed, and bulk actions in
  a contextual bar shown when rows are selected. Bulk operations only where confirmed in scope.
- **Responsive:** container horizontal scroll, sticky key column, and non-essential columns may hide
  at narrow widths (per screen, TBC).

---

## 6. Item Master screen with Mapping

### 6.1 Item Master fields
Visible in the Reference UI, with labels preserved exactly:

| Label | Control (target) | Likely column (ASSUMPTION) |
|---|---|---|
| Material | Input | `ItemMaster.Material` |
| Manufacturer Name | Select/Combobox, placeholder `--Select--` (REF) | `ItemMaster.ManufacturerId` |
| HSN Code | Input | `ItemMaster.HSNCODE` |
| GST Rate | Numeric input (REF default `0`) | `ItemMaster.GSTRate` |
| Purchase Cost | Numeric input (REF default `0`) | `ItemMaster.PurchaseCost` |
| Selling Price | Numeric input | `ItemMaster.SellingPrice` |

The full field list, order, required fields and validation are **TBC** (the upper form is not visible,
and the Create Item Master screenshot has not been supplied).

### 6.2 Mapping section
**Section title (REQ):** "Select Type & Add Supplier/Customer to List"

Required elements (REQ), redesigned with the design system (PROPOSED):

| Element (REQ label) | Target component |
|---|---|
| **Is Supplier** / **Is Customer** | Radio group (may render as a segmented control on real radios) with `<legend>` |
| **Select Code** | Combobox, searchable, placeholder "Select Code" |
| **Select Name** | Combobox, searchable, placeholder "Select Name" |
| **Add** | Secondary button beside the selectors. Disabled/invalid rules TBC. |
| **GridView**: **S.No**, **Customer Code**, **Customer Name**, **Action** (Customer); Supplier headers TBC | Compact data table |
| **Delete** (row action) | Row-level Delete (§3.2, r4): `text.secondary` + trash icon + label "Delete" by default, danger treatment on hover. Confirmation TBC. |
| Empty grid (REF "No entries added yet.") | Table empty state |
| **Save**, **Clear** | Sticky form action bar, with Save as primary |

Proposed wireframe (structure only, not the final visual design):

```
Item Master › New                                           (breadcrumb, TBC)
──────────────────────────────────────────────────────────────────────────────
 Item details
 Material [__________]            Manufacturer Name [--Select--      ▾]
 HSN Code [__________]            GST Rate          [          0     ]
 Purchase Cost [    0 ]           Selling Price     [                ]
──────────────────────────────────────────────────────────────────────────────
 Select Type & Add Supplier/Customer to List
 Type  (•) Is Supplier  ( ) Is Customer
 Select Code [Select Code ▾]   Select Name [Select Name ▾]   [ Add ]
 ┌──────┬───────────────┬──────────────────────────────┬────────┐
 │ S.No │ Customer Code │ Customer Name                │ Action │
 ├──────┼───────────────┼──────────────────────────────┼────────┤
 │    1 │ SMCX0002      │ A-One Aluminium Works        │ Delete │
 └──────┴───────────────┴──────────────────────────────┴────────┘
──────────────────────────────────────────────────────────────────────────────
                                              [ Clear ]  [ Save ]  (sticky)
```

### 6.3 Interaction states: TBC
The Reference UI suggests these, but none is confirmed as a rule:
- Save disabled while the grid is empty
- the type radio locks once rows exist
- selectors reset after Add

Loading, error and empty states for the drop-downs and grid follow §3.2. Toast feedback after Save
(PROPOSED) depends on Save behaviour, which is TBC. See `05-mapping-functional-flow.md`.

## 7. Item List screen: TBC
The brief names Search, Pagination, Create New, Export Excel, Print and Edit. The Reference
Screenshot (`item-list-existing.png`) is **not in `docs/source/`**. When it is confirmed, this screen
follows the §5 patterns.

**Open requirements (TBD). Not resolved by the visual prototype.** The prototype used the columns
Item Group, Item Type, Base Unit, Status and Last Modified **as sample data only**. The following must
be resolved during database/requirements validation (Phase 2):
- **ItemMaster Status**: `dbo.ItemMaster` has no status column. Whether an item status exists, and its
  values, is TBD.
- **ItemMaster Last Modified**: no modification timestamp exists. `SystEmentryDate` is an entry date;
  do not treat it as "last modified" without confirmation.
- **Item Group mapping**: which column or lookup supplies "Item Group" (e.g. `CategoryId`,
  `SubCategoryId`, `ItemType`) is TBD.
- **Base Unit mapping**: `UOM` (text) vs `UnitId` (FK) is TBD (see `04-database-schema.md`).
- **Code ↔ Name linkage** in the mapping selectors (Q-3): TBD. The prototype's linked behaviour is
  not a rule.
- Any other business rule the prototype shows (bulk actions, "On hold"/"Blocked" statuses, the
  required-field set, the Selling Price below Purchase Cost warning) is **illustrative only** and TBD.

## 8. Create Item Master screen: TBC
The brief names Save, Upload Excel and Back. The Reference Screenshot
(`create-item-master-existing.png`) is **not in `docs/source/`**. Whether it is the same screen as §6
is TBC.

## 9. Navigation and routes: TBC
The Reference UI sidebar labels are mostly truncated. Module grouping and route paths are decided in
Phase 7 (React Router).
