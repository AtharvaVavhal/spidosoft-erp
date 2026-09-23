# Visual Validation Prototype (NOT production code)

A throwaway, self-contained page that shows the **"Steel Cobalt on Ink Neutrals" (r4)** design
direction on a realistic Item Master experience, for the visual validation required by
`docs/06-ui-specification.md` §3.3.

- **Isolated:** it lives outside `frontend/`, nothing imports it, and it has no build step, no
  packages and no backend. Delete this folder once the UI is locked.
- **Status:** validation is complete. The UI design system was **LOCKED at r5** on 2026-09-23 (see
  `docs/06-ui-specification.md`). This folder remains validation evidence only, and is deleted in
  Phase 7.
- **Tokens:** every colour value is copied exactly from `06` §3.3 r4. Shadows and the dialog scrim
  use `text.primary` (`#172033`) with alpha, so no new hue is introduced.
- **Font:** Inter 400/500/600 (approved in r4, `06` §3.1), loaded from Google Fonts for this
  prototype only. How it is delivered in production is TBC (`08`).
- **Icons:** hand-inlined Lucide-style SVGs (production would use `lucide-react`).
- **Data:** all item, supplier and customer data is fictitious sample data. Item List columns (Item
  Group, Status, Last Modified, Base Unit) were requested for validation. They are **not confirmed**
  against `dbo.ItemMaster` (see `docs/02-requirements.md` Q-14).

## Open it

Open `index.html` directly in a browser. A dashed **PROTOTYPE CONTROLS** panel (bottom-right, not
part of the product UI) switches between views and states. You can also use URL hash parameters:

| Hash | Shows |
|---|---|
| `#view=list` | Item Master list (50 rows, 3 selected, bulk bar, pagination) |
| `#view=form` | Create Item Master form with validation, disabled, and the Supplier/Customer mapping section |
| `#view=dashboard` | KPI strip plus categorical and sequential chart examples |
| `&state=loading\|empty\|error` | Table states |
| `&demo=hover,focus` | Forces the hover row and the focus rings, for screenshots |
| `&dialog=1` | Delete confirmation dialog |
| `&clean=1` | Hides the prototype controls |

Real keyboard interaction also works: Tab and Shift-Tab, the row "more" menu (arrow keys, Esc),
the dialog focus trap (Esc closes it), checkbox selection and select-all, and mapping **Add** →
GridView → **Delete**.

## Screenshots

`screenshots/` contains the headless-Chrome renders (1440 px wide) used for the audit.
