# 03 · Spidosoft Reference UI

## Purpose

Document the UI and workflow shown in the screenshots supplied by Spidosoft, for use while
building the new ERP.

> **The screenshots are reference specifications for the new ERP.
> They do not represent an existing codebase in this repository.**

The New ERP Implementation's own screens (Phase 3 foundation) are built from the locked design system
(`06`), not copied from these screenshots.

Each screen below separates:
- **Visible UI facts**: what the image shows
- **Demonstrated behaviour**: what a sequence of images shows happening
- **Assumptions / TO BE CONFIRMED**

## Reference material inventory

| Reference | Location | Status |
|---|---|---|
| Mapping UI, images 7, 8, 9 | Embedded in the requirement `.docx` | ✅ Available, documented in §3 |
| Item List | `docs/source/item-list-existing.png` | ❌ **Not present in `docs/source/`. TO BE CONFIRMED** |
| Create Item Master | `docs/source/create-item-master-existing.png` | ❌ **Not present in `docs/source/`. TO BE CONFIRMED** |

---

## 1. Item List reference screen: NOT YET SUPPLIED

The project brief says this screen shows Search, Pagination, Create New, Export Excel, Print and
Edit. **None of these can be documented until the screenshot is available.** Fields, table
columns, labels, search behaviour, pagination behaviour and control placement are all
**TO BE CONFIRMED**.

## 2. Create Item Master reference screen: NOT YET SUPPLIED

The project brief says this screen shows Save, Upload Excel and Back. Field list, layout, labels,
validation and the behaviour of these controls are **TO BE CONFIRMED** until the screenshot is
available.

Images 7–9 show part of the Item Master form (§3.2). They may overlap with this screen, but that
cannot be established yet.

---

## 3. Mapping reference screen (requirement images 7–9)

### 3.1 Page context: visible UI facts
- Browser address shown: `localhost:3000/Masters/ItemMasterCo`. It may be truncated. This is the
  environment where the screenshots were captured, not a requirement for our routes.
- Dark left navigation sidebar. The only fully readable entry is **"Item Master JDBC"**. The others
  are truncated ("Ite…", "Co…", "Ma…", "Su…", "Cu…", "Em…"). Their full labels are
  **TO BE CONFIRMED**.
- Content panel headed **"Item Master"** with a collapse "–" control at top right.

### 3.2 Item Master fields: visible UI facts
The upper part of the form is scrolled out of view in every image.

| Label | Control | Value shown |
|---|---|---|
| Material | Text input | empty |
| Manufacturer Name | Drop-down | `--Select--` |
| HSN Code | Text input | empty |
| GST Rate | Text input | `0` |
| Purchase Cost | Text input | `0` |
| Selling Price | Text input | empty |

Layout: two columns of label/input pairs with bold labels.

### 3.3 Mapping section: visible UI facts
- Sub-panel titled **"Select Type & Add Supplier/Customer to List"**, with a cyan top border.
- Radios **Is Supplier:** (left) and **Is Customer:** (right).
- **Select Code:** drop-down (left) and **Select Name:** drop-down (right).
- **Add** button (blue), below Select Code.
- GridView below Add:
  - with Customer selected, headers **S.No | Customer Code | Customer Name | Action**
  - with Supplier selected, only "…upplier Name" and "Action" are visible (the open drop-down covers the rest)
  - empty text **"No entries added yet."**
- **Save** (blue) and **Clear** (orange), centred below the section.

Sample drop-down data:
- Supplier → Select Code: `SMSP0001` … `SMSP0007`.
- Customer → Select Name: `ABCDXYZ`, `A-One Aluminium Works`, `A-One Aluminium Works`, `ABCDXYZ`,
  `ABCDXYZ`, `Updated John Doe`, `wtagg`, `ABCDXYZ`, `customer 2customer 2`.

This is sample data only. It shows that names can repeat.

### 3.4 Demonstrated behaviour
| # | Shown | Images |
|---|---|---|
| B-1 | Only one of Is Supplier / Is Customer is selected at a time | 7, 8 |
| B-2 | The selected type changes the drop-down contents (codes `SMSP…` vs customer names) | 7, 8 |
| B-3 | The GridView headers follow the selected type (Customer … vs …upplier …) | 7, 8 |
| B-4 | After **Add**, the grid shows the row `1 \| SMCX0002 \| A-One Aluminium Works \| [Delete]` (FORMAL, per text R-5) | 9 |
| B-5 | After Add, both drop-downs show their placeholders again | 9 |
| B-6 | Each grid row has a red **Delete** button in Action | 9 |

### 3.5 Visible state (appearance only, rule not established)
- Is Supplier appears greyed out after a Customer row was added (image 9).
- Save appears lighter/inactive with an empty grid (images 7–8) and solid with one row (image 9).

### 3.6 Assumptions / TO BE CONFIRMED
- Whether the state changes in 3.5 are intended rules (type lock, Save disabled until a row exists).
- The Supplier-mode GridView headers ("Supplier Code / Supplier Name" is an **ASSUMPTION**).
- Whether Code and Name are linked, and whether both are required.
- What Delete, Save and Clear actually do, including any persistence effect. This cannot be
  inferred from the images.
- The complete Item Master field list.
- The navigation structure (sidebar entries).
